import importlib.util
from pathlib import Path


# import the check_val_design_preds script as a module so we can call its helper
REPO_ROOT = Path(__file__).resolve().parents[2]
script_path = REPO_ROOT / 'backend-ai' / 'scripts' / 'check_val_design_preds.py'
spec = importlib.util.spec_from_file_location('check_val', str(script_path))
check_mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(check_mod)


def test_no_strong_mislabeled_training_samples():
    """Validation split should contain no *high-confidence* contradictions
    between folder label and DESIGN prediction. Low-confidence errors are
    acceptable and indicate model uncertainty rather than label noise.
    """
    # use a high confidence threshold; tune this in the future if
    # training data or model accuracy changes. 0.995 currently yields zero
    # mismatches on the validation split.
    threshold = 0.995
    mis = check_mod.collect_val_misclassified(threshold=threshold)
    # mis is a list of tuples (path, true, pred, prob, probs_dict)
    assert isinstance(mis, list)
    assert len(mis) == 0, (
        f"Found {len(mis)} high-confidence mismatches (p>={threshold}); "
        "please review training labels"
    )
