"""
Brain Tumor CNN Training Script
================================
Trains the BrainTumorCNN model on DESIGN/Training data

Based on Brain-Scan-AI architecture with proper epoch training.

Usage:
    python backend-ai/training/train_brain_cnn.py --epochs 30 --batch-size 32
"""
import os
import sys
import argparse
import json
from pathlib import Path
from tqdm import tqdm
import time

import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader, random_split
from torchvision import datasets, transforms

# Add parent directory to path to import model
sys.path.append(os.path.dirname(os.path.dirname(__file__)))
from model import BrainTumorCNN


def get_transforms(train=True):
    """
    Image transformations matching Brain-Scan-AI preprocessing.
    """
    if train:
        return transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.RandomHorizontalFlip(p=0.5),
            transforms.RandomRotation(degrees=15),
            transforms.ColorJitter(brightness=0.1, contrast=0.1),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
        ])
    else:
        return transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
        ])


def train_model(data_dir, output_path, epochs=30, batch_size=32, learning_rate=0.001, 
                val_split=0.2, patience=10, device=None):
    """
    Train BrainTumorCNN model on brain tumor dataset.
    
    Args:
        data_dir: Path to DESIGN/Training directory with subfolders per class
        output_path: Where to save trained model
        epochs: Number of training epochs
        batch_size: Batch size for training
        learning_rate: Initial learning rate
        val_split: Validation set fraction
        patience: Early stopping patience (epochs without improvement)
        device: torch device (auto-detected if None)
    """
    if device is None:
        device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    
    print("="*70)
    print("🧠 Brain Tumor CNN Training")
    print("="*70)
    print(f"Data Directory: {data_dir}")
    print(f"Output Path: {output_path}")
    print(f"Device: {device}")
    print(f"Epochs: {epochs}")
    print(f"Batch Size: {batch_size}")
    print(f"Learning Rate: {learning_rate}")
    print("="*70)
    
    # Load dataset
    print("\n📂 Loading dataset...")
    dataset = datasets.ImageFolder(root=data_dir, transform=get_transforms(train=True))
    
    # Check for expected classes
    expected_classes = ['glioma_tumor', 'meningioma_tumor', 'no_tumor', 'pituitary_tumor']
    print(f"Found {len(dataset.classes)} classes: {dataset.classes}")
    print(f"Total images: {len(dataset)}")
    
    # Map to indices
    class_to_idx = dataset.class_to_idx
    num_classes = len(class_to_idx)
    
    # Add "Other" class mapping (index 4) for compatibility
    idx_to_class = {v: k for k, v in class_to_idx.items()}
    idx_to_class[4] = 'other'  # Reserve index 4 for "other" class
    
    # Save class mapping
    output_dir = Path(output_path).parent
    output_dir.mkdir(parents=True, exist_ok=True)
    
    class_map_path = output_dir / 'class_to_idx.json'
    with open(class_map_path, 'w') as f:
        # Save both training classes and the reserved "other" class
        full_mapping = {**class_to_idx, 'other': 4}
        json.dump(full_mapping, f, indent=2)
    print(f"✅ Saved class mapping to {class_map_path}")
    
    # Split into train and validation
    val_size = int(len(dataset) * val_split)
    train_size = len(dataset) - val_size
    
    train_dataset, val_dataset = random_split(
        dataset, 
        [train_size, val_size],
        generator=torch.Generator().manual_seed(42)
    )
    
    # Update validation dataset to use non-augmented transforms
    val_dataset.dataset = datasets.ImageFolder(root=data_dir, transform=get_transforms(train=False))
    
    print(f"Training samples: {train_size}")
    print(f"Validation samples: {val_size}")
    
    # Create data loaders
    train_loader = DataLoader(
        train_dataset, 
        batch_size=batch_size, 
        shuffle=True,
        num_workers=4,
        pin_memory=True if torch.cuda.is_available() else False
    )
    
    val_loader = DataLoader(
        val_dataset,
        batch_size=batch_size,
        shuffle=False,
        num_workers=2,
        pin_memory=True if torch.cuda.is_available() else False
    )
    
    # Initialize model (5 classes: 4 training + 1 reserved for "other")
    print(f"\n🔧 Initializing BrainTumorCNN with {num_classes + 1} output classes...")
    model = BrainTumorCNN(num_classes=5)  # 5 classes total
    model = model.to(device)
    
    # Loss and optimizer
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=learning_rate)
    scheduler = optim.lr_scheduler.ReduceLROnPlateau(
        optimizer, mode='min', factor=0.5, patience=5, verbose=True
    )
    
    # Training history
    history = {
        'train_loss': [],
        'train_acc': [],
        'val_loss': [],
        'val_acc': [],
        'learning_rate': []
    }
    
    best_val_acc = 0.0
    best_epoch = 0
    epochs_no_improve = 0
    
    print("\n🚀 Starting training...\n")
    
    for epoch in range(1, epochs + 1):
        epoch_start = time.time()
        
        # ==================== TRAINING ====================
        model.train()
        train_loss = 0.0
        train_correct = 0
        train_total = 0
        
        pbar = tqdm(train_loader, desc=f'Epoch {epoch}/{epochs} [Train]')
        for images, labels in pbar:
            images = images.to(device)
            labels = labels.to(device)
            
            # Forward pass
            optimizer.zero_grad()
            outputs = model(images)
            loss = criterion(outputs, labels)
            
            # Backward pass
            loss.backward()
            optimizer.step()
            
            # Statistics
            train_loss += loss.item() * images.size(0)
            _, predicted = torch.max(outputs.data, 1)
            train_total += labels.size(0)
            train_correct += (predicted == labels).sum().item()
            
            # Update progress bar
            pbar.set_postfix({
                'loss': f'{loss.item():.4f}',
                'acc': f'{100 * train_correct / train_total:.2f}%'
            })
        
        train_loss = train_loss / train_total
        train_acc = 100 * train_correct / train_total
        
        # ==================== VALIDATION ====================
        model.eval()
        val_loss = 0.0
        val_correct = 0
        val_total = 0
        
        with torch.no_grad():
            pbar = tqdm(val_loader, desc=f'Epoch {epoch}/{epochs} [Val]')
            for images, labels in pbar:
                images = images.to(device)
                labels = labels.to(device)
                
                outputs = model(images)
                loss = criterion(outputs, labels)
                
                val_loss += loss.item() * images.size(0)
                _, predicted = torch.max(outputs.data, 1)
                val_total += labels.size(0)
                val_correct += (predicted == labels).sum().item()
                
                pbar.set_postfix({
                    'loss': f'{loss.item():.4f}',
                    'acc': f'{100 * val_correct / val_total:.2f}%'
                })
        
        val_loss = val_loss / val_total
        val_acc = 100 * val_correct / val_total
        
        # Update learning rate scheduler
        scheduler.step(val_loss)
        current_lr = optimizer.param_groups[0]['lr']
        
        # Save history
        history['train_loss'].append(train_loss)
        history['train_acc'].append(train_acc)
        history['val_loss'].append(val_loss)
        history['val_acc'].append(val_acc)
        history['learning_rate'].append(current_lr)
        
        epoch_time = time.time() - epoch_start
        
        # Print epoch summary
        print(f"\n{'='*70}")
        print(f"Epoch {epoch}/{epochs} Summary ({epoch_time:.1f}s)")
        print(f"{'='*70}")
        print(f"Train Loss: {train_loss:.4f} | Train Acc: {train_acc:.2f}%")
        print(f"Val Loss:   {val_loss:.4f} | Val Acc:   {val_acc:.2f}%")
        print(f"Learning Rate: {current_lr:.6f}")
        
        # Save best model
        if val_acc > best_val_acc:
            best_val_acc = val_acc
            best_epoch = epoch
            epochs_no_improve = 0
            
            torch.save(model.state_dict(), output_path)
            print(f"✅ Best model saved! (Val Acc: {val_acc:.2f}%)")
        else:
            epochs_no_improve += 1
            print(f"⚠️  No improvement for {epochs_no_improve} epoch(s)")
        
        print(f"{'='*70}\n")
        
        # Early stopping
        if epochs_no_improve >= patience:
            print(f"🛑 Early stopping triggered after {epoch} epochs")
            print(f"   Best validation accuracy: {best_val_acc:.2f}% (Epoch {best_epoch})")
            break
    
    # Save training history
    history_path = output_dir / 'train_history.json'
    with open(history_path, 'w') as f:
        json.dump(history, f, indent=2)
    print(f"\n✅ Saved training history to {history_path}")
    
    # Save metadata
    metadata = {
        'model': 'BrainTumorCNN',
        'num_classes': 5,
        'classes': list(class_to_idx.keys()) + ['other'],
        'total_epochs': epoch,
        'best_epoch': best_epoch,
        'best_val_acc': best_val_acc,
        'batch_size': batch_size,
        'learning_rate': learning_rate,
        'train_samples': train_size,
        'val_samples': val_size
    }
    
    metadata_path = output_dir / 'brain_tumor_model.meta.json'
    with open(metadata_path, 'w') as f:
        json.dump(metadata, f, indent=2)
    print(f"✅ Saved metadata to {metadata_path}")
    
    print("\n" + "="*70)
    print("🎉 Training Complete!")
    print("="*70)
    print(f"Best Model: {output_path}")
    print(f"Best Validation Accuracy: {best_val_acc:.2f}% (Epoch {best_epoch})")
    print(f"Total Epochs Trained: {epoch}")
    print("="*70)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Train BrainTumorCNN model')
    
    parser.add_argument('--data-dir', type=str, 
                        default='../../DESIGN/Training',
                        help='Path to training data directory')
    
    parser.add_argument('--output', type=str,
                        default='../models/brain_tumor_model.pth',
                        help='Output model path')
    
    parser.add_argument('--epochs', type=int, default=30,
                        help='Number of training epochs')
    
    parser.add_argument('--batch-size', type=int, default=32,
                        help='Batch size for training')
    
    parser.add_argument('--lr', type=float, default=0.001,
                        help='Learning rate')
    
    parser.add_argument('--val-split', type=float, default=0.2,
                        help='Validation set fraction')
    
    parser.add_argument('--patience', type=int, default=10,
                        help='Early stopping patience')
    
    args = parser.parse_args()
    
    # Resolve paths relative to script location
    script_dir = Path(__file__).parent
    data_dir = (script_dir / args.data_dir).resolve()
    output_path = (script_dir / args.output).resolve()
    
    if not data_dir.exists():
        print(f"❌ Error: Data directory not found: {data_dir}")
        sys.exit(1)
    
    # Train the model
    train_model(
        data_dir=str(data_dir),
        output_path=str(output_path),
        epochs=args.epochs,
        batch_size=args.batch_size,
        learning_rate=args.lr,
        val_split=args.val_split,
        patience=args.patience
    )
