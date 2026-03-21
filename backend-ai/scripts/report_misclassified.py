import json
from pathlib import Path
from collections import Counter

pred_path = Path(__file__).parents[1] / 'training' / 'eval_predictions.json'
if not pred_path.exists():
    print('No predictions file found at', pred_path)
    raise SystemExit(1)

preds = json.load(pred_path.open())
mis = []
for fp, v in preds.items():
    true = Path(fp).parent.name
    pred = v.get('pred_class')
    top_prob = float(v.get('top_prob') or 0.0)
    if pred != true:
        mis.append({'file': fp, 'true': true, 'pred': pred, 'prob': top_prob, 'probs': v.get('probabilities', {})})

print('total_images:', len(preds))
print('misclassified_count:', len(mis))

pairs = Counter((m['true'], m['pred']) for m in mis)
print('\nTop misclassification types:')
for (t,p),c in pairs.most_common(15):
    print(f'  {t} -> {p}: {c}')

print('\nFirst 20 misclassified examples:')
for m in mis[:20]:
    print(f"{m['file']}  |  {m['true']} -> {m['pred']}  (p={m['prob']:.3f})")

out_csv = Path(__file__).parents[1] / 'training' / 'misclassified_samples.csv'
with out_csv.open('w') as fh:
    fh.write('file,true,pred,prob\n')
    for m in mis:
        fh.write(f'"{m["file"]}","{m["true"]}","{m["pred"]}",{m["prob"]:.6f}\n')

print('\nSaved misclassified CSV ->', out_csv)
