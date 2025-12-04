from pydantic import BaseModel, Field, validator
from typing import Optional, Dict, Any, List
from datetime import datetime
import uuid

from app.models.violation import ViolationType, ViolationSeverity, ViolationStatus

class ViolationBase(BaseModel):
    """Base violation schema"""
    violation_type: ViolationType
    severity: ViolationSeverity = ViolationSeverity.MEDIUM
    license_plate: Optional[str] = None
    vehicle_type: Optional[str] = None
    vehicle_color: Optional[str] = None
    location: str
    coordinates: Optional[Dict[str, float]] = None
    detection_time: datetime
    confidence_score: float = Field(..., ge=0.0, le=1.0)
    fine_amount: Optional[float] = Field(None, ge=0)
    penalty_points: Optional[int] = Field(None, ge=0)

class ViolationCreate(ViolationBase):
    """Schema for creating violations"""
    camera_id: uuid.UUID
    image_path: Optional[str] = None
    video_path: Optional[str] = None
    additional_evidence: Optional[Dict[str, Any]] = None
    ai_analysis: Optional[Dict[str, Any]] = None
    llama_analysis: Optional[Dict[str, Any]] = None
    gpt4o_analysis: Optional[Dict[str, Any]] = None

class ViolationUpdate(BaseModel):
    """Schema for updating violations"""
    status: Optional[ViolationStatus] = None
    processing_notes: Optional[str] = None
    fine_amount: Optional[float] = Field(None, ge=0)
    penalty_points: Optional[int] = Field(None, ge=0)

class ViolationResponse(ViolationBase):
    """Schema for violation responses"""
    id: uuid.UUID
    status: ViolationStatus
    camera_id: uuid.UUID
    image_path: Optional[str] = None
    video_path: Optional[str] = None
    additional_evidence: Optional[Dict[str, Any]] = None
    ai_analysis: Optional[Dict[str, Any]] = None
    llama_analysis: Optional[Dict[str, Any]] = None
    gpt4o_analysis: Optional[Dict[str, Any]] = None
    processed_by: Optional[uuid.UUID] = None
    processing_notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class ViolationFilter(BaseModel):
    """Schema for filtering violations"""
    violation_type: Optional[ViolationType] = None
    severity: Optional[ViolationSeverity] = None
    status: Optional[ViolationStatus] = None
    camera_id: Optional[str] = None
    location: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    min_confidence: Optional[float] = Field(None, ge=0.0, le=1.0)
    max_confidence: Optional[float] = Field(None, ge=0.0, le=1.0)

class ViolationStats(BaseModel):
    """Schema for violation statistics"""
    total_violations: int
    violations_by_type: Dict[str, int]
    violations_by_severity: Dict[str, int]
    violations_by_status: Dict[str, int]
    average_confidence: Optional[float] = None
    most_common_location: Optional[str] = None

class ViolationBatch(BaseModel):
    """Schema for batch operations"""
    violation_ids: List[str]
    operation: str = Field(..., pattern="^(confirm|dismiss|review)$")
    
    @validator('violation_ids')
    def validate_violation_ids(cls, v):
        if len(v) == 0:
            raise ValueError("At least one violation ID is required")
        if len(v) > 100:
            raise ValueError("Maximum 100 violations per batch")
        return v