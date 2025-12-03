from sqlalchemy import Column, Integer, String, DateTime, Enum, ForeignKey, Float
from sqlalchemy.orm import relationship
from database import Base
import datetime
import enum

class Severity(str, enum.Enum):
    CRITICAL = "Critical"
    HIGH = "High"
    MEDIUM = "Medium"
    LOW = "Low"

class Status(str, enum.Enum):
    OPEN = "Open"
    UNDER_REVIEW = "Under Review"
    CLOSED = "Closed"

class Violation(Base):
    __tablename__ = "violations"

    id = Column(String, primary_key=True, index=True) # e.g., VIO-001
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    camera_id = Column(String, index=True)
    location = Column(String)
    violation_type = Column(String) # Red Light, Speeding, etc.
    severity = Column(String) # Stored as string to match Enum
    status = Column(String, default=Status.OPEN.value)
    plate_number = Column(String, nullable=True)
    description = Column(String, nullable=True)
    evidence_url = Column(String, nullable=True) # Path to image/video

class Camera(Base):
    __tablename__ = "cameras"

    id = Column(String, primary_key=True, index=True)
    location = Column(String)
    status = Column(String, default="Active")
    resolution = Column(String, default="1920x1080")
