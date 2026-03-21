"""
Simple CNN Model for Brain Tumor Classification
Based on Brain-Scan-AI reference implementation
"""
import torch
import torch.nn as nn


class BrainTumorCNN(nn.Module):
    """
    Simple CNN architecture for brain tumor classification.
    Classifies into 5 categories: No Tumor, Pituitary, Glioma, Meningioma, Other
    Based on Brain-Scan-AI reference implementation
    """
    def __init__(self, num_classes=5):
        super(BrainTumorCNN, self).__init__()
        
        # Convolutional layers with batch normalization
        self.conv1 = nn.Conv2d(3, 32, kernel_size=4, stride=1, padding=0)
        self.bn1 = nn.BatchNorm2d(32)
        
        self.conv2 = nn.Conv2d(32, 64, kernel_size=4, stride=1, padding=0)
        self.bn2 = nn.BatchNorm2d(64)
        
        self.conv3 = nn.Conv2d(64, 128, kernel_size=4, stride=1, padding=0)
        self.bn3 = nn.BatchNorm2d(128)
        
        self.conv4 = nn.Conv2d(128, 128, kernel_size=4, stride=1, padding=0)
        self.bn4 = nn.BatchNorm2d(128)
        
        # Pooling layers
        self.pool = nn.MaxPool2d(kernel_size=3, stride=3)
        self.pool2 = nn.MaxPool2d(kernel_size=3, stride=2)
        
        # Fully connected layers
        self.fc1 = nn.Linear(6 * 6 * 128, 512)
        self.fc2 = nn.Linear(512, num_classes)
        
        # Utility layers
        self.flatten = nn.Flatten()
        self.relu = nn.ReLU()
        self.dropout = nn.Dropout(0.5)

    def forward(self, x):
        """Forward pass through the network"""
        # Conv block 1
        x = self.relu(self.bn1(self.conv1(x)))
        x = self.pool(x)
        
        # Conv block 2
        x = self.relu(self.bn2(self.conv2(x)))
        x = self.pool(x)
        
        # Conv block 3
        x = self.relu(self.bn3(self.conv3(x)))
        x = self.pool2(x)
        
        # Conv block 4
        x = self.relu(self.bn4(self.conv4(x)))
        
        # Fully connected layers
        x = self.flatten(x)
        x = self.relu(self.fc1(x))
        x = self.dropout(x)
        x = self.fc2(x)
        
        return x


def load_model(model_path, device, num_classes=5):
    """
    Load a trained model from disk.
    
    Args:
        model_path: Path to the saved model weights
        device: Device to load model on (cpu or cuda)
        num_classes: Number of output classes (default 5 for Brain-Scan-AI model)
        
    Returns:
        Loaded model in evaluation mode
    """
    model = BrainTumorCNN(num_classes=num_classes)
    model.load_state_dict(torch.load(model_path, map_location=device))
    model.to(device)
    model.eval()
    return model
