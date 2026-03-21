import importlib.util
from pathlib import Path
import json

REPO_ROOT = Path(__file__).resolve().parents[2]


def _load_evaluate_module():
    spec = importlib.util.spec_from_file_location('evaluate_module', str(REPO_ROOT / 'backend-ai' / 'training' / 'evaluate.py'))
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


def test_predict_images_top_prob_matches_probabilities_for_sample_set():
    """predict_images must report `top_prob` equal to the highest value in `probabilities`.
    This is a CI assertion guarding the single-image / dataset-inference contract.
    """
    evaluate_mod = _load_evaluate_module()

    # load class map used by training
    class_map_path = REPO_ROOT / 'models' / 'class_to_idx.json'
    with open(class_map_path, 'r') as f:
        class_to_idx = json.load(f)

    model_path = REPO_ROOT / 'models' / 'multi_disease_from_design.pth'

    # pick one example per class dynamically so tests don't break on renames
    samples = []
    for cls in ['no_tumor','glioma_tumor','pituitary_tumor','meningioma_tumor']:
        folder = REPO_ROOT / 'DESIGN' / 'Training' / cls
        imgs = sorted(folder.glob('*.jpg'))
        assert imgs, f"no images found in {folder}"
        samples.append(imgs[0])

    # call predict_images for each sample separately (predict_images accepts a single path or directory)
    for s in samples:
        preds = evaluate_mod.predict_images(str(s), [str(model_path)], class_to_idx, device='cpu', tta=False)
        key = str(s)
        assert key in preds, f"Missing prediction for {key}"
        r = preds[key]
        probs = r['probabilities']
        assert abs(sum(probs.values()) - 1.0) < 1e-3, 'probabilities must sum to 1.0'
        top_prob = r['top_prob']
        max_prob = max(probs.values())
        # top_prob must equal the reported class probability (allow tiny FP rounding)
        assert abs(top_prob - max_prob) < 1e-6, f"top_prob ({top_prob}) != max(probabilities) ({max_prob}) for {key}"
        assert abs(top_prob - probs[r['pred_class']]) < 1e-6, 'top_prob must equal probability for pred_class'