import torch
from torchvision import models
ckpt = torch.load('models/multi_disease_from_design.pth', map_location='cpu')
for b in ('resnet50','resnet34','resnet18'):
    cand = getattr(models, b)(pretrained=True).state_dict()
    mismatches = []
    for k, v in ckpt.items():
        if k in cand:
            if v.shape != cand[k].shape:
                mismatches.append((k, v.shape, cand[k].shape))
        else:
            mismatches.append((k, v.shape, None))
    print('\nBACKBONE', b)
    print('ckpt params:', len(ckpt), 'mismatches:', len(mismatches))
    for m in mismatches[:10]:
        print('  ', m)
