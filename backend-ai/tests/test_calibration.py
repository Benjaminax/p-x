import numpy as np
from pathlib import Path
import importlib.util
import pytest

# load evaluate module directly
spec = importlib.util.spec_from_file_location('evaluate_module', str(Path(__file__).resolve().parents[1] / 'training' / 'evaluate.py'))
evaluate_mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(evaluate_mod)

# load server module for integration test
spec2 = importlib.util.spec_from_file_location('backend_server', str(Path(__file__).resolve().parents[1] / 'server.py'))
server = importlib.util.module_from_spec(spec2)
spec2.loader.exec_module(server)


def test_calibrate_temperature_reduces_nll():
    # create synthetic logits that are overconfident for class 0
    rng = np.random.RandomState(0)
    N = 200
    C = 3
    # logits: class 0 tends to have large positive scores
    logits = rng.normal(scale=1.0, size=(N, C))
    logits[:80, 0] += 5.0  # many overconfident predictions for class 0
    labels = np.zeros(N, dtype=int)
    labels[80:140] = 1
    labels[140:] = 2

    nll_before = evaluate_mod._compute_nll(logits, labels, temperature=1.0)
    temp = evaluate_mod.calibrate_temperature_from_logits(logits, labels, device='cpu')
    assert temp > 0.0
    nll_after = evaluate_mod._compute_nll(logits, labels, temperature=temp)

    # calibration should not increase NLL significantly (usually decreases)
    assert nll_after <= nll_before + 1e-6


def test_design_temperature_applied_in_classify():
    # ensure DESIGN model is loaded; skip if unavailable in this environment
    server.load_design_model()
    if server.design_model is None:
        pytest.skip("DESIGN model not available for calibration test")

    from PIL import Image
    repo_root = Path(__file__).resolve().parents[2]
    img_path = repo_root / 'DESIGN' / 'Training' / 'no_tumor' / 'image(82).jpg'
    img = Image.open(img_path).convert('RGB')

    # baseline inference with default temperature
    server.design_temperature = 1.0
    out1 = server.classify_design_model(img)
    top1 = out1['top_prob']

    # high temperature should flatten probabilities (lower top_prob)
    server.design_temperature = 10.0
    out2 = server.classify_design_model(img)
    top2 = out2['top_prob']

    assert top2 < top1, 'Higher temperature must reduce top probability (flatten distribution)'
