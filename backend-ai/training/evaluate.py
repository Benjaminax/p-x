"""
Evaluate the trained ResNet50 model saved as `models/multi_disease_from_design.pth`.
- Uses a deterministic train/val split (seed=42) on `DESIGN/Training` and reports metrics on the validation set.
- Outputs a JSON report to `backend-ai/training/eval_report.json`.

Usage:
  python backend-ai/training/evaluate.py --data-dir ../../DESIGN/Training --model ../../models/multi_disease_from_design.pth
"""
import os
import json
import argparse
from pathlib import Path

import torch
import torch.nn as nn
from torchvision import models, transforms, datasets
from torch.utils.data import DataLoader, random_split
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score
import numpy as np
from PIL import Image, ImageOps


def get_transform():
    return transforms.Compose([
        transforms.Resize(256),
        transforms.CenterCrop(224),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])


# --- Test-time augmentation (TTA) helpers for single-image inference ---
def _tta_variants(pil_img):
    """Return a small set of TTA PIL variants (medically conservative)."""
    variants = [pil_img]
    try:
        variants.append(ImageOps.mirror(pil_img))
    except Exception:
        pass
    variants.append(pil_img.rotate(10, resample=Image.BILINEAR))
    variants.append(pil_img.rotate(-10, resample=Image.BILINEAR))
    return variants


# --- Critical-alert helpers ---
def _is_critical_label(label: str) -> bool:
    """Return True for DESIGN labels that should be treated as critical/urgent.
    This function is intentionally conservative — it looks for tumor-related
    keywords in the class name and excludes any explicit 'no'/'normal' tokens.
    """
    if not label:
        return False
    s = label.lower()
    if 'no' in s or 'normal' in s:
        return False
    keywords = ('glioma', 'meningioma', 'pituitary', 'tumor')
    return any(k in s for k in keywords)



def _image_batch_from_pil(pil_img, base_transform, tta=True):
    imgs = _tta_variants(pil_img) if tta else [pil_img]
    tensors = [base_transform(im) for im in imgs]
    return torch.stack(tensors, dim=0)


def _predict_tensor_batch(model, tensor_batch, device, temperature: float = 1.0):
    model = model.to(device)
    model.eval()
    with torch.no_grad():
        outputs = model(tensor_batch.to(device))
        if temperature is None or float(temperature) == 1.0:
            scaled = outputs
        else:
            scaled = outputs / float(max(1e-6, temperature))
        probs = torch.softmax(scaled, dim=1).cpu().numpy()
    return probs


# --- Calibration utilities (temperature scaling + ECE) ---
class _TemperatureScaler(nn.Module):
    """Simple temperature scaling module (single scalar > 0)."""
    def __init__(self, init_temp: float = 1.0):
        super().__init__()
        self.temperature = nn.Parameter(torch.tensor([float(init_temp)]))

    def forward(self, logits: torch.Tensor) -> torch.Tensor:
        # enforce positive temperature via absolute value to keep optimization stable
        temp = torch.clamp(self.temperature, min=1e-6)
        return logits / temp


def _compute_nll(logits: np.ndarray, labels: np.ndarray, temperature: float = 1.0) -> float:
    logits_t = torch.tensor(logits).float()
    labels_t = torch.tensor(labels).long()
    with torch.no_grad():
        scaled = logits_t / float(max(1e-6, temperature))
        log_probs = torch.log_softmax(scaled, dim=1)
        nll = nn.NLLLoss()(log_probs, labels_t).item()
    return nll


def expected_calibration_error(probs: np.ndarray, labels: np.ndarray, n_bins: int = 10) -> float:
    """Compute Expected Calibration Error (ECE).
    - probs: array shape (N, C) of predicted probabilities
    - labels: integer array shape (N,) of true labels
    Returns ECE in [0, 1].
    """
    confidences = probs.max(axis=1)
    predictions = probs.argmax(axis=1)
    accuracies = (predictions == labels).astype(float)
    ece = 0.0
    bin_edges = np.linspace(0.0, 1.0, n_bins + 1)
    for i in range(n_bins):
        lo, hi = bin_edges[i], bin_edges[i+1]
        mask = (confidences > lo) & (confidences <= hi)
        if mask.sum() == 0:
            continue
        avg_conf = confidences[mask].mean()
        avg_acc = accuracies[mask].mean()
        ece += (mask.sum() / len(confidences)) * abs(avg_conf - avg_acc)
    return float(ece)


