"""
Test model accuracy against known sample images from Brain-Scan-AI
"""
import os
import torch
from PIL import Image
from model import load_model
from utils import preprocess_image, predict_with_probabilities

# Configuration
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
MODEL_PATH = os.path.join("models", "brain_tumor_model.pth")

# Labels
LABEL_DICT = {
    0: 'No Tumor',
    1: 'Pituitary',
    2: 'Glioma',
    3: 'Meningioma',
    4: 'Other'
}

# Test images from Brain-Scan-AI reference samples
TEST_IMAGES = {
    "../DESIGN/Brain-Scan-AI-main/images/glioma.jpg": "Glioma",
    "../DESIGN/Brain-Scan-AI-main/images/meningioma.jpg": "Meningioma",
    "../DESIGN/Brain-Scan-AI-main/images/pituitary.jpg": "Pituitary",
    "../DESIGN/Brain-Scan-AI-main/images/no_tumor.jpg": "No Tumor",
    "../DESIGN/Brain-Scan-AI-main/images/other.png": "Other",
}

def test_model():
    """Test the model with known samples"""
    print(f"Loading model from {MODEL_PATH}...")
    print(f"Using device: {device}")
    
    # Load model
    if not os.path.exists(MODEL_PATH):
        print(f"❌ Model file not found: {MODEL_PATH}")
        return
    
    model = load_model(MODEL_PATH, device, num_classes=5)
    print("✅ Model loaded successfully\n")
    
    # Test each image
    correct = 0
    total = 0
    
    print("="*70)
    print("Testing Model Accuracy with Reference Sample Images")
    print("="*70)
    
    for img_path, expected_class in TEST_IMAGES.items():
        if not os.path.exists(img_path):
            print(f"⚠️  Image not found: {img_path}")
            continue
        
        # Load and preprocess image
        image = Image.open(img_path).convert('RGB')
        preprocessed = preprocess_image(image).to(device)
        
        # Make prediction
        predicted_idx, probabilities = predict_with_probabilities(model, preprocessed, device)
        predicted_class = LABEL_DICT[predicted_idx]
        confidence = float(probabilities[predicted_idx])
        
        # Check if correct
        is_correct = predicted_class == expected_class
        if is_correct:
            correct += 1
        total += 1
        
        # Display result
        status = "✅" if is_correct else "❌"
        print(f"\n{status} Image: {os.path.basename(img_path)}")
        print(f"   Expected: {expected_class}")
        print(f"   Predicted: {predicted_class}")
        print(f"   Confidence: {confidence*100:.2f}%")
        print(f"   Top 3 probabilities:")
        
        # Show top 3 predictions
        sorted_probs = sorted(enumerate(probabilities), key=lambda x: x[1], reverse=True)
        for i, (idx, prob) in enumerate(sorted_probs[:3]):
            print(f"      {i+1}. {LABEL_DICT[idx]}: {prob*100:.2f}%")
    
    # Summary
    print("\n" + "="*70)
    print(f"Accuracy: {correct}/{total} ({correct/total*100:.1f}%)")
    print("="*70)
    
    if correct == total:
        print("🎉 Perfect! Model is working correctly!")
    elif correct >= total * 0.8:
        print("✅ Model is performing well (≥80% accuracy)")
    else:
        print("⚠️  Model may need retraining or has loading issues")

if __name__ == "__main__":
    test_model()
