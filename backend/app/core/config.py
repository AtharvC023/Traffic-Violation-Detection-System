from pydantic_settings import BaseSettings
from typing import List, Optional
import os
from pathlib import Path

class Settings(BaseSettings):
    """Application settings"""
    
    # Project info
    PROJECT_NAME: str = "Traffic Violation Detection System"
    VERSION: str = "1.0.0"
    DESCRIPTION: str = "AI-powered traffic violation detection and management"
    
    # Environment
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    
    # Database
    DATABASE_URL: str = "postgresql://username:password@localhost:5432/traffic_violations"
    REDIS_URL: str = "redis://localhost:6379/0"
    
    # Security
    SECRET_KEY: str = "your-super-secret-jwt-key-here-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # CORS
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173"
    ]
    
    # AI API Configuration
    OPENAI_API_KEY: Optional[str] = None
    LLAMA_API_KEY: Optional[str] = None
    LLAMA_API_URL: str = "https://api.groq.com/openai/v1"
    
    # File Upload
    MAX_UPLOAD_SIZE: int = 10 * 1024 * 1024  # 10MB
    UPLOAD_FOLDER: str = "./uploads"
    ALLOWED_EXTENSIONS: List[str] = [".jpg", ".jpeg", ".png", ".mp4", ".avi", ".mov"]
    
    # Camera Settings
    DEFAULT_CAMERA_TIMEOUT: int = 30
    MAX_CONCURRENT_STREAMS: int = 10
    CAMERA_RESOLUTION: str = "1920x1080"
    
    # Background Tasks
    CELERY_BROKER_URL: str = "redis://localhost:6379/0"
    CELERY_RESULT_BACKEND: str = "redis://localhost:6379/0"
    
    # Logging
    LOG_LEVEL: str = "INFO"
    LOG_FILE: str = "./logs/app.log"
    
    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = 100
    
    # Pagination
    DEFAULT_PAGE_SIZE: int = 20
    MAX_PAGE_SIZE: int = 100
    
    # AI Processing
    VIOLATION_DETECTION_THRESHOLD: float = 0.8
    BATCH_PROCESSING_SIZE: int = 10
    AI_PROCESSING_TIMEOUT: int = 30
    
    # WebSocket
    WS_HEARTBEAT_INTERVAL: int = 30
    WS_MAX_CONNECTIONS: int = 100
    
    class Config:
        env_file = ".env"
        case_sensitive = True

# Create settings instance
settings = Settings()

# Ensure upload directory exists
Path(settings.UPLOAD_FOLDER).mkdir(parents=True, exist_ok=True)
Path("logs").mkdir(parents=True, exist_ok=True)