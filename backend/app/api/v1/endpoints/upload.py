from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Query, status
from fastapi.responses import JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional, Dict, Any
from datetime import datetime
import os
import uuid
import aiofiles
from pathlib import Path
import mimetypes

from app.core.database import get_db
from app.core.config import settings
from app.core.auth import get_current_active_user
from app.models.user import User
from app.services.violation_detection import ViolationDetectionService

router = APIRouter()

@router.post("/image")
async def upload_image(
    file: UploadFile = File(..., description="Image file to upload"),
    camera_id: Optional[str] = Form(None, description="Camera ID"),
    location: Optional[str] = Form(None, description="Location"),
    analyze: bool = Form(False, description="Run AI analysis on upload"),
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Upload an image file and optionally run AI analysis
    """
    try:
        # Validate file type
        if not file.content_type or not file.content_type.startswith('image/'):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="File must be an image"
            )
        
        # Check file size
        file_content = await file.read()
        if len(file_content) > settings.MAX_UPLOAD_SIZE:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"File size exceeds maximum allowed size of {settings.MAX_UPLOAD_SIZE} bytes"
            )
        
        # Generate unique filename
        file_extension = Path(file.filename).suffix.lower()
        if file_extension not in settings.ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"File extension {file_extension} not allowed"
            )
        
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        file_path = Path(settings.UPLOAD_FOLDER) / "images" / unique_filename
        
        # Create directory if it doesn't exist
        file_path.parent.mkdir(parents=True, exist_ok=True)
        
        # Save file
        async with aiofiles.open(file_path, 'wb') as f:
            await f.write(file_content)
        
        response_data = {
            "filename": unique_filename,
            "original_filename": file.filename,
            "file_path": str(file_path),
            "file_size": len(file_content),
            "content_type": file.content_type,
            "upload_timestamp": datetime.utcnow().isoformat()
        }
        
        # Run AI analysis if requested
        if analyze and camera_id and location:
            try:
                async with ViolationDetectionService() as detector:
                    analysis_results = await detector.process_frame(
                        frame_data=file_content,
                        camera_id=camera_id,
                        location=location
                    )
                response_data["ai_analysis"] = analysis_results
            except Exception as e:
                response_data["analysis_error"] = f"AI analysis failed: {str(e)}"
        
        return JSONResponse(
            status_code=status.HTTP_201_CREATED,
            content=response_data
        )
        
    except HTTPException:
        raise
    except Exception as e:
        # Clean up file if something went wrong
        if 'file_path' in locals() and file_path.exists():
            file_path.unlink()
        
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Upload failed: {str(e)}"
        )

@router.post("/video")
async def upload_video(
    file: UploadFile = File(..., description="Video file to upload"),
    camera_id: Optional[str] = Form(None, description="Camera ID"),
    location: Optional[str] = Form(None, description="Location"),
    current_user: User = Depends(get_current_active_user)
):
    """
    Upload a video file
    """
    try:
        # Validate file type
        if not file.content_type or not file.content_type.startswith('video/'):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="File must be a video"
            )
        
        # Check file size
        file_content = await file.read()
        if len(file_content) > settings.MAX_UPLOAD_SIZE * 5:  # Allow larger videos
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"File size exceeds maximum allowed size"
            )
        
        # Generate unique filename
        file_extension = Path(file.filename).suffix.lower()
        if file_extension not in ['.mp4', '.avi', '.mov', '.mkv']:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Video format {file_extension} not supported"
            )
        
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        file_path = Path(settings.UPLOAD_FOLDER) / "videos" / unique_filename
        
        # Create directory if it doesn't exist
        file_path.parent.mkdir(parents=True, exist_ok=True)
        
        # Save file
        async with aiofiles.open(file_path, 'wb') as f:
            await f.write(file_content)
        
        return JSONResponse(
            status_code=status.HTTP_201_CREATED,
            content={
                "filename": unique_filename,
                "original_filename": file.filename,
                "file_path": str(file_path),
                "file_size": len(file_content),
                "content_type": file.content_type,
                "upload_timestamp": datetime.utcnow().isoformat()
            }
        )
        
    except HTTPException:
        raise
    except Exception as e:
        # Clean up file if something went wrong
        if 'file_path' in locals() and file_path.exists():
            file_path.unlink()
        
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Upload failed: {str(e)}"
        )

@router.post("/batch")
async def upload_batch(
    files: List[UploadFile] = File(..., description="Multiple files to upload"),
    camera_id: Optional[str] = Form(None),
    location: Optional[str] = Form(None),
    current_user: User = Depends(get_current_active_user)
):
    """
    Upload multiple files in batch
    """
    try:
        if len(files) > 20:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Maximum 20 files per batch upload"
            )
        
        results = []
        total_size = 0
        
        for file in files:
            try:
                # Basic validation
                if not file.filename:
                    results.append({
                        "filename": "unknown",
                        "status": "error",
                        "error": "No filename provided"
                    })
                    continue
                
                file_content = await file.read()
                file_size = len(file_content)
                total_size += file_size
                
                # Check total batch size
                if total_size > settings.MAX_UPLOAD_SIZE * 10:
                    results.append({
                        "filename": file.filename,
                        "status": "error",
                        "error": "Batch size limit exceeded"
                    })
                    continue
                
                # Determine file type and path
                file_extension = Path(file.filename).suffix.lower()
                is_image = file.content_type and file.content_type.startswith('image/')
                is_video = file.content_type and file.content_type.startswith('video/')
                
                if not (is_image or is_video):
                    results.append({
                        "filename": file.filename,
                        "status": "error",
                        "error": "File must be image or video"
                    })
                    continue
                
                # Generate unique filename and path
                unique_filename = f"{uuid.uuid4()}{file_extension}"
                subfolder = "images" if is_image else "videos"
                file_path = Path(settings.UPLOAD_FOLDER) / subfolder / unique_filename
                
                # Create directory
                file_path.parent.mkdir(parents=True, exist_ok=True)
                
                # Save file
                async with aiofiles.open(file_path, 'wb') as f:
                    await f.write(file_content)
                
                results.append({
                    "filename": unique_filename,
                    "original_filename": file.filename,
                    "file_path": str(file_path),
                    "file_size": file_size,
                    "content_type": file.content_type,
                    "status": "success"
                })
                
            except Exception as e:
                results.append({
                    "filename": file.filename if file.filename else "unknown",
                    "status": "error",
                    "error": str(e)
                })
        
        successful_uploads = len([r for r in results if r["status"] == "success"])
        
        return JSONResponse(
            status_code=status.HTTP_201_CREATED,
            content={
                "total_files": len(files),
                "successful_uploads": successful_uploads,
                "failed_uploads": len(files) - successful_uploads,
                "total_size": total_size,
                "results": results,
                "upload_timestamp": datetime.utcnow().isoformat()
            }
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Batch upload failed: {str(e)}"
        )

@router.delete("/file/{filename}")
async def delete_file(
    filename: str,
    file_type: str = Query("image", regex="^(image|video)$"),
    current_user: User = Depends(get_current_active_user)
):
    """
    Delete an uploaded file
    """
    try:
        # Check permissions
        if not current_user.can_manage_cameras:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions to delete files"
            )
        
        # Construct file path
        subfolder = "images" if file_type == "image" else "videos"
        file_path = Path(settings.UPLOAD_FOLDER) / subfolder / filename
        
        # Check if file exists
        if not file_path.exists():
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="File not found"
            )
        
        # Delete file
        file_path.unlink()
        
        return {"message": f"File {filename} deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"File deletion failed: {str(e)}"
        )

@router.get("/analyze-image/{filename}")
async def analyze_uploaded_image(
    filename: str,
    camera_id: str,
    location: str,
    current_user: User = Depends(get_current_active_user)
):
    """
    Analyze a previously uploaded image
    """
    try:
        if not current_user.can_process_violations:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions to analyze violations"
            )
        
        # Find image file
        file_path = Path(settings.UPLOAD_FOLDER) / "images" / filename
        
        if not file_path.exists():
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Image file not found"
            )
        
        # Read file content
        async with aiofiles.open(file_path, 'rb') as f:
            file_content = await f.read()
        
        # Run AI analysis
        async with ViolationDetectionService() as detector:
            results = await detector.process_frame(
                frame_data=file_content,
                camera_id=camera_id,
                location=location
            )
        
        return results
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Analysis failed: {str(e)}"
        )