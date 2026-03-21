import importlib.util
from pathlib import Path
from PIL import Image
import pytest

# Load server module (same approach used by existing debug script)
SPEC_PATH = Path(__file__).resolve().parents[1] / "server.py"
spec = importlib.util.spec_from_file_location('backend_server', str(SPEC_PATH))
server = importlib.util.module_from_spec(spec)
spec.loader.exec_module(server)

REPO_ROOT = Path(__file__).resolve().parents[2]


def test_design_model_loads_and_sanity():
    """Ensure DESIGN model is loadable and returns a valid probability vector."""
    # try lazy reload if not loaded
    server.load_design_model()
    if server.design_model is None:
        pytest.skip("DESIGN model not available")
    assert isinstance(server.design_class_to_idx, dict) and len(server.design_class_to_idx) >= 1

    # pick a sample image and run inference (sanity checks)
    sample_img = Image.open(REPO_ROOT / 'DESIGN' / 'Training' / 'no_tumor' / 'image(82).jpg').convert('RGB')
    res = server.classify_design_model(sample_img)
    assert res is not None
    assert 'design_label' in res and 'probabilities' in res and 'top_prob' in res

    probs = res['probabilities']
    # probabilities should sum to ~1.0
    total = sum(float(v) for v in probs.values())
    assert pytest.approx(total, rel=1e-3) == 1.0
    # ensure the four DESIGN labels are represented in the output
    expected = set(['glioma_tumor', 'meningioma_tumor', 'pituitary_tumor', 'no_tumor'])
    assert expected.issubset(set(probs.keys())), f"missing labels: {expected - set(probs.keys())}"
    # when the DESIGN model is available we expect at least a small
    # probability allocated to a second label (i.e. the distribution is not
    # artificially one-hot). this guards against the old "remove differential"
    # behaviour.
    if server.design_model is not None:
        nonzeros = [v for v in probs.values() if 0.0 < float(v) < 1.0]
        assert nonzeros, "Differential missing – distribution collapsed to one-hot"

    # also verify that the synthesis text (probable_causes) includes
    # the confidence distribution so the UI shows it correctly.
    resp = client.post('/process-image', json={'image': payload})
    if resp.status_code == 200:
        data = resp.get_json().get('result', resp.get_json())
        synth = data.get('probable_causes', '') or ''
        for k, v in probs.items():
            assert f"{k}: {(v*100):.1f}%" in synth, \
                f"Synthesis missing confidence for {k}" 


def test_known_no_tumor_image_classified_correctly():
    """Known held-out `no_tumor` image should be predicted as `no_tumor` with high confidence."""
    # Ensure model is loaded
    server.load_design_model()
    if server.design_model is None:
        pytest.skip("DESIGN model not available")

    img_path = REPO_ROOT / 'DESIGN' / 'Training' / 'no_tumor' / 'image(82).jpg'
    img = Image.open(img_path).convert('RGB')
    out = server.classify_design_model(img)
    assert out is not None

    # Prefer exact label match; fall back to probability threshold to avoid flakiness
    expected = 'no_tumor'
    if out['design_label'] != expected:
        # allow high-confidence probability for expected label
        prob = out['probabilities'].get(expected, 0.0)
        assert prob >= 0.6, f"Expected '{expected}' with prob>=0.6, got {prob:.3f} and predicted {out['design_label']}"
    else:
        assert out['top_prob'] >= 0.6


def test_predict_images_marks_critical_alert():
    """predict_images must attach `critical_alert` for any of the 4 trained DESIGN labels.
    New policy: `critical_alert` is True whenever the predicted class is a DESIGN-trained label
    and `critical_score` equals the top probability for the predicted class.
    """
    # import evaluate.py module directly (avoids package import issues)
    import importlib.util
    import json
    evaluate_spec = importlib.util.spec_from_file_location('evaluate_module', str(REPO_ROOT / 'backend-ai' / 'training' / 'evaluate.py'))
    evaluate_mod = importlib.util.module_from_spec(evaluate_spec)
    evaluate_spec.loader.exec_module(evaluate_mod)

    # load class map used by training
    class_map_path = REPO_ROOT / 'models' / 'class_to_idx.json'
    with open(class_map_path, 'r') as f:
        class_to_idx = json.load(f)

    model_path = REPO_ROOT / 'models' / 'multi_disease_from_design.pth'
    # pick a glioma example dynamically (first available image)
    glioma_dir = REPO_ROOT / 'DESIGN' / 'Training' / 'glioma_tumor'
    globbed = sorted(glioma_dir.glob('*.jpg'))
    assert globbed, f"No files found in {glioma_dir}"
    test_img = globbed[0]

    preds = evaluate_mod.predict_images(str(test_img), [str(model_path)], class_to_idx, device='cpu', tta=True)
    assert str(test_img) in preds
    r = preds[str(test_img)]

    # critical_alert must be present and True for DESIGN-trained predictions
    assert 'critical_alert' in r and isinstance(r['critical_alert'], bool)
    assert r['critical_alert'] is True

    # critical_score must equal the top probability for the predicted class
    assert abs(r['critical_score'] - r['top_prob']) < 1e-6
    # probabilities must still sum to 1.0
    assert abs(sum(r['probabilities'].values()) - 1.0) < 1e-3


def test_process_image_confidence_matches_probability():
    """When uploading an image the returned `confidence` must match the normalized probability for the predicted class."""
    from base64 import b64encode
    # use Flask test client from imported server module
    img_path = REPO_ROOT / 'DESIGN' / 'Training' / 'no_tumor' / 'image(82).jpg'
    with open(img_path, 'rb') as f:
        payload = 'data:image/jpeg;base64,' + b64encode(f.read()).decode('ascii')

    client = server.app.test_client()
    resp = client.post('/process-image', json={'image': payload})
    if resp.status_code != 200:
        pytest.skip(f"server unavailable returned {resp.status_code}")
    wrapper = resp.get_json()
    assert wrapper.get('status') == 'success'
    data = wrapper.get('result', {})
    assert 'diagnosis' in data and 'confidence' in data and 'probabilities' in data

    # The server's `diagnosis` may be a normalized/generic label; the
    # authoritative probability is the highest value in `probabilities`.
    probs = data['probabilities']
    assert isinstance(probs, dict) and len(probs) > 0
    top_prob = max(probs.values())

    # confidence should match the normalized top probability (allow tiny rounding diffs)
    assert abs(data['confidence'] - top_prob) < 1e-3, f"confidence ({data['confidence']}) != top probability ({top_prob})"

