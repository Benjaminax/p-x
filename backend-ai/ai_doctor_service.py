"""
AI Medical Assistant Service
Provides non-technical medical guidance and answers to patients
Integrates with patient medical records for context-aware responses
"""

from fastapi import FastAPI, HTTPException, Depends, Header
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import httpx
import os
from datetime import datetime
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="AI Medical Assistant", version="1.0.0")

# ============ Models ============

class MessageRequest(BaseModel):
    patient_id: str
    message: str
    conversation_id: Optional[str] = None
    context_record_ids: Optional[List[str]] = []

class MessageResponse(BaseModel):
    conversation_id: str
    ai_response: str
    confidence: float
    disclaimer: str
    timestamp: str
    context_used: List[str]

class HealthSummaryRequest(BaseModel):
    patient_id: str
    include_vitals: bool = True
    include_medications: bool = True
    include_recent_records: bool = True

class HealthSummaryResponse(BaseModel):
    patient_id: str
    summary: str
    alerts: List[str]
    recommendations: List[str]
    generated_at: str

class SymptomCheckerRequest(BaseModel):
    symptoms: List[str]
    duration: Optional[str] = None
    severity: Optional[str] = None
    additional_info: Optional[str] = None

class SymptomCheckerResponse(BaseModel):
    possible_conditions: List[Dict[str, Any]]
    recommendations: List[str]
    urgency_level: str
    should_see_doctor: bool
    disclaimer: str

# ============ Configuration ============

BACKEND_CORE_URL = os.getenv("BACKEND_CORE_URL", "http://localhost:3001")
AI_MODEL_ENDPOINT = os.getenv("AI_MODEL_ENDPOINT", "http://localhost:8000")
DISCLAIMER = """
⚠️ IMPORTANT DISCLAIMER:
This AI assistant is for informational purposes only and should NOT be used for:
- Emergency medical situations (call 911 immediately)
- Diagnosis of medical conditions
- Prescribing or changing medications
- Replacing professional medical advice

Always consult with a qualified healthcare provider for medical decisions.
This is an AI-powered tool that may contain errors or provide misleading information.
"""

# ============ Helper Functions ============

async def verify_token(authorization: str = Header(None)) -> Dict:
    """Verify JWT token with backend-core"""
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing")
    
    # In production, validate token with backend-core
    # For now, we'll accept any token (placeholder)
    return {"user_id": "placeholder", "role": "patient"}

async def fetch_medical_context(patient_id: str, record_ids: List[str]) -> Dict:
    """Fetch relevant medical records for context"""
    try:
        async with httpx.AsyncClient() as client:
            # Fetch patient summary
            summary_response = await client.get(
                f"{BACKEND_CORE_URL}/medical-records/summary/patient/{patient_id}"
            )
            
            if summary_response.status_code == 200:
                return summary_response.json()
            else:
                logger.warning(f"Failed to fetch medical context: {summary_response.status_code}")
                return {}
    except Exception as e:
        logger.error(f"Error fetching medical context: {str(e)}")
        return {}

