from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from datetime import datetime, date
import uuid

class AnalyticsOverview(BaseModel):
    """Analytics overview schema"""
    period_days: int
    start_date: date
    end_date: date
    violation_stats: Dict[str, Any]
    camera_stats: Dict[str, Any]
    performance_metrics: "PerformanceMetrics"
    trends: "TrendAnalysis"

class DailyStats(BaseModel):
    """Daily statistics schema"""
    date: date
    total_violations: int
    violations_by_type: Dict[str, int]
    violations_by_severity: Dict[str, int]
    violations_by_hour: Dict[str, int]
    processed_violations: int
    pending_violations: int
    active_cameras: int
    average_detection_confidence: float
    total_fines: float

class LocationStats(BaseModel):
    """Location statistics schema"""
    location: str
    zone: Optional[str] = None
    camera_id: str
    violation_count: int
    violation_types: Dict[str, int]
    peak_hours: Dict[str, int]
    risk_score: float
    trend_analysis: Optional[Dict[str, Any]] = None
    recommendations: Optional[Dict[str, str]] = None
    detection_accuracy: float
    analysis_period_days: int

class SystemHealth(BaseModel):
    """System health schema"""
    timestamp: datetime
    camera_health: Dict[str, Any]
    processing_health: Dict[str, Any]
    system_metrics: Dict[str, float]
    overall_status: str

class TrendAnalysis(BaseModel):
    """Trend analysis schema"""
    violation_trend_percentage: float
    peak_hours: List[int]
    most_common_violation_type: str
    trend_direction: str

class PerformanceMetrics(BaseModel):
    """Performance metrics schema"""
    average_detection_confidence: float
    processing_accuracy_percentage: float
    false_positive_rate: float
    average_processing_time: float
    system_uptime_percentage: float
    violations_per_hour: float

# Update forward references
AnalyticsOverview.model_rebuild()