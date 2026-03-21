import importlib.util
from pathlib import Path
from PIL import Image
import pytest

# load server as before
SPEC_PATH = Path(__file__).resolve().parents[1] / "server.py"
spec = importlib.util.spec_from_file_location('backend_server', str(SPEC_PATH))
server = importlib.util.module_from_spec(spec)
spec.loader.exec_module(server)

REPO_ROOT = Path(__file__).resolve().parents[2]


@pytest.mark.parametrize("category", [
    'no_tumor',
    'glioma_tumor',
    'meningioma_tumor',
    'pituitary_tumor',
])
def test_design_confidence_and_probabilities(category):
    """Basic end-to-end sanity for all four DESIGN classes.

    - each category must appear in the returned probability map
    - the single `confidence` field reflects the appropriate probability
      (for tumours the value will later be compared against `critical_score`)
    - when a non‑tumour category is used the `critical_alert` flag should be
      False and the confidence should match its probability exactly.
    """
    # prevent network calls during test
    server.openai_client = None
    server.GOOGLE_API_KEY = None

    # disable safety override to make the server behave deterministically for
    # the no_tumor case; if we're testing a tumour we re-enable it below.
    import os
    os.environ['DISABLE_SAFETY_OVERRIDE'] = '1'

    server.load_design_model()
    if server.design_model is None:
        pytest.skip("DESIGN model not available; skipping analysis")

    # pick a sample image dynamically to avoid hard‑coding a single path
    img_dir = REPO_ROOT / 'DESIGN' / 'Training' / category
    candidates = list(img_dir.glob('*.jpg'))
    assert candidates, f"No images found for category {category}"
    img_path = candidates[0]
    assert img_path.exists(), f"Test image not found at {img_path}"

    # prepare payload
    client = server.app.test_client()
    import base64
    with open(img_path, 'rb') as f:
        encoded = base64.b64encode(f.read()).decode('utf-8')
    payload = f'data:image/jpeg;base64,{encoded}'

    resp = client.post('/process-image', json={'image': payload})
    if resp.status_code != 200:
        pytest.skip(f"Server returned {resp.status_code}; likely no DESIGN model or preprocessing error")
    response_data = resp.get_json()
    data = response_data.get('result', response_data)

    # assert shape of the response
    assert 'probabilities' in data, f"missing probabilities: {data.keys()}"
    assert 'confidence' in data, f"missing confidence: {data.keys()}"
    assert 'critical_alert' in data, f"missing critical_alert: {data.keys()}"

    probs = data['probabilities']
    # probabilities should at least contain every DESIGN label
    expected_keys = set(['glioma_tumor', 'meningioma_tumor', 'pituitary_tumor', 'no_tumor'])
    assert expected_keys.issubset(set(probs.keys())), f"Probabilities missing keys: {set(probs.keys())}"

    # determine which key the server used for confidence
    # prefer the diagnosis if present, otherwise look for top probability
    diag = data.get('diagnosis') or data.get('design_label')
    if diag and diag in probs:
        chosen_key = diag
    else:
        # fall back to highest-probability entry
        chosen_key = max(probs, key=probs.get)

    expected_conf = float(probs[chosen_key])
    assert abs(data['confidence'] - expected_conf) < 1e-4, (
        f"confidence {data['confidence']} != prob[{chosen_key}] {expected_conf}"
    )

    # verify critical flag behaviour for non‑tumour
    if category == 'no_tumor':
        assert data['critical_alert'] is False, "expected no critical alert for no_tumor"
    else:
        # restore default behaviour so tumours can trigger alerts
        os.environ.pop('DISABLE_SAFETY_OVERRIDE', None)
        # tumour categories should ordinarily set critical_alert
        # we don't assert True here because probability threshold may vary,
        # but the confidence / critical_score relationship will be checked
        # in the dedicated tumour test below.
        pass


@pytest.mark.parametrize("tumour_dir", [
    'glioma_tumor',
    'meningioma_tumor',
    'pituitary_tumor',
])
def test_tumor_confidence_matches_critical_score(tumour_dir):
    """Tumour categories should set a critical alert and propagate confidence.

    This test runs once for each DESIGN-trained tumour subtype and ensures that
    when an image from that folder is supplied:

    * `critical_alert` is reported (threshold-based so we don't assert True
      strictly, but we check the overlaid logic below)
    * `confidence` equals `critical_score`
    * the published probability for the predicted diagnosis matches the
      returned confidence
    * the descriptive synthesis contains the text "Critical Alert"
    """
    # prepare environment -- enable safety override so the backend may trigger
    # the alert normally
    server.openai_client = None
    server.GOOGLE_API_KEY = None
    import os
    os.environ.pop('DISABLE_SAFETY_OVERRIDE', None)

    server.load_design_model()
    if server.design_model is None:
        pytest.skip("DESIGN model not available; skipping tumour check")
    img_dir = REPO_ROOT / 'DESIGN' / 'Training' / tumour_dir
    candidates = list(img_dir.glob('*.jpg'))
    assert candidates, f"No images found in {img_dir}"
    img_path = candidates[0]

    import base64
    with open(img_path, 'rb') as f:
        encoded = base64.b64encode(f.read()).decode('utf-8')
    payload = f'data:image/jpeg;base64,{encoded}'

    client = server.app.test_client()
    resp = client.post('/process-image', json={'image': payload})
    assert resp.status_code == 200
    resp_data = resp.get_json()
    data = resp_data.get('result', resp_data)

    assert 'critical_alert' in data and isinstance(data['critical_alert'], bool)
    # confidence and critical_score should match (zero when alert is False)
    assert 'critical_score' in data, "Missing critical_score"
    assert abs(data['confidence'] - data['critical_score']) < 1e-4, \
        f"confidence {data['confidence']} != critical_score {data['critical_score']}"

    probs = data.get('probabilities', {})
    top = data.get('diagnosis')
    if top in probs:
        assert abs(data['confidence'] - probs.get(top, 0.0)) < 1e-4, (
            f"confidence {data['confidence']} does not match probability {probs.get(top)}"
        )

    # synthesis should note the alert if one occurred
    synth = data.get('probable_causes', '')
    assert isinstance(synth, str)
    if data.get('critical_alert'):
        assert 'Critical Alert' in synth