def generate_safe_response(message: str, context: Dict) -> str:
    """
    Generate a safe, non-technical response based on the user's message
    This is a simplified version - in production, integrate with a proper medical LLM
    """
    
    # Common medical questions and safe responses
    responses = {
        "medication": "Based on your records, you're currently taking {medications}. It's important to take them as prescribed. If you have questions about your medications, side effects, or interactions, please contact your doctor directly.",
        
        "vitals": "Your recent vitals show: {vitals}. Regular monitoring is important. If you notice any concerning trends, please schedule an appointment with your healthcare provider.",
        
        "appointment": "I can help you understand your upcoming appointments or recent visit summaries. You can book new appointments through the app or contact your doctor's office directly.",
        
        "symptoms": "I understand you're experiencing symptoms. While I can provide general information, it's important that you discuss specific symptoms with your healthcare provider. If you're experiencing severe or emergency symptoms (chest pain, difficulty breathing, severe bleeding, etc.), please call 911 or go to the nearest emergency room immediately.",
        
        "test_results": "Your recent test results are available in your medical records. Your doctor will review them and contact you if any action is needed. If you have questions about what the results mean, please ask your doctor for clarification.",
        
        "default": "I'm here to help you understand your health records and provide general health information. For specific medical advice, diagnosis, or treatment decisions, please consult with your healthcare provider. Is there something specific from your records you'd like me to explain?"
    }
    
    message_lower = message.lower()
    
    # Determine response type
    if any(word in message_lower for word in ["medication", "medicine", "prescription", "pill"]):
        response_type = "medication"
    elif any(word in message_lower for word in ["vitals", "blood pressure", "temperature", "heart rate"]):
        response_type = "vitals"
    elif any(word in message_lower for word in ["appointment", "schedule", "visit"]):
        response_type = "appointment"
    elif any(word in message_lower for word in ["symptom", "pain", "feel", "sick", "hurt"]):
        response_type = "symptoms"
    elif any(word in message_lower for word in ["test", "result", "lab", "scan"]):
        response_type = "test_results"
    else:
        response_type = "default"
    
    response = responses[response_type]
    
    # Add context if available
    if context.get("activePrescriptions"):
        meds = ", ".join([med.get("medications", [{}])[0].get("name", "N/A") 
                          for med in context["activePrescriptions"][:3]])
        response = response.format(medications=meds if meds else "your prescribed medications")
    
    if context.get("latestVitals"):
        vitals = context["latestVitals"]
        bp = vitals.get("bloodPressure", {})
        vitals_str = f"Blood Pressure: {bp.get('systolic', 'N/A')}/{bp.get('diastolic', 'N/A')}, Heart Rate: {vitals.get('heartRate', 'N/A')} bpm"
        response = response.format(vitals=vitals_str)
    
    return response

def check_symptoms_urgent(symptoms: List[str]) -> bool:
    """Check if symptoms indicate urgent care needed"""
    urgent_keywords = [
        "chest pain", "difficulty breathing", "severe bleeding", "unconscious",
        "severe head injury", "allergic reaction", "stroke", "heart attack",
        "suicide", "severe burn", "poisoning"
    ]
    
    for symptom in symptoms:
        if any(urgent in symptom.lower() for urgent in urgent_keywords):
            return True
    return False

# ============ API Endpoints ============

@app.get("/")
async def root():
    return {
        "service": "AI Medical Assistant",
        "version": "1.0.0",
        "status": "active",
        "disclaimer": DISCLAIMER
    }

@app.post("/ai/chat", response_model=MessageResponse)
async def chat_with_ai(
    request: MessageRequest,
    user: Dict = Depends(verify_token)
):
    """
    Chat with the AI medical assistant
    Provides context-aware, safe responses based on patient records
    """
    try:
        # Fetch medical context
        context = await fetch_medical_context(request.patient_id, request.context_record_ids)
        
        # Generate safe response
        ai_response = generate_safe_response(request.message, context)
        
        # Add disclaimer for certain types of questions
        full_response = ai_response
        if any(word in request.message.lower() for word in ["diagnose", "treat", "cure", "should i"]):
            full_response += "\n\n" + DISCLAIMER
        
        return MessageResponse(
            conversation_id=request.conversation_id or f"conv_{datetime.now().timestamp()}",
            ai_response=full_response,
            confidence=0.85,  # Placeholder confidence score
            disclaimer=DISCLAIMER,
            timestamp=datetime.now().isoformat(),
            context_used=list(context.keys()) if context else []
        )
    
    except Exception as e:
        logger.error(f"Error in AI chat: {str(e)}")
        raise HTTPException(status_code=500, detail="Error processing your request")

