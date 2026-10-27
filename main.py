"""
FastAPI Backend for Rate Confirmation Document Extraction
Powered by Google Gemini 3.8 Flash and the modern google-genai SDK.
"""

import os
import json
import base64
from typing import List, Optional, Literal
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from google import genai
from google.genai import types

# Initialize FastAPI application
app = FastAPI(
    title="Rate Confirmation AI Extractor API",
    version="1.0.0",
    description="End-to-end logistics document extraction service powered by Google Gemini 3.8 Flash."
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Gemini Client with secure environment key
api_key = os.environ.get("GEMINI_API_KEY", "")
client = genai.Client(api_key=api_key)

# Pydantic Schemas for Structured Output
class Stop(BaseModel):
    type: Literal["PICKUP", "DELIVERY"]
    stop_number: int
    facility_name: str
    address: str
    appointment_date: str
    appointment_time: str
    notes: Optional[str] = None
    commodity: Optional[str] = None
    weight_lbs: Optional[float] = None
    po_or_ref_number: Optional[str] = None

class BrokerInfo(BaseModel):
    name: str
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None
    address: Optional[str] = None
    dispatcher_name: Optional[str] = None

class CarrierInfo(BaseModel):
    name: str
    mc_number: Optional[str] = None
    dot_number: Optional[str] = None
    contact_phone: Optional[str] = None
    driver_name: Optional[str] = None
    truck_number: Optional[str] = None
    trailer_number: Optional[str] = None

class RateBreakdown(BaseModel):
    linehaul: Optional[float] = None
    fuel_surcharge: Optional[float] = None
    accessorials: Optional[float] = None
    detention_rate_per_hour: Optional[float] = None

class RateConfirmation(BaseModel):
    load_number: str
    broker: BrokerInfo
    carrier: CarrierInfo
    equipment_type: str
    total_rate: float
    currency: str = "USD"
    weight: str
    stops: List[Stop]
    special_instructions: List[str] = Field(default_factory=list)
    breakdown: Optional[RateBreakdown] = None
    temperature_setting: Optional[str] = None
    payment_terms: Optional[str] = None

class JsonExtractRequest(BaseModel):
    base64Data: Optional[str] = None
    mimeType: Optional[str] = "application/pdf"
    fileName: Optional[str] = "rate_confirmation.pdf"
    rawText: Optional[str] = None

EXTRACTION_PROMPT = """
You are an expert logistics document analyzer. Analyze the attached Rate Confirmation (or Load Tender / Carrier Confirmation) PDF or document and extract the key details in the following exact JSON format:
{
  "load_number": "string",
  "broker": {
    "name": "string",
    "contact_email": "string",
    "contact_phone": "string",
    "address": "string",
    "dispatcher_name": "string"
  },
  "carrier": {
    "name": "string",
    "mc_number": "string",
    "dot_number": "string",
    "contact_phone": "string",
    "driver_name": "string",
    "truck_number": "string",
    "trailer_number": "string"
  },
  "equipment_type": "string",
  "total_rate": 0.0,
  "currency": "USD",
  "weight": "string",
  "stops": [
    {
      "type": "PICKUP" or "DELIVERY",
      "stop_number": 1,
      "facility_name": "string",
      "address": "string",
      "appointment_date": "string",
      "appointment_time": "string",
      "notes": "string",
      "commodity": "string",
      "weight_lbs": 0.0,
      "po_or_ref_number": "string"
    }
  ],
  "special_instructions": ["string"],
  "breakdown": {
    "linehaul": 0.0,
    "fuel_surcharge": 0.0,
    "detention_rate_per_hour": 0.0
  },
  "payment_terms": "string",
  "temperature_setting": "string"
}
Ensure all stops are listed chronologically.
Return valid JSON without markdown wrapping.
"""

@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "FastAPI Rate Confirmation Extractor",
        "gemini_model": "gemini-3.8-flash",
        "has_api_key": bool(api_key and api_key != "MY_GEMINI_API_KEY")
    }

@app.post("/api/extract-rate-con")
async def extract_rate_con(
    file: Optional[UploadFile] = File(None),
    request_data: Optional[JsonExtractRequest] = None
):
    """
    Extracts rate confirmation data from an uploaded PDF file or base64 JSON payload.
    Uses Gemini 3.8 Flash for structured extraction.
    """
    pdf_bytes: Optional[bytes] = None
    mime_type = "application/pdf"
    file_name = "rate_confirmation.pdf"

    if file is not None:
        file_name = file.filename or file_name
        pdf_bytes = await file.read()
        mime_type = file.content_type or "application/pdf"
    elif request_data is not None:
        if request_data.base64Data:
            pdf_bytes = base64.b64decode(request_data.base64Data)
            mime_type = request_data.mimeType or mime_type
            file_name = request_data.fileName or file_name
        elif request_data.rawText:
            # Direct text prompt
            try:
                response = client.models.generate_content(
                    model="gemini-3.8-flash",
                    contents=[
                        EXTRACTION_PROMPT,
                        f"Rate Confirmation Document Text:\n{request_data.rawText}"
                    ],
                    config=types.GenerateContentConfig(
                        response_mime_type="application/json",
                    )
                )
                output_text = response.text or "{}"
                data = json.loads(output_text)
                data["fileName"] = "pasted_text_input.txt"
                return data
            except Exception as e:
                raise HTTPException(status_code=500, detail=str(e))
    
    if not pdf_bytes:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No document provided. Please upload a PDF file or provide base64 data."
        )

    try:
        # Create Part from bytes
        pdf_part = types.Part.from_bytes(
            data=pdf_bytes,
            mime_type=mime_type
        )

        response = client.models.generate_content(
            model="gemini-3.8-flash",
            contents=[
                EXTRACTION_PROMPT,
                pdf_part
            ],
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
            )
        )

        output_text = response.text or "{}"
        # Strip potential markdown formatting if returned
        cleaned = output_text.strip()
        if cleaned.startswith("```json"):
            cleaned = cleaned[7:]
        if cleaned.startswith("```"):
            cleaned = cleaned[3:]
        if cleaned.endswith("```"):
            cleaned = cleaned[:-3]
        cleaned = cleaned.strip()

        data = json.loads(cleaned)
        data["fileName"] = file_name
        return data

    except json.JSONDecodeError as jde:
        return {
            "load_number": "PARSE_ERROR",
            "raw_text": output_text,
            "error": "Failed to parse JSON response from Gemini model"
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Extraction failure: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
