from fastapi import APIRouter
from app.api.v1.endpoints import violations, cameras, analytics, auth, upload

api_router = APIRouter()

# Include all endpoint routers
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(violations.router, prefix="/violations", tags=["Violations"])
api_router.include_router(cameras.router, prefix="/cameras", tags=["Cameras"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["Analytics"])
api_router.include_router(upload.router, prefix="/upload", tags=["File Upload"])