@app.post("/ai/health-summary", response_model=HealthSummaryResponse)
async def generate_health_summary(
    request: HealthSummaryRequest,
    user: Dict = Depends(verify_token)
):
    """Generate a comprehensive health summary for the patient"""
    try:
        context = await fetch_medical_context(request.patient_id, [])
        
        summary_parts = []
        alerts = []
        recommendations = []
        
        # Vitals summary
        if request.include_vitals and context.get("latestVitals"):
            vitals = context["latestVitals"]
            summary_parts.append(f"Latest Vitals (recorded {vitals.get('recordedAt', 'recently')}):")
            
            if vitals.get("bloodPressure"):
                bp = vitals["bloodPressure"]
                summary_parts.append(f"- Blood Pressure: {bp['systolic']}/{bp['diastolic']} mmHg")
                
                if bp['systolic'] > 140 or bp['diastolic'] > 90:
                    alerts.append("Blood pressure is elevated")
                    recommendations.append("Monitor blood pressure regularly and consult your doctor")
            
            if vitals.get("heartRate"):
                summary_parts.append(f"- Heart Rate: {vitals['heartRate']} bpm")
            
            if vitals.get("weight"):
                summary_parts.append(f"- Weight: {vitals['weight']} {vitals.get('weightUnit', 'kg')}")
        
        # Medications summary
        if request.include_medications and context.get("activePrescriptions"):
            summary_parts.append("\nActive Medications:")
            for prescription in context["activePrescriptions"][:5]:
                for med in prescription.get("medications", []):
                    summary_parts.append(f"- {med['name']} ({med['dosage']}) - {med['frequency']}")
                    
                    if med.get('adherencePercentage', 100) < 80:
                        alerts.append(f"Low adherence for {med['name']}")
                        recommendations.append(f"Improve medication adherence for {med['name']}")
        
        # Appointments summary
        if context.get("upcomingAppointments"):
            summary_parts.append("\nUpcoming Appointments:")
            for appt in context["upcomingAppointments"][:3]:
                summary_parts.append(f"- {appt.get('reason', 'Appointment')} on {appt.get('scheduledDate')}")
        
        summary = "\n".join(summary_parts) if summary_parts else "No recent health data available"
        
        if not recommendations:
            recommendations = [
                "Maintain regular checkups with your healthcare provider",
                "Keep your medical records up to date",
                "Monitor your vitals regularly"
            ]
        
        return HealthSummaryResponse(
            patient_id=request.patient_id,
            summary=summary,
            alerts=alerts,
            recommendations=recommendations,
            generated_at=datetime.now().isoformat()
        )
    
    except Exception as e:
        logger.error(f"Error generating health summary: {str(e)}")
        raise HTTPException(status_code=500, detail="Error generating health summary")

@app.post("/ai/symptom-checker", response_model=SymptomCheckerResponse)
async def check_symptoms(
    request: SymptomCheckerRequest,
    user: Dict = Depends(verify_token)
):
    """Basic symptom checker - always advises consulting a doctor"""
    
    is_urgent = check_symptoms_urgent(request.symptoms)
    
    if is_urgent:
        return SymptomCheckerResponse(
            possible_conditions=[],
            recommendations=[
                "🚨 SEEK IMMEDIATE MEDICAL ATTENTION 🚨",
                "Call 911 or go to the nearest emergency room",
                "Do not wait or try to treat this at home"
            ],
            urgency_level="EMERGENCY",
            should_see_doctor=True,
            disclaimer=DISCLAIMER
        )
    
    # General response for non-emergency symptoms
    recommendations = [
        "Schedule an appointment with your healthcare provider",
        "Monitor your symptoms and note any changes",
        "Rest and stay hydrated",
        "Avoid self-medication without consulting a doctor"
    ]
    
    if request.severity and request.severity.lower() in ["severe", "high"]:
        recommendations.insert(0, "Consider seeking same-day or urgent care")
    
    return SymptomCheckerResponse(
        possible_conditions=[
            {
                "note": "Symptom checker is for informational purposes only",
                "message": "Multiple conditions can cause similar symptoms. Only a healthcare provider can provide an accurate diagnosis."
            }
        ],
        recommendations=recommendations,
        urgency_level="MODERATE" if request.severity else "LOW",
        should_see_doctor=True,
        disclaimer=DISCLAIMER
    )

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