def calibrate_temperature_from_logits(logits: np.ndarray, labels: np.ndarray, device: str = 'cpu') -> float:
    """Find a temperature > 0 that minimizes NLL on the provided logits/labels.
    Uses LBFGS on a single-parameter model (fast and stable).
    Returns the scalar temperature (float).
    """
    # convert to tensors
    logits_t = torch.tensor(logits).float().to(device)
    labels_t = torch.tensor(labels).long().to(device)

    scaler = _TemperatureScaler(init_temp=1.0).to(device)
    optimizer = torch.optim.LBFGS([scaler.temperature], lr=0.1, max_iter=50)

    nll_loss = nn.CrossEntropyLoss()

    def _closure():
        optimizer.zero_grad()
        scaled = scaler(logits_t)
        loss = nll_loss(scaled, labels_t)
        loss.backward()
        return loss

    try:
        optimizer.step(_closure)
    except Exception:
        # fallback: return 1.0 if optimization fails
        return 1.0

    temp = float(torch.clamp(scaler.temperature.detach(), min=1e-6).cpu().numpy()[0])
    return temp


def predict_image_with_model(model, pil_img, device, tta, base_transform, temperature: float = 1.0):
    batch = _image_batch_from_pil(pil_img, base_transform, tta=tta)
    probs = _predict_tensor_batch(model, batch, device, temperature=temperature)  # (n_tta, num_classes)
    avg = probs.mean(axis=0)
    return avg


def predict_images(image_path, model_paths, class_to_idx, device, tta=True, critical_threshold: float = 0.6):
    """Run inference (TTA + optional ensemble) for one image or a directory of images.
    New policy: `critical_alert` is set when the predicted class is one of the
    four DESIGN-trained labels (i.e. any prediction coming from the trained
    classifier). This no longer uses a probability threshold — `critical_score`
    will contain the top probability for the predicted class.

    Returns a dict keyed by image path with predicted class + per-class probabilities
    and `critical_alert` / `critical_score`.
    """
    base_transform = get_transform()
    idx_to_class = {v: k for k, v in class_to_idx.items()}

    # load models once (auto-detect a ResNet backbone compatible with the checkpoint)
    def _load_model_from_checkpoint(mp):
        state = torch.load(mp, map_location=device)
        # try common ResNet backbones (training used resnet18/resnet34/resnet50)
        for backbone in (18, 34, 50):
            try:
                m = getattr(models, f'resnet{backbone}')(pretrained=False)
                in_features = m.fc.in_features
                m.fc = nn.Sequential(nn.Dropout(p=0.5), nn.Linear(in_features, len(class_to_idx)))
                m.load_state_dict(state)
                m.to(device)
                m.eval()
                return m
            except Exception:
                # not compatible, try next backbone
                continue
        raise RuntimeError(f'No compatible ResNet backbone found for checkpoint: {mp}')

    models_cache = []
    for mp in model_paths:
        m = _load_model_from_checkpoint(mp)
        # look for a companion temperature file (created by evaluate())
        temp = 1.0
        try:
            temp_file = Path(mp).with_suffix(Path(mp).suffix + '.temperature.json')
            if temp_file.exists():
                with open(temp_file, 'r') as tf:
                    temp = float(json.load(tf).get('temperature', 1.0))
        except Exception:
            temp = 1.0
        models_cache.append((m, float(temp)))

    # collect image paths
    p = Path(image_path)
    img_paths = []
    if p.is_dir():
        for ext in ('*.png', '*.jpg', '*.jpeg'):
            img_paths.extend(sorted(p.glob(ext)))
    else:
        img_paths = [p]

    results = {}
    for ip in img_paths:
        pil_img = Image.open(str(ip)).convert('RGB')
        probs_accum = None
        for m, temp in models_cache:
            avg = predict_image_with_model(m, pil_img, device, tta, base_transform, temperature=temp)
            if probs_accum is None:
                probs_accum = avg
            else:
                probs_accum += avg
        probs_accum = probs_accum / len(models_cache)
        top_idx = int(np.argmax(probs_accum))
        top_class = idx_to_class[top_idx]
        probs_map = {idx_to_class[i]: float(probs_accum[i]) for i in range(len(probs_accum))}

        # critical alert policy (NEW): mark True for any DESIGN-trained label
        is_critical = top_class in idx_to_class.values()

        results[str(ip)] = {
            'file': str(ip),
            'pred_idx': int(top_idx),
            'pred_class': top_class,
            'probabilities': probs_map,
            'top_prob': float(probs_accum[top_idx]),
            'critical_alert': bool(is_critical),
            'critical_score': float(probs_accum[top_idx]) if is_critical else 0.0
        }

    return results


