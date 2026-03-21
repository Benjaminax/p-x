import importlib.util
import json
from pathlib import Path

spec = importlib.util.spec_from_file_location('evaluate_module', str(Path(__file__).parents[1] / 'training' / 'evaluate.py'))
evaluate_mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(evaluate_mod)

repo = Path(__file__).resolve().parents[2]
class_map = repo / 'models' / 'class_to_idx.json'
with open(class_map, 'r') as f:
    class_to_idx = json.load(f)

model_path = repo / 'models' / 'multi_disease_from_design.pth'
image_dir = repo / 'DESIGN' / 'Training'

print('Running predict_images on', image_dir)
# predict_images is non-recursive; run it per-class subdirectory
all_preds = {}
for sub in sorted(image_dir.iterdir()):
    if not sub.is_dir():
        continue
    sub_preds = evaluate_mod.predict_images(str(sub), [str(model_path)], class_to_idx, device='cpu', tta=True)
    all_preds.update(sub_preds)

out_path = Path(__file__).parents[1] / 'training' / 'eval_predictions.json'
with open(out_path, 'w') as f:
    json.dump(all_preds, f, indent=2)

print('Wrote', out_path, '-> total predictions =', len(all_preds))
