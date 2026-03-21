"""
Brain Tumor Classification Server
==================================
Simple, clean medical AI diagnostic server for brain MRI classification.
Based on Brain-Scan-AI reference implementation.

Features:
- Flask REST API
- Simple CNN model for brain tumor detection
- 4-class classification: No Tumor, Glioma, Meningioma, Pituitary

Author: NeuroVision Research Team
License: MIT
"""

import os
import io
import json
import base64
import logging
from typing import Dict, Any, List

# Web Framework
from flask import Flask, request, jsonify
from flask_cors import CORS

# Image Processing
import numpy as np
from PIL import Image

# AI / ML Libraries
import torch

# Local modules
from model import BrainTumorCNN, load_model
from utils import preprocess_image, predict_with_probabilities

# Load environment variables
from dotenv import load_dotenv
load_dotenv()

# Configure Logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("brain_tumor_server.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger("BrainTumorClassifier")

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Device configuration
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
logger.info(f"Using device: {device}")

# Label mapping (index to disease name)
# Matches Brain-Scan-AI reference implementation
LABEL_DICT = {
    0: 'No Tumor',
    1: 'Pituitary',
    2: 'Glioma',
    3: 'Meningioma',
    4: 'Other'
}

# Reverse mapping (disease name to index)
NAME_TO_IDX = {v: k for k, v in LABEL_DICT.items()}

# Disease information
DISEASE_INFO = {
    'No Tumor': {
        'description': 'This classification indicates a normal brain scan with no detectable tumor present. Regular monitoring may still be recommended based on clinical symptoms.',
        'severity': 'normal',
        'recommendations': [
            'Regular check-ups as recommended by physician',
            'Maintain healthy lifestyle',
            'Report any new symptoms promptly'
        ]
    },
    'Glioma': {
        'description': 'Gliomas are tumors that grow from glial cells in the brain and spinal cord. They are the most common type of brain tumor, accounting for about 30% of all brain and central nervous system tumors. Symptoms may include headaches, seizures, and cognitive changes.',  
        'severity': 'high',
        'recommendations': [
            'Immediate consultation with neurologist',
            'Further imaging studies (MRI with contrast)',
            'Possible biopsy or surgical evaluation',
            'Multidisciplinary treatment planning'
        ]
    },
    'Meningioma': {
        'description': 'Meningiomas arise from the meninges, the membranes that surround the brain and spinal cord. They represent about 37% of primary brain tumors and are usually slow-growing and benign. Common symptoms include headaches, vision changes, and seizures.',
        'severity': 'high',
        'recommendations': [
            'Consultation with neurosurgeon',
            'Regular monitoring with MRI scans',
            'Surgical evaluation if symptomatic',
            'Radiation therapy consideration'
        ]
    },
    'Pituitary': {
        'description': 'Pituitary tumors develop in the pituitary gland at the base of the brain. They account for about 10-15% of all brain tumors. Symptoms may include hormone imbalances, vision problems, and headaches.',
        'severity': 'high',
        'recommendations': [
            'Endocrinology consultation',
            'Hormone level testing',
            'Vision assessment',
            'Treatment options: medication, surgery, or radiation'
        ]
    },
    'Other': {
        'description': 'This category includes less common brain tumors such as ependymomas, craniopharyngiomas, and lymphomas. Symptoms vary widely depending on the specific type and location.',
        'severity': 'high',
        'recommendations': [
            'Immediate consultation with neurologist',
            'Comprehensive diagnostic imaging',
            'Biopsy for specific tumor identification',
            'Specialized treatment planning based on tumor type'
        ]
    }
}

# Model configuration
MODEL_PATH = os.path.join(os.getcwd(), "models", "brain_tumor_model.pth")

# Global model variable
tumor_model = None


def load_brain_tumor_model():
    """Load the brain tumor classification model"""
    global tumor_model
    
    try:
        if os.path.exists(MODEL_PATH):
            logger.info(f"Loading brain tumor model from {MODEL_PATH}")
            tumor_model = load_model(MODEL_PATH, device, num_classes=5)
            logger.info("✅ Brain tumor classification model loaded successfully (5 classes)")
        else:
            logger.warning(f"⚠️ Model file not found at {MODEL_PATH}")
            logger.warning("Creating new model instance (untrained - 5 classes)")
            tumor_model = BrainTumorCNN(num_classes=5).to(device)
            tumor_model.eval()
    except Exception as e:
        logger.error(f"❌ Failed to load model: {e}")
        tumor_model = None


# Load model at startup
load_brain_tumor_model()


def get_severity_level(diagnosis: str) -> str:
    """Get severity level for a diagnosis"""
    return DISEASE_INFO.get(diagnosis, {}).get('severity', 'low')


def generate_clinical_summary(diagnosis: str, confidence: float, probabilities: Dict[str, float]) -> str:
    """
    Generate a clinical summary for the diagnosis.
    
    Args:
        diagnosis: Predicted diagnosis
        confidence: Confidence score
        probabilities: Probability distribution
        
    Returns:
        Clinical summary text
    """
    info = DISEASE_INFO.get(diagnosis, {})
    description = info.get('description', 'No additional information available.')
    
    # Build differential diagnosis
    sorted_probs = sorted(probabilities.items(), key=lambda x: x[1], reverse=True)
    differential = []
    for disease, prob in sorted_probs[:3]:
        if prob > 0.1:  # Only include if probability > 10%
            differential.append(f"{disease} ({prob*100:.1f}%)")
    
    summary = f"""
Clinical Analysis Summary:
-------------------------
Primary Diagnosis: {diagnosis}
Confidence Level: {confidence*100:.1f}%

Description:
{description}

Differential Diagnoses:
{', '.join(differential)}

Disclaimer:
This is an AI-assisted analysis and should not replace professional medical diagnosis. 
Always consult with qualified healthcare professionals for final diagnosis and treatment decisions.
"""
    return summary