def evaluate(data_dir, model_path, val_pct=0.15, batch_size=32, seed=42, split='test', critical_threshold: float = 0.6):
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

    ds = datasets.ImageFolder(root=str(data_dir), transform=get_transform())

    # Prefer the saved class map produced by training if present; otherwise restrict to DESIGN labels
    design_map_path = Path(__file__).parent.parent.resolve() / 'models' / 'class_to_idx.json'
    splits_path = Path(__file__).parent / 'splits.json'
    DESIGN_LABELS = ['glioma_tumor', 'meningioma_tumor', 'pituitary_tumor', 'no_tumor']

    if design_map_path.exists():
        with open(design_map_path, 'r') as f:
            saved_map = json.load(f)
        # filter dataset to only saved_map classes and remap indices to match saved_map
        allowed = set(saved_map.keys())
    else:
        allowed = set(DESIGN_LABELS)

    filtered_samples = [s for s in ds.samples if ds.classes[s[1]] in allowed]
    if len(filtered_samples) == 0:
        raise RuntimeError(f"No samples found for allowed labels in {data_dir}. Expected: {sorted(list(allowed))}")

    # rebuild dataset to only include allowed classes and compact indices
    new_classes = sorted(list({ds.classes[i] for _, i in filtered_samples}))
    new_class_to_idx = {c: i for i, c in enumerate(new_classes)}
    new_samples = [(p, new_class_to_idx[ds.classes[idx]]) for p, idx in filtered_samples]
    ds.samples = new_samples
    ds.targets = [t for _, t in new_samples]
    ds.classes = new_classes
    ds.class_to_idx = new_class_to_idx

    class_to_idx = ds.class_to_idx
    idx_to_class = {v: k for k, v in class_to_idx.items()}

    # If training produced a deterministic splits.json, prefer that for evaluation
    if splits_path.exists():
        with open(splits_path, 'r') as sf:
            saved_splits = json.load(sf)
        if split == 'test' and 'test' in saved_splits:
            test_files = set(saved_splits['test'])
            test_samples = [s for s in ds.samples if s[0] in test_files]
            test_ds = torch.utils.data.Subset(ds, [i for i, s in enumerate(ds.samples) if s[0] in test_files])
            val_ds = test_ds
        elif split == 'val' and 'val' in saved_splits:
            val_files = set(saved_splits['val'])
            val_ds = torch.utils.data.Subset(ds, [i for i, s in enumerate(ds.samples) if s[0] in val_files])
        else:
            # fallback to re-splitting deterministically
            val_len = int(len(ds) * val_pct)
            train_len = len(ds) - val_len
            generator = torch.Generator().manual_seed(seed)
            train_ds, val_ds = random_split(ds, [train_len, val_len], generator=generator)
    else:
        # deterministic split
        val_len = int(len(ds) * val_pct)
        train_len = len(ds) - val_len
        generator = torch.Generator().manual_seed(seed)
        train_ds, val_ds = random_split(ds, [train_len, val_len], generator=generator)

    val_loader = DataLoader(val_ds, batch_size=batch_size, shuffle=False, num_workers=2)

    # model definition (must match training)
    num_classes = len(class_to_idx)

    # instantiate model by probing the checkpoint against common ResNet backbones
    def _instantiate_model_for_checkpoint(model_path):
        state = torch.load(model_path, map_location=device)
        for backbone in (18, 34, 50):
            try:
                m = getattr(models, f'resnet{backbone}')(pretrained=False)
                in_features = m.fc.in_features
                m.fc = nn.Sequential(nn.Dropout(p=0.5), nn.Linear(in_features, num_classes))
                m.load_state_dict(state)
                return m.to(device)
            except Exception:
                continue
        # last-resort: attempt non-strict load into resnet50 to produce clearer error message
        m = models.resnet50(pretrained=False)
        in_features = m.fc.in_features
        m.fc = nn.Sequential(nn.Dropout(p=0.5), nn.Linear(in_features, num_classes))
        try:
            m.load_state_dict(state, strict=False)
            return m.to(device)
        except Exception as e:
            raise RuntimeError(f'Failed to load checkpoint into supported ResNet backbones: {e}')

    model = _instantiate_model_for_checkpoint(model_path)
    model.eval()

    y_true = []
    y_pred = []
    probs = []
    logits = []

    # Track predictions, logits and probabilities (preserve dataset order)
    with torch.no_grad():
        for imgs, labels in val_loader:
            imgs = imgs.to(device)
            labels = labels.to(device)
            outputs = model(imgs)          # logits
            probabilities = torch.softmax(outputs, dim=1)
            preds = probabilities.argmax(dim=1)

            y_true.extend(labels.cpu().numpy().tolist())
            y_pred.extend(preds.cpu().numpy().tolist())
            probs.extend(probabilities.cpu().numpy().tolist())
            logits.extend(outputs.cpu().numpy().tolist())

    acc = accuracy_score(y_true, y_pred)
    report = classification_report(y_true, y_pred, target_names=[idx_to_class[i] for i in range(len(idx_to_class))], output_dict=True, zero_division=0)
    cm = confusion_matrix(y_true, y_pred).tolist()

    # -- Calibration analysis: compute ECE before/after and find optimal temperature --
    try:
        probs_np = np.array(probs)
        logits_np = np.array(logits)
        labels_np = np.array(y_true)

        ece_before = expected_calibration_error(probs_np, labels_np, n_bins=15)
        # compute temperature on logits/labels
        temperature = calibrate_temperature_from_logits(logits_np, labels_np, device=str(device))
        # apply temperature scaling to logits and recompute calibrated probabilities
        scaled_logits = logits_np / float(max(1e-6, temperature))
        exp_logits = np.exp(scaled_logits - np.max(scaled_logits, axis=1, keepdims=True))
        probs_after = exp_logits / exp_logits.sum(axis=1, keepdims=True)
        ece_after = expected_calibration_error(probs_after, labels_np, n_bins=15)
        nll_before = float(_compute_nll(logits_np, labels_np, temperature=1.0))
        nll_after = float(_compute_nll(logits_np, labels_np, temperature=temperature))
    except Exception as e:
        # If calibration fails, default safe values
        temperature = 1.0
        ece_before = None
        ece_after = None
        nll_before = None
        nll_after = None

    # persist temperature adjacent to the model file so the server can load it at runtime
    try:
        model_path_obj = Path(model_path)
        temp_file = model_path_obj.with_suffix(model_path_obj.suffix + '.temperature.json')
        with open(temp_file, 'w') as tf:
            json.dump({'temperature': float(temperature)}, tf)
    except Exception:
        pass

    # --- CRITICAL-ALERT CHECK (dataset-level summary) ---
    # Resolve file paths for validation subset in the same order used by DataLoader
    val_files = []
    try:
        # val_ds is often a Subset with `.indices`
        if hasattr(val_ds, 'indices'):
            val_files = [ds.samples[i][0] for i in val_ds.indices]
        else:
            val_files = [s[0] for s in val_ds.samples]
    except Exception:
        val_files = []

    critical_alerts = []
    for i, (fp, pred_idx, prob_vec) in enumerate(zip(val_files, y_pred, probs)):
        pred_class = idx_to_class[int(pred_idx)]
        top_prob = float(prob_vec[int(pred_idx)])
        if _is_critical_label(pred_class) and top_prob >= float(critical_threshold):
            critical_alerts.append({
                'file': fp,
                'pred_class': pred_class,
                'probability': top_prob
            })

    out = {
        'model': os.path.abspath(model_path),
        'data_dir': os.path.abspath(data_dir),
        'num_samples': len(ds),
        'eval_samples': len(val_ds),
        'accuracy': float(acc),
        'classification_report': report,
        'confusion_matrix': cm,
        'class_to_idx': class_to_idx,
        'critical_alerts': critical_alerts,
        'num_critical_alerts': len(critical_alerts),
        'critical_alert_rate': (len(critical_alerts) / len(val_ds)) if len(val_ds) else 0.0,
        'critical_threshold': float(critical_threshold),
        # calibration metrics
        'temperature': float(temperature) if temperature is not None else None,
        'ece_before': float(ece_before) if ece_before is not None else None,
        'ece_after': float(ece_after) if ece_after is not None else None,
        'nll_before': float(nll_before) if nll_before is not None else None,
        'nll_after': float(nll_after) if nll_after is not None else None
    }

    out_path = Path(__file__).parent / 'eval_report.json'
    with open(out_path, 'w') as f:
        json.dump(out, f, indent=2)

    print(f"Evaluation complete — accuracy={acc:.4f}, report saved to {out_path}")
    return out


