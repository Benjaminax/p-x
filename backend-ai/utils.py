"""
Utility functions for brain tumor classification
Based on Brain-Scan-AI reference implementation
"""
import torch
from torchvision import transforms
from PIL import Image


def get_transform():
    """
    Get the standard image transformation pipeline for brain MRI images.
    
    Returns:
        Composed transforms for preprocessing
    """
    return transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
    ])


def preprocess_image(image):
    """
    Preprocess a PIL Image for model input.
    
    Args:
        image: PIL Image object
        
    Returns:
        Preprocessed tensor ready for model input
    """
    transform = get_transform()
    preprocessed = transform(image).unsqueeze(0)
    return preprocessed


def predict(model, image_tensor, device):
    """
    Make a prediction on a preprocessed image.
    
    Args:
        model: Trained PyTorch model
        image_tensor: Preprocessed image tensor
        device: Device to run inference on
        
    Returns:
        Predicted class index (integer)
    """
    model.eval()
    image_tensor = image_tensor.to(device)
    
    with torch.no_grad():
        outputs = model(image_tensor)
        _, predicted = torch.max(outputs, 1)
    
    return predicted.item()


def predict_with_probabilities(model, image_tensor, device):
    """
    Make a prediction and return class probabilities.
    
    Args:
        model: Trained PyTorch model
        image_tensor: Preprocessed image tensor
        device: Device to run inference on
        
    Returns:
        Tuple of (predicted_class_idx, probabilities_dict)
    """
    model.eval()
    image_tensor = image_tensor.to(device)
    
    with torch.no_grad():
        outputs = model(image_tensor)
        probabilities = torch.softmax(outputs, dim=1)[0]
        predicted_class = torch.argmax(probabilities).item()
    
    return predicted_class, probabilities.cpu().numpy()
