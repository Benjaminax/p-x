from pathlib import Path
import json
import argparse
import torch
from torchvision import datasets
from torchvision import transforms
from torch.utils.data import random_split
from PIL import Image

# command-line arguments (parsed only when run as script)
parser = argparse.ArgumentParser(description='Review/move misclassified training files')
parser.add_argument('--apply', action='store_true', help='Perform file moves instead of just printing suggestions')
parser.add_argument('--threshold', type=float, default=0.0, help='Minimum top probability to consider a mismatch (0-1)')

# load server module to use classify_design_model
import importlib.util
spec = importlib.util.spec_from_file_location('backend_server', str(Path(__file__).resolve().parents[1] / 'server.py'))
server = importlib.util.module_from_spec(spec)
spec.loader.exec_module(server)

REPO = Path(__file__).resolve().parents[2]
DATA_DIR = REPO / 'DESIGN' / 'Training'
CLASS_MAP = REPO / 'models' / 'class_to_idx.json'

with open(CLASS_MAP,'r') as f:
    class_to_idx = json.load(f)

# dataset transform (only used to get length/order)
transform = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor()
])

ds = datasets.ImageFolder(root=str(DATA_DIR), transform=transform)
# filter to DESIGN classes
allowed = set(class_to_idx.keys())
filtered = [(p,i) for p,i in ds.samples if ds.classes[i] in allowed]
new_classes = sorted(list({ds.classes[i] for _, i in filtered}))
new_class_to_idx = {c: idx for idx,c in enumerate(new_classes)}
new_samples = [(p, new_class_to_idx[ds.classes[idx]]) for p, idx in filtered]
# recreate a dataset-like structure
paths = [p for p,_ in new_samples]
labels = [ds.classes for _ in new_samples]  # not used

# deterministic split like evaluate.py
val_pct = 0.15
val_len = int(len(new_samples) * val_pct)
train_len = len(new_samples) - val_len
generator = torch.Generator().manual_seed(42)
indices = list(range(len(new_samples)))
# random_split uses generator to shuffle; replicate with torch.Generator
train_indices, val_indices = torch.utils.data.random_split(indices, [train_len, val_len], generator=generator)


# collect val filepaths
val_files = [new_samples[i][0] for i in val_indices]



def collect_val_misclassified(threshold: float = 0.0):
    """Return a list of misclassified validation samples.
    Each entry is a tuple (filepath, true_label, pred_label, top_prob, probs_dict).

    The optional *threshold* parameter only records mismatches whose top probability
    is >= threshold; this lets callers (tests/CI/scripts) ignore low-confidence
    model errors.
    """
    print('val sample count:', len(val_files))

    mis = []
    for fp in val_files:
        img = Image.open(fp).convert('RGB')
        res = server.classify_design_model(img)
        pred_token = res['design_label'] if res else None
        top_prob = res['top_prob'] if res else 0.0
        true_token = Path(fp).parent.name
        if pred_token != true_token and top_prob >= threshold:
            mis.append((str(fp), true_token, pred_token, float(top_prob), res.get('probabilities') if res else {}))

    return mis


if __name__ == '__main__':
    # parse CLI args only when running as script (tests import this module)
    args = parser.parse_args()
    mis = collect_val_misclassified(threshold=args.threshold)
    print('misclassified in val set:', len(mis), f'(threshold={args.threshold})')
    for a in mis[:30]:
        print(a[0], a[1], '->', a[2], f'(p={a[3]:.3f})')

    out = Path(__file__).resolve().parents[1] / 'training' / 'val_misclassified.csv'
    with out.open('w') as fh:
        fh.write('file,true,pred,prob\n')
        for a in mis:
            fh.write(f'"{a[0]}","{a[1]}","{a[2]}",{a[3]:.6f}\n')
    print('\nWrote val misclassified CSV ->', out)