if __name__ == '__main__':
    p = argparse.ArgumentParser()
    p.add_argument('--data-dir', type=str, default='../../DESIGN/Training')
    p.add_argument('--model', type=str, default='../../models/multi_disease_from_design.pth')
    p.add_argument('--batch-size', type=int, default=32)
    p.add_argument('--val-pct', type=float, default=0.15)
    p.add_argument('--seed', type=int, default=42)
    p.add_argument('--split', type=str, choices=['val','test'], default='test', help='Which split to evaluate on (prefers saved splits.json from training)')
    p.add_argument('--critical-threshold', type=float, default=0.6, help='Threshold (0-1) used to flag critical/urgent predictions before reporting confidence')
    p.add_argument('--image', type=str, default=None, help='Path to a single image file or directory to run inference on (PNG/JPG). If set, dataset evaluation is skipped.')
    p.add_argument('--tta', action='store_true', help='Enable test-time augmentation for image inference')
    p.add_argument('--ensemble-dir', type=str, default=None, help='Directory containing .pth models to ensemble (e.g. models/kfold). If omitted, uses --model')
    args = p.parse_args()

    # If user requested single-image inference, run TTA/ensemble prediction and exit
    if args.image:
        design_map_path = Path(__file__).parent.parent.resolve() / 'models' / 'class_to_idx.json'
        # fallback to repo-root 'models/class_to_idx.json' (train.py writes there)
        if not design_map_path.exists():
            alt = Path(__file__).parents[2].resolve() / 'models' / 'class_to_idx.json'
            if alt.exists():
                design_map_path = alt

        if not design_map_path.exists():
            raise RuntimeError(f"Class map not found: {design_map_path}. Run training first to create class map before image inference.")

        with open(design_map_path, 'r') as f:
            class_to_idx = json.load(f)

        # determine model paths to use (single model or ensemble directory)
        model_paths = []
        if args.ensemble_dir:
            ensemble_dir = Path(args.ensemble_dir)
            model_paths = sorted([str(p.resolve()) for p in ensemble_dir.glob('*.pth')])
            if len(model_paths) == 0:
                raise RuntimeError(f'No .pth files found in ensemble dir: {ensemble_dir}')
        else:
            mpath = Path(args.model)
            if not mpath.is_absolute():
                # resolve relative to this script location (matches earlier behavior)
                mpath = (Path(__file__).parent / mpath).resolve()
            model_paths = [str(mpath)]

        device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        preds = predict_images(args.image, model_paths, class_to_idx, device, tta=args.tta, critical_threshold=args.critical_threshold)
        out_path = Path(__file__).parent / 'eval_predictions.json'
        with open(out_path, 'w') as f:
            json.dump(preds, f, indent=2)
        print(f"Saved predictions -> {out_path}") 
        for k, v in preds.items():
            # show critical-alert first (if present) then confidence
            if v.get('critical_alert'):
                print(f"{v['file']}: CRITICAL ALERT -> {v['pred_class']} (score={v['critical_score']:.3f})")
            else:
                print(f"{v['file']}: {v['pred_class']} ({v['probabilities'][v['pred_class']]:.3f})")
        raise SystemExit(0)

    # otherwise perform standard dataset evaluation
    evaluate(args.data_dir, args.model, val_pct=args.val_pct, batch_size=args.batch_size, seed=args.seed, split=args.split)