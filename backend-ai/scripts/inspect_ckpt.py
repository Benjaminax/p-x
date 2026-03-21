import torch
p = 'models/multi_disease_from_design.pth'
ckpt = torch.load(p, map_location='cpu')
print('type', type(ckpt))
if isinstance(ckpt, dict):
    keys = list(ckpt.keys())
    print('num_keys', len(keys))
    print('sample_keys', keys[:20])
    shapes = [(k, getattr(ckpt[k], 'shape', type(ckpt[k]))) for k in keys[:12]]
    for s in shapes:
        print(s)
else:
    print('content not dict', ckpt)
