"""
Simple transfer-learning training script that uses images under DESIGN/Training.
- Expects folder structure: DESIGN/Training/<label>/*.{jpg,png}
- Produces: models/multi_disease_from_design.pth and models/class_to_idx.json

Usage (from repository root):
  python backend-ai/training/train.py --data-dir DESIGN/Training --epochs 8 --batch-size 16

Notes:
- Requires torch, torchvision, timm (see backend-ai/requirements.txt)
- This is a CPU-capable implementation but GPU is strongly recommended for "extensive" training.
"""
import os
import argparse
import json
from pathlib import Path
from tqdm import tqdm

import numpy as np
import random
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader, random_split
from torchvision import datasets, transforms, models


def make_transforms(train=True):
    # medically-safe augmentations designed to improve generalization on small MRI sets
    if train:
        return transforms.Compose([
            transforms.Resize(256),
            transforms.RandomResizedCrop(224, scale=(0.75, 1.0)),
            transforms.RandomHorizontalFlip(p=0.5),
            transforms.RandomAffine(degrees=10, translate=(0.03, 0.03), shear=5),
            transforms.RandomRotation(degrees=12),
            transforms.ColorJitter(0.06, 0.06, 0.06, 0.02),
            transforms.GaussianBlur(kernel_size=(3, 3), sigma=(0.1, 0.8)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
            # RandomErasing applied as a final augmentation step
            transforms.RandomErasing(p=0.25, scale=(0.02, 0.12), ratio=(0.3, 3.3))
        ])
    return transforms.Compose([
        transforms.Resize(256),
        transforms.CenterCrop(224),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])


def train(data_dir, out_path, epochs=6, batch_size=16, lr=3e-4, val_pct=0.15, test_pct=0.10, resume=False, patience=8, weight_decay=1e-2, overfit_threshold=12.0, mixup_alpha=0.2, backbone='resnet50', num_workers=4, seed=42):
    data_dir = Path(data_dir)
    # If the provided path doesn't exist, try resolving it relative to the repo root
    if not data_dir.exists():
        repo_root = Path(__file__).resolve().parents[2]
        alt = (repo_root / data_dir).resolve()
        if alt.exists():
            data_dir = alt
            print(f"Resolved data-dir relative to repo root -> {data_dir}")
        else:
            raise RuntimeError(
                f"Data directory not found: {data_dir}\n"
                f"Hint: run from repo root or pass --data-dir relative to the repo root, e.g. '--data-dir DESIGN/Training'"
            )

    # reproducibility / deterministic behavior
    np.random.seed(seed)
    random.seed(seed)
    torch.manual_seed(seed)

    dataset = datasets.ImageFolder(root=str(data_dir), transform=make_transforms(train=True))

    # Enforce DESIGN training labels (only these four folders will be used)
    DESIGN_LABELS = ['glioma_tumor', 'meningioma_tumor', 'pituitary_tumor', 'no_tumor']
    present_labels = set(dataset.classes)

    # Filter dataset to only include samples from the DESIGN_LABELS (ignore any other folders)
    if not present_labels.issubset(set(DESIGN_LABELS)):
        allowed_indices = {dataset.class_to_idx[c]: c for c in dataset.classes if c in DESIGN_LABELS}
        filtered_samples = [s for s in dataset.samples if s[1] in allowed_indices]
        if len(filtered_samples) == 0:
            raise RuntimeError(f"No samples found for DESIGN labels in {data_dir}. Ensure folders: {DESIGN_LABELS}")
        # rebuild class list / mapping to compact indices
        new_classes = sorted(list({dataset.classes[i] for i in {s[1] for s in filtered_samples}}))
        new_class_to_idx = {c: i for i, c in enumerate(new_classes)}
        # remap samples' class indices
        new_samples = [(p, new_class_to_idx[dataset.classes[idx]]) for p, idx in filtered_samples]
        dataset.samples = new_samples
        dataset.targets = [t for _, t in new_samples]
        dataset.classes = new_classes
        dataset.class_to_idx = new_class_to_idx
        print(f"Filtered dataset to DESIGN labels: {dataset.classes} ({len(dataset)} images)")
    else:
        print(f"Found {len(dataset)} images across {len(dataset.classes)} classes: {dataset.classes}")

    class_to_idx = dataset.class_to_idx
    num_classes = len(class_to_idx)

    # save class map immediately so it's available even if training is interrupted
    out_dir = Path(out_path).parent
    out_dir.mkdir(parents=True, exist_ok=True)
    mapping_path = out_dir / 'class_to_idx.json'
    with open(mapping_path, 'w') as f:
        json.dump(class_to_idx, f, indent=2)
    print(f"Saved class map -> {mapping_path}")

    # split train/val/test (deterministic seed for reproducibility)
    test_len = int(len(dataset) * test_pct)
    val_len = int(len(dataset) * val_pct)
    train_len = len(dataset) - val_len - test_len
    if train_len <= 0:
        raise RuntimeError("Not enough data for the requested train/val/test split. Reduce val/test pct or add more samples.")

    generator = torch.Generator().manual_seed(42)
    train_ds, val_ds, test_ds = random_split(dataset, [train_len, val_len, test_len], generator=generator)

    # persist splits so evaluation uses the same held-out test set
    splits = {
        'train': [dataset.samples[i][0] for i in train_ds.indices],
        'val': [dataset.samples[i][0] for i in val_ds.indices],
        'test': [dataset.samples[i][0] for i in test_ds.indices]
    }
    with open(out_dir / 'splits.json', 'w') as sf:
        json.dump(splits, sf, indent=2)
    print(f"Saved deterministic splits -> {out_dir / 'splits.json'}")

    # --- class-balanced weighted sampler for training to mitigate imbalance ---
    try:
        train_indices = train_ds.indices
    except AttributeError:
        train_indices = list(range(train_len))

    train_labels = [dataset.targets[i] for i in train_indices]
    class_sample_count = [train_labels.count(i) for i in range(num_classes)]
    # guard against zero counts
    class_sample_count = [c if c > 0 else 1 for c in class_sample_count]
    class_weights = [sum(class_sample_count) / c for c in class_sample_count]
    sample_weights = [class_weights[label] for label in train_labels]
    sampler = torch.utils.data.WeightedRandomSampler(sample_weights, num_samples=len(sample_weights), replacement=True)

    train_loader = DataLoader(train_ds, batch_size=batch_size, sampler=sampler, num_workers=num_workers, pin_memory=True)
    val_loader = DataLoader(val_ds, batch_size=batch_size, shuffle=False, num_workers=max(1, num_workers // 2), pin_memory=True)
    test_loader = DataLoader(test_ds, batch_size=batch_size, shuffle=False, num_workers=max(1, num_workers // 2), pin_memory=True)

    # model: selectable ResNet backbone (smaller backbones = faster / lower memory)
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    if backbone in ('resnet18', 'resnet34', 'resnet50'):
        model = getattr(models, backbone)(pretrained=True)
        in_features = model.fc.in_features
        # slightly higher dropout increases robustness on small datasets
        model.fc = nn.Sequential(nn.Dropout(p=0.5), nn.Linear(in_features, num_classes))
    else:
        raise ValueError(f"Unsupported backbone: {backbone}")
    model = model.to(device)

    # label-smoothing + standard CE helps generalization
    criterion = nn.CrossEntropyLoss(label_smoothing=0.1)
    optimizer = optim.AdamW(model.parameters(), lr=lr, weight_decay=weight_decay)

    # LR scheduler (cosine annealing)
    try:
        scheduler = optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=epochs)
    except Exception:
        scheduler = None

    # AMP (automatic mixed precision) when GPU available
    use_amp = torch.cuda.is_available()
    scaler = torch.cuda.amp.GradScaler() if use_amp else None

    # resume support: if resume=True and model exists, load weights
    best_val_acc = 0.0
    epochs_no_improve = 0
    if resume and os.path.exists(out_path):
        try:
            print(f"Resuming training: loading weights from {out_path}")
            state = torch.load(out_path, map_location=device)
            model.load_state_dict(state)
            print("Checkpoint loaded — continuing training from saved weights.")
        except Exception as e:
            print(f"Warning: failed to load checkpoint for resume: {e}")
            print("Starting training from scratch.")

    history = {'train_loss': [], 'train_acc': [], 'val_loss': [], 'val_acc': [], 'val_class_recall': []} 

    for epoch in range(1, epochs + 1):
        model.train()
        running_loss = 0.0
        correct = 0
        total = 0
        pbar = tqdm(train_loader, desc=f"Epoch {epoch}/{epochs} - train")
        for imgs, labels in pbar:
            imgs = imgs.to(device)
            labels = labels.to(device)

            optimizer.zero_grad()

            # MixUp augmentation in the batch (helps reduce memorization)
            if mixup_alpha and mixup_alpha > 0:
                lam = float(np.random.beta(mixup_alpha, mixup_alpha))
                batch_size_curr = imgs.size(0)
                index = torch.randperm(batch_size_curr).to(device)
                imgs_mix = lam * imgs + (1.0 - lam) * imgs[index]
                labels_a, labels_b = labels, labels[index]

                if use_amp:
                    with torch.cuda.amp.autocast():
                        outputs = model(imgs_mix)
                        loss = lam * criterion(outputs, labels_a) + (1.0 - lam) * criterion(outputs, labels_b)
                    scaler.scale(loss).backward()
                    scaler.step(optimizer)
                    scaler.update()
                else:
                    outputs = model(imgs_mix)
                    loss = lam * criterion(outputs, labels_a) + (1.0 - lam) * criterion(outputs, labels_b)
                    loss.backward()
                    optimizer.step()

                # weighted-accuracy accounting for mixed targets
                _, preds = torch.max(outputs, 1)
                correct += (lam * (preds == labels_a).sum().item() + (1.0 - lam) * (preds == labels_b).sum().item())
            else:
                if use_amp:
                    with torch.cuda.amp.autocast():
                        outputs = model(imgs)
                        loss = criterion(outputs, labels)
                    scaler.scale(loss).backward()
                    scaler.step(optimizer)
                    scaler.update()
                else:
                    outputs = model(imgs)
                    loss = criterion(outputs, labels)
                    loss.backward()
                    optimizer.step()

                _, preds = torch.max(outputs, 1)
                correct += (preds == labels).sum().item()

            running_loss += loss.item() * imgs.size(0)
            total += imgs.size(0)
            pbar.set_postfix(loss=running_loss / total, acc=100.0 * correct / total) 

        train_loss = running_loss / total if total else 0.0
        train_acc = 100.0 * correct / total if total else 0.0

        # validation
        model.eval()
        val_loss = 0.0
        vcorrect = 0
        vtotal = 0
        val_preds = []
        val_targets = []
        with torch.no_grad():
            for imgs, labels in val_loader:
                imgs = imgs.to(device)
                labels = labels.to(device)
                if use_amp:
                    with torch.cuda.amp.autocast():
                        outputs = model(imgs)
                        loss = criterion(outputs, labels)
                else:
                    outputs = model(imgs)
                    loss = criterion(outputs, labels)
                val_loss += loss.item() * imgs.size(0)
                _, preds = torch.max(outputs, 1)
                vcorrect += (preds == labels).sum().item()
                vtotal += imgs.size(0)
                val_preds.extend(preds.cpu().numpy().tolist())
                val_targets.extend(labels.cpu().numpy().tolist())

        val_loss = val_loss / vtotal if vtotal else 0.0
        val_acc = 100.0 * vcorrect / vtotal if vtotal else 0.0

        # per-class recall on validation set
        val_preds_np = np.array(val_preds)
        val_targets_np = np.array(val_targets)
        val_class_recall = {}
        for cname, idx in class_to_idx.items():
            mask = (val_targets_np == idx)
            total_for_cls = int(mask.sum())
            recall = float((val_preds_np[mask] == idx).sum() / total_for_cls) if total_for_cls > 0 else None
            val_class_recall[cname] = recall

        print(f"Epoch {epoch}: train_loss={train_loss:.4f} train_acc={train_acc:.2f}% | val_loss={val_loss:.4f} val_acc={val_acc:.2f}% | val_class_recall={val_class_recall}")

        history['train_loss'].append(train_loss)
        history['train_acc'].append(train_acc)
        history['val_loss'].append(val_loss)
        history['val_acc'].append(val_acc)
        history['val_class_recall'].append(val_class_recall) 

        # scheduler step
        if scheduler is not None:
            scheduler.step()

        # early stopping / save best model
        if val_acc > best_val_acc:
            best_val_acc = val_acc
            epochs_no_improve = 0
            torch.save(model.state_dict(), str(out_path))
            # Save metadata alongside the checkpoint so the server can pick the correct backbone
            try:
                meta = {'backbone': backbone, 'epochs_trained': epoch, 'batch_size': batch_size, 'seed': seed}
                meta_path = Path(out_path).with_suffix('.meta.json')
                with open(meta_path, 'w') as mf:
                    json.dump(meta, mf, indent=2)
                print(f"Saved model metadata -> {meta_path}")
            except Exception:
                pass
            print(f"Saved best model ({best_val_acc:.2f}%) -> {out_path}")
        else:
            epochs_no_improve += 1
            print(f"No improvement for {epochs_no_improve} epoch(s)")

        if epochs_no_improve >= patience:
            print(f"Stopping early (no improvement for {patience} epochs)")
            break

    # After training: evaluate on held-out test set (deterministic)
    model.eval()
    test_correct = 0
    test_total = 0
    test_preds = []
    test_targets = []
    with torch.no_grad():
        for imgs, labels in test_loader:
            imgs = imgs.to(device); labels = labels.to(device)
            outputs = model(imgs)
            _, preds = torch.max(outputs, 1)
            test_correct += (preds == labels).sum().item()
            test_total += imgs.size(0)
            test_preds.extend(preds.cpu().numpy().tolist())
            test_targets.extend(labels.cpu().numpy().tolist())
    test_acc = 100.0 * test_correct / test_total if test_total else 0.0
    history['test_acc'] = test_acc

    # per-class recall on test set
    test_preds_np = np.array(test_preds)
    test_targets_np = np.array(test_targets)
    test_class_recall = {}
    for cname, idx in class_to_idx.items():
        mask = (test_targets_np == idx)
        total_for_cls = int(mask.sum())
        recall = float((test_preds_np[mask] == idx).sum() / total_for_cls) if total_for_cls > 0 else None
        test_class_recall[cname] = recall
    history['test_class_recall'] = test_class_recall

    # Save training history and class map
    hist_path = out_dir / 'train_history.json'
    with open(hist_path, 'w') as f:
        json.dump(history, f, indent=2)
    mapping_path = Path(out_path).parent / 'class_to_idx.json'
    with open(mapping_path, 'w') as f:
        json.dump(class_to_idx, f, indent=2)

    print(f"Saved class map -> {mapping_path}")
    print(f"Training complete. Best val acc: {best_val_acc:.2f}% | test_acc: {test_acc:.2f}%")

    # Overfitting check: warn (and optionally fail CI) when train-val gap large
    final_train_acc = history['train_acc'][-1] if history['train_acc'] else 0.0
    final_val_acc = history['val_acc'][-1] if history['val_acc'] else 0.0
    gap = final_train_acc - final_val_acc
    if gap > overfit_threshold:
        warning = f"POTENTIAL OVERFITTING: train_acc ({final_train_acc:.2f}%) - val_acc ({final_val_acc:.2f}%) = {gap:.2f}% > threshold ({overfit_threshold}%)"
        print(warning)
        # write a marker file so CI can detect overfitting if desired
        with open(out_dir / 'overfit_warning.txt', 'w') as wf:
            wf.write(warning + '\n')
    else:
        # remove previous marker if exists
        of = out_dir / 'overfit_warning.txt'
        if of.exists():
            of.unlink()



if __name__ == '__main__':
    p = argparse.ArgumentParser()
    p.add_argument('--data-dir', type=str, default='DESIGN/Training', help='Path to labeled training folders (will be resolved relative to repo root if not found)')
    p.add_argument('--out', type=str, default='../../models/multi_disease_from_design.pth', help='Output model path (relative to backend-ai/training) — saves to repo root ./models')
    p.add_argument('--epochs', type=int, default=8)
    p.add_argument('--batch-size', type=int, default=16)
    p.add_argument('--lr', type=float, default=3e-4)
    p.add_argument('--val-pct', type=float, default=0.15)
    p.add_argument('--test-pct', type=float, default=0.10, help='Held-out test set fraction (deterministic)')
    p.add_argument('--weight-decay', type=float, default=1e-2, help='L2 weight decay for optimizer')
    p.add_argument('--overfit-threshold', type=float, default=12.0, help='Train/val gap (%) threshold to warn about overfitting')
    p.add_argument('--mixup-alpha', type=float, default=0.2, help='MixUp alpha (0 disables MixUp)')
    p.add_argument('--patience', type=int, default=8, help='Early stopping patience (in epochs)')
    p.add_argument('--backbone', choices=['resnet50','resnet34','resnet18'], default='resnet50', help='Model backbone (smaller -> faster)')
    p.add_argument('--num-workers', type=int, default=4, help='DataLoader num_workers (reduce to lower memory/IO)')
    p.add_argument('--resume', action='store_true', help='Load existing weights from --out and continue training')
    p.add_argument('--seed', type=int, default=42, help='Random seed for reproducibility')
    args = p.parse_args()

    train(args.data_dir, os.path.join(os.path.dirname(__file__), args.out), epochs=args.epochs, batch_size=args.batch_size, lr=args.lr, val_pct=args.val_pct, test_pct=args.test_pct, resume=args.resume, patience=args.patience, weight_decay=args.weight_decay, overfit_threshold=args.overfit_threshold, mixup_alpha=args.mixup_alpha, backbone=args.backbone, num_workers=args.num_workers, seed=args.seed)