@app.route('/process-image', methods=['POST'])
def process_image():
    """
    Main endpoint for brain MRI image classification.
    
    Expects JSON with base64 encoded image:
    {
        "image": "data:image/png;base64,..."
    }
    
    Returns classification result with probabilities and clinical information.
    """
    try:
        data = request.get_json()
        image_data = data.get('image')
        
        if not image_data:
            return jsonify({
                'status': 'error',
                'message': 'No image data provided'
            }), 400
        
        # Check if model is loaded
        if tumor_model is None:
            return jsonify({
                'status': 'error',
                'message': 'Model not loaded. Please check server logs.'
            }), 503
        
        # Decode base64 image
        if ',' in image_data:
            image_data = image_data.split(',')[1]
        
        image_bytes = base64.b64decode(image_data)
        image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
        
        logger.info(f"Processing image of size: {image.size}")
        
        # Preprocess image
        preprocessed = preprocess_image(image).to(device)
        
        # Make prediction
        predicted_class, probabilities_array = predict_with_probabilities(
            tumor_model, preprocessed, device
        )
        
        # Map to disease names
        diagnosis = LABEL_DICT[predicted_class]
        confidence = float(probabilities_array[predicted_class])
        
        # Build probability dictionary
        probabilities = {
            LABEL_DICT[i]: float(probabilities_array[i]) 
            for i in range(len(LABEL_DICT))
        }
        
        # Get disease information
        disease_info = DISEASE_INFO.get(diagnosis, {})
        
        # Generate clinical summary
        clinical_summary = generate_clinical_summary(diagnosis, confidence, probabilities)
        
        # Determine if this is a critical alert (any tumor detected)
        is_critical = diagnosis != 'No Tumor'
        
        # Build response
        result = {
            'status': 'success',
            'result': {
                'diagnosis': diagnosis,
                'confidence': round(confidence, 4),
                'probabilities': {k: round(v, 4) for k, v in probabilities.items()},
                'severity': disease_info.get('severity', 'unknown'),
                'description': disease_info.get('description', ''),
                'recommendations': disease_info.get('recommendations', []),
                'clinical_summary': clinical_summary,
                'critical_alert': is_critical,
                'image_shape': [image.size[0], image.size[1]],
                'model_type': 'BrainTumorCNN',
                'device': str(device)
            },
            'message': 'Image processed successfully'
        }
        
        logger.info(f"Prediction: {diagnosis} (confidence: {confidence:.4f})")
        
        return jsonify(result), 200
        
    except Exception as e:
        logger.exception(f"Error processing image: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': f'Error processing image: {str(e)}'
        }), 500


@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    model_status = 'loaded' if tumor_model is not None else 'not_loaded'
    
    return jsonify({
        'status': 'healthy',
        'message': 'Brain Tumor Classification Server is running',
        'model': {
            'status': model_status,
            'type': 'BrainTumorCNN',
            'classes': len(LABEL_DICT),
            'device': str(device)
        },
        'supported_formats': ['jpg', 'jpeg', 'png'],
        'api_version': '1.0.0'
    }), 200


@app.route('/api/info', methods=['GET'])
def get_info():
    """Get information about all disease classes"""
    return jsonify({
        'status': 'success',
        'diseases': DISEASE_INFO,
        'classes': list(LABEL_DICT.values())
    }), 200


@app.route('/api/info/<disease>', methods=['GET'])
def get_disease_info(disease):
    """Get information about a specific disease"""
    if disease in DISEASE_INFO:
        return jsonify({
            'status': 'success',
            'disease': disease,
            'info': DISEASE_INFO[disease]
        }), 200
    else:
        return jsonify({
            'status': 'error',
            'message': f'Disease "{disease}" not found'
        }), 404


@app.route('/reload-model', methods=['POST'])
def reload_model():
    """Reload the classification model"""
    try:
        load_brain_tumor_model()
        if tumor_model is not None:
            return jsonify({
                'status': 'success',
                'message': 'Model reloaded successfully'
            }), 200
        else:
            return jsonify({
                'status': 'error',
                'message': 'Failed to reload model'
            }), 500
    except Exception as e:
        logger.exception(f"Error reloading model: {e}")
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500


if __name__ == '__main__':
    print("=" * 60)
    print("🧠 Brain Tumor Classification Server")
    print("=" * 60)
    print(f"📡 Device: {device}")
    print(f"🔬 Model: BrainTumorCNN (5 classes - Brain-Scan-AI)")
    print(f"📊 Classes: {', '.join(LABEL_DICT.values())}")
    print(f"✅ Model Status: {'Loaded' if tumor_model else 'Not Loaded'}")
    print(f"🌐 CORS: Enabled for React frontend")
    print(f"🚀 Starting server on http://0.0.0.0:5000")
    print("=" * 60)
    
    try:
        app.run(host='0.0.0.0', port=5000, debug=False, threaded=True)
    except Exception as e:
        logger.exception(f"Server startup error: {e}")
