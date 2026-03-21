import torch
import torch.nn.functional as F
from torchvision import transforms
from PIL import Image
from pathlib import Path
import csv

# load server module to get design_model and mappings
import importlib.util
spec = importlib.util.spec_from_file_location('backend_server', str(Path(__file__).resolve().parents[1] / 'server.py'))
server = importlib.util.module_from_spec(spec)
spec.loader.exec_module(server)

OUT_DIR = Path(__file__).resolve().parents[1] / 'training' / 'gradcam_misclassified'
OUT_DIR.mkdir(parents=True, exist_ok=True)
CSV = Path(__file__).resolve().parents[1] / 'training' / 'val_misclassified.csv'
if not CSV.exists():
    print('val_misclassified.csv not found — run check_val_design_preds.py first')
    raise SystemExit(1)

# basic preprocess (must match classify_design_model)
preproc = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485,0.456,0.406], std=[0.229,0.224,0.225])
])

# helper: find last conv layer for ResNet-like models
def _find_last_conv(model):
    # prefer layer4, else search for Conv2d
    for name in ('layer4', 'layer3', 'layer2'):
        if hasattr(model, name):
            return getattr(model, name)
    # fallback: iterate modules
    last = None
    for m in model.modules():
        if isinstance(m, torch.nn.Conv2d):
            last = m
    return last

# Grad-CAM implementation (CPU)
model = server.design_model
if model is None:
    print('DESIGN model not loaded')
    raise SystemExit(1)
model.eval()
model.zero_grad()

# access conv features and gradients via hooks
features = None
grads = None

# find a convolutional layer to hook into
# for ResNet, we want the final feature map before avgpool: model.layer4
conv_layer = None
if hasattr(model, 'layer4'):
    conv_layer = model.layer4
else:
    # try to find last conv inside model
    for n, m in model.named_modules():
        if isinstance(m, torch.nn.Conv2d):
            conv_layer = m

if conv_layer is None:
    print('Could not find conv layer to use for Grad-CAM')
    raise SystemExit(1)

# But we need to attach hook to the module that outputs feature maps (e.g., model.layer4)

def forward_hook(module, inp, outp):
    global features
    features = outp.detach()

def backward_hook(module, grad_in, grad_out):
    global grads
    grads = grad_out[0].detach()

# register hooks on the last conv module
handle_f = conv_layer.register_forward_hook(forward_hook)
handle_b = conv_layer.register_backward_hook(backward_hook)

# process top N misclassified samples
rows = []
with CSV.open('r', newline='') as fh:
    reader = csv.DictReader(fh)
    for r in reader:
        rows.append(r)

N = min(12, len(rows))
print('Generating Grad-CAM for', N, 'misclassified validation images')
for i, r in enumerate(rows[:N]):
    fp = Path(r['file'])
    true = r['true']
    pred = r['pred']
    prob = float(r['prob'])

    img = Image.open(fp).convert('RGB')
    inp = preproc(img).unsqueeze(0)

    # forward
    out = model(inp)
    # predicted index for pred token
    try:
        idx = list(server.design_idx_to_class.keys())[list(server.design_idx_to_class.values()).index(pred)]
    except ValueError:
        # fallback: use argmax
        idx = out.argmax(dim=1).item()

    score = out[0, idx]
    model.zero_grad()
    score.backward(retain_graph=True)

    # grads: (batch, channels, h, w); features same
    if features is None or grads is None:
        print('Hook failed for', fp)
        continue

    weights = grads.mean(dim=(2,3), keepdim=True)  # global avg pool over H,W
    cam = (weights * features).sum(dim=1, keepdim=True)
    cam = F.relu(cam)
    cam = F.interpolate(cam, size=(224,224), mode='bilinear', align_corners=False)
    cam = cam[0,0].cpu().numpy()
    cam = (cam - cam.min()) / (cam.max() - cam.min() + 1e-8)

    # overlay heatmap on original (resized) image
    vis = img.resize((224,224)).convert('RGBA')
    import numpy as np
    heat = np.uint8(255 * cam)
    import matplotlib.pyplot as plt
    cmap = plt.get_cmap('jet')
    colored = cmap(heat/255.0)  # RGBA
    colored = (colored[:, :, :3] * 255).astype('uint8')
    heat_img = Image.fromarray(colored).convert('RGBA')

    blended = Image.blend(vis, heat_img, alpha=0.5)
    outp = OUT_DIR / f'{i}_{fp.stem}_true-{true}_pred-{pred}.png'
    blended.save(outp)
    print(f'Saved Grad-CAM -> {outp} (p={prob:.3f})')

# remove hooks
handle_f.remove()
handle_b.remove()
print('Done')
