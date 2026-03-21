"""
Test the Brain-Scan-AI reference implementation directly
"""
import sys
sys.path.append('src')

import torch
from PIL import Image
from model import load_model, MyModel
from utils import predict
from torchvision import transforms

# Set up
device = "cuda" if torch.cuda.is_available() else "cpu"
model_path = "models/model_38"

# Load model
print(f"Loading model from {model_path}...")
model = load_model(model_path, device)
print(f"✅ Model loaded on {device}\n")

# Transform
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

# Labels
label_dict = {
    0: "No Tumor",
    1: "Pituitary",
    2: "Glioma",
    3: "Meningioma",
    4: "Other",
}

# Test images
test_images = {
    "images/glioma.jpg": "Glioma",
    "images/meningioma.jpg": "Meningioma",
    "images/pituitary.jpg": "Pituitary",
    "images/no_tumor.jpg": "No Tumor",
    "images/other.png": "Other",
}

print("="*70)
print("Testing Reference Brain-Scan-AI Implementation")
print("="*70)

for img_path, expected in test_images.items():
    image = Image.open(img_path).convert('RGB')
    preprocessed = transform(image).unsqueeze(0)
    
    predicted_idx = predict(model, preprocessed, device)
    predicted_class = label_dict[predicted_idx]
    
    status = "✅" if predicted_class == expected else "❌"
    print(f"{status} {img_path}: Expected={expected}, Predicted={predicted_class}")

print("="*70)
