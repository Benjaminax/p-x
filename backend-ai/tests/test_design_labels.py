from PIL import Image
import pytest
import importlib.util
import pathlib

# Dynamically load the Flask server module from backend-ai/server.py (hyphen in folder name)
server_path = pathlib.Path(__file__).resolve().parents[1] / "server.py"
spec = importlib.util.spec_from_file_location("backend_server", str(server_path))
server = importlib.util.module_from_spec(spec)
spec.loader.exec_module(server)


def test_classify_brain_disease_returns_design_labels():
    # Create a blank RGB image
    img = Image.new('RGB', (224, 224), color='white')

    probs = server.classify_brain_disease(img)

    # The server's DISEASE_CLASSES should be exactly the 4 DESIGN display names
    expected = set(server.DISEASE_CLASSES)
    assert set(probs.keys()) == expected

    # Probabilities should sum to ~1.0
    total = sum(probs.values())
    assert pytest.approx(total, rel=1e-3) == 1.0
