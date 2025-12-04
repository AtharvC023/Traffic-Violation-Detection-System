from pydantic import BaseModel, Field, validator, IPvAnyAddress
from typing import Optional, Dict, Any, List
from datetime import datetime
import uuid

from app.models.camera import CameraStatus, CameraType

class CameraBase(BaseModel):
    """Base camera schema"""
    name: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    camera_type: CameraType = CameraType.GENERAL_SURVEILLANCE
    location: str = Field(..., min_length=1, max_length=200)
    coordinates: Dict[str, float] = Field(..., description="Latitude and longitude")
    address: Optional[str] = Field(None, max_length=300)
    zone: Optional[str] = Field(None, max_length=100)

class CameraCreate(CameraBase):
    """Schema for creating cameras"""
    ip_address: str = Field(..., description="Camera IP address")
    port: int = Field(554, ge=1, le=65535, description="Camera port")
    rtsp_url: str = Field(..., description="RTSP stream URL")
    resolution: str = Field("1920x1080", pattern=r"^\d+x\d+$")
    fps: int = Field(30, ge=1, le=60)
    username: Optional[str] = Field(None, max_length=100)
    password: Optional[str] = Field(None, max_length=255)
    ai_enabled: bool = True
    recording_enabled: bool = True
    alert_enabled: bool = True
    detection_zones: Optional[List[Dict[str, Any]]] = None
    sensitivity_settings: Optional[Dict[str, Any]] = None
    notification_settings: Optional[Dict[str, Any]] = None
    
    @validator('coordinates')
    def validate_coordinates(cls, v):
        required_keys = {'latitude', 'longitude'}
        if not isinstance(v, dict) or not required_keys.issubset(v.keys()):
            raise ValueError('Coordinates must contain latitude and longitude')
        
        lat, lng = v['latitude'], v['longitude']
        if not (-90 <= lat <= 90):
            raise ValueError('Latitude must be between -90 and 90')
        if not (-180 <= lng <= 180):
            raise ValueError('Longitude must be between -180 and 180')
        
        return v

class CameraUpdate(BaseModel):
    """Schema for updating cameras"""
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    camera_type: Optional[CameraType] = None
    location: Optional[str] = Field(None, min_length=1, max_length=200)
    coordinates: Optional[Dict[str, float]] = None
    address: Optional[str] = Field(None, max_length=300)
    zone: Optional[str] = Field(None, max_length=100)
    status: Optional[CameraStatus] = None
    rtsp_url: Optional[str] = None
    resolution: Optional[str] = Field(None, pattern=r"^\d+x\d+$")
    fps: Optional[int] = Field(None, ge=1, le=60)
    ai_enabled: Optional[bool] = None
    recording_enabled: Optional[bool] = None
    alert_enabled: Optional[bool] = None
    detection_zones: Optional[List[Dict[str, Any]]] = None
    sensitivity_settings: Optional[Dict[str, Any]] = None
    notification_settings: Optional[Dict[str, Any]] = None
    
    @validator('coordinates')
    def validate_coordinates(cls, v):
        if v is not None:
            required_keys = {'latitude', 'longitude'}
            if not isinstance(v, dict) or not required_keys.issubset(v.keys()):
                raise ValueError('Coordinates must contain latitude and longitude')
            
            lat, lng = v['latitude'], v['longitude']
            if not (-90 <= lat <= 90):
                raise ValueError('Latitude must be between -90 and 90')
            if not (-180 <= lng <= 180):
                raise ValueError('Longitude must be between -180 and 180')
        
        return v

class CameraResponse(CameraBase):
    """Schema for camera responses"""
    id: uuid.UUID
    ip_address: str
    port: int
    rtsp_url: str
    resolution: str
    fps: int
    status: CameraStatus
    is_online: bool
    last_heartbeat: Optional[datetime] = None
    health_score: float
    ai_enabled: bool
    detection_zones: Optional[List[Dict[str, Any]]] = None
    sensitivity_settings: Dict[str, Any]
    recording_enabled: bool
    alert_enabled: bool
    notification_settings: Dict[str, Any]
    total_violations_detected: int
    uptime_percentage: float
    username: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class CameraFilter(BaseModel):
    """Schema for filtering cameras"""
    status: Optional[CameraStatus] = None
    camera_type: Optional[CameraType] = None
    location: Optional[str] = None
    zone: Optional[str] = None
    is_online: Optional[bool] = None
    ai_enabled: Optional[bool] = None

class CameraStats(BaseModel):
    """Schema for camera statistics"""
    total_cameras: int
    online_cameras: int
    offline_cameras: int
    cameras_by_status: Dict[str, int]
    cameras_by_type: Dict[str, int]
    ai_enabled_cameras: int
    average_uptime: float

class CameraBatch(BaseModel):
    """Schema for batch camera operations"""
    camera_ids: List[str]
    operation: str = Field(..., pattern="^(enable|disable|maintenance|activate_ai|deactivate_ai)$")
    
    @validator('camera_ids')
    def validate_camera_ids(cls, v):
        if len(v) == 0:
            raise ValueError("At least one camera ID is required")
        if len(v) > 50:
            raise ValueError("Maximum 50 cameras per batch")
        return v