"""Utility to fix mislabeled images in DESIGN/Training based on prediction logs.

Usage:
    python backend-ai/scripts/correct_labels.py [--apply]

Without --apply the script will print proposed moves; with --apply it will actually
move the files into the predicted class directory (creating it if necessary).
"""
import csv
import shutil
from pathlib import Path
import argparse

parser = argparse.ArgumentParser(description='Review/move misclassified training files')
parser.add_argument('--apply', action='store_true', help='Perform file moves instead of just printing suggestions')
args = parser.parse_args()

csv_path = Path(__file__).resolve().parents[1] / 'training' / 'val_misclassified.csv'
if not csv_path.exists():
    print('No misclassified CSV found; run check_val_design_preds.py first')
    raise SystemExit(1)

moves = []
with csv_path.open() as fh:
    reader = csv.DictReader(fh)
    for r in reader:
        current = Path(r['file'])
        true = r['true']
        pred = r['pred']
        if true != pred:
            target_dir = current.parent.parent / pred
            target_path = target_dir / current.name
            moves.append((current, target_path))

if not moves:
    print('No discrepancies found between true and predicted labels.')
    raise SystemExit(0)

print(f'Found {len(moves)} files with mismatched labels:')
for src, dst in moves:
    print(f'  {src} -> {dst}')

if args.apply:
    print('Applying moves...')
    for src, dst in moves:
        if not src.exists():
            print(f"Source missing, skipping: {src}")
            continue
        dst.parent.mkdir(exist_ok=True, parents=True)
        print(f'Moving {src} to {dst}')
        try:
            shutil.move(str(src), str(dst))
        except Exception as e:
            print(f"Failed to move {src} -> {dst}: {e}")
    print('Done.')
else:
    print('\nRun with --apply to perform the moves.')
