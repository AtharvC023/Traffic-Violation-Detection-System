from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class ViolationBase(BaseModel):
    camera_id: str
    location: str
    violation_type: str
    severity: str
    status: str
    plate_number: Optional[str] = None
    description: Optional[str] = None
    evidence_url: Optional[str] = None

class ViolationCreate(ViolationBase):
    id: str
    timestamp: Optional[datetime] = None

class Violation(ViolationBase):
    id: str
    timestamp: datetime

    class Config:
        orm_mode = True

class CameraBase(BaseModel):
    location: str
    status: str
    resolution: Optional[str] = "1920x1080"

class CameraCreate(CameraBase):
    id: str

class Camera(CameraBase):
    id: str

    class Config:
        orm_mode = True
