from fastapi import APIRouter, Depends, HTTPException, Query, Path, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_, or_
from typing import List, Optional, Dict, Any
from datetime import datetime
import uuid

from app.core.database import get_db
from app.models.camera import Camera, CameraStatus, CameraType
from app.schemas.camera import (
    CameraCreate, CameraUpdate, CameraResponse, 
    CameraFilter, CameraStats, CameraBatch
)
from app.core.auth import get_current_active_user, get_current_admin_user
from app.models.user import User

router = APIRouter()

@router.get("/", response_model=List[CameraResponse])
async def get_cameras(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(20, ge=1, le=100, description="Number of records to return"),
    status: Optional[CameraStatus] = Query(None, description="Filter by camera status"),
    camera_type: Optional[CameraType] = Query(None, description="Filter by camera type"),
    location: Optional[str] = Query(None, description="Filter by location"),
    zone: Optional[str] = Query(None, description="Filter by zone"),
    is_online: Optional[bool] = Query(None, description="Filter by online status"),
    ai_enabled: Optional[bool] = Query(None, description="Filter by AI enabled status"),
    search: Optional[str] = Query(None, description="Search in name, location, IP address"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Get paginated list of cameras with optional filtering
    """
    try:
        # Build query
        query = select(Camera)
        
        # Apply filters
        conditions = []
        
        if status:
            conditions.append(Camera.status == status)
        if camera_type:
            conditions.append(Camera.camera_type == camera_type)
        if location:
            conditions.append(Camera.location.ilike(f"%{location}%"))
        if zone:
            conditions.append(Camera.zone.ilike(f"%{zone}%"))
        if is_online is not None:
            conditions.append(Camera.is_online == is_online)
        if ai_enabled is not None:
            conditions.append(Camera.ai_enabled == ai_enabled)
        if search:
            search_conditions = or_(
                Camera.name.ilike(f"%{search}%"),
                Camera.location.ilike(f"%{search}%"),
                Camera.ip_address.ilike(f"%{search}%"),
                Camera.address.ilike(f"%{search}%")
            )
            conditions.append(search_conditions)
        
        if conditions:
            query = query.where(and_(*conditions))
        
        # Apply ordering and pagination
        query = query.order_by(Camera.name)
        query = query.offset(skip).limit(limit)
        
        # Execute query
        result = await db.execute(query)
        cameras = result.scalars().all()
        
        return cameras
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving cameras: {str(e)}"
        )

@router.get("/stats", response_model=CameraStats)
async def get_camera_stats(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Get camera statistics and metrics
    """
    try:
        # Get total count
        total_query = select(func.count(Camera.id))
        total_result = await db.execute(total_query)
        total_cameras = total_result.scalar()
        
        # Get online count
        online_query = select(func.count(Camera.id)).where(Camera.is_online == True)
        online_result = await db.execute(online_query)
        online_cameras = online_result.scalar()
        
        # Get counts by status
        status_query = select(
            Camera.status,
            func.count(Camera.id).label('count')
        ).group_by(Camera.status)
        
        status_result = await db.execute(status_query)
        cameras_by_status = {row.status.value: row.count for row in status_result}
        
        # Get counts by type
        type_query = select(
            Camera.camera_type,
            func.count(Camera.id).label('count')
        ).group_by(Camera.camera_type)
        
        type_result = await db.execute(type_query)
        cameras_by_type = {row.camera_type.value: row.count for row in type_result}
        
        # Get AI enabled count
        ai_query = select(func.count(Camera.id)).where(Camera.ai_enabled == True)
        ai_result = await db.execute(ai_query)
        ai_enabled = ai_result.scalar()
        
        # Calculate uptime
        uptime_query = select(func.avg(Camera.uptime_percentage))
        uptime_result = await db.execute(uptime_query)
        avg_uptime = uptime_result.scalar() or 0.0
        
        return CameraStats(
            total_cameras=total_cameras,
            online_cameras=online_cameras,
            offline_cameras=total_cameras - online_cameras,
            cameras_by_status=cameras_by_status,
            cameras_by_type=cameras_by_type,
            ai_enabled_cameras=ai_enabled,
            average_uptime=round(avg_uptime, 2)
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving camera stats: {str(e)}"
        )

@router.get("/{camera_id}", response_model=CameraResponse)
async def get_camera(
    camera_id: str = Path(..., description="Camera ID"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Get a specific camera by ID
    """
    try:
        query = select(Camera).where(Camera.id == uuid.UUID(camera_id))
        result = await db.execute(query)
        camera = result.scalar_one_or_none()
        
        if not camera:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Camera not found"
            )
        
        return camera
        
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid camera ID format"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving camera: {str(e)}"
        )

@router.post("/", response_model=CameraResponse, status_code=status.HTTP_201_CREATED)
async def create_camera(
    camera: CameraCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """
    Create a new camera (admin only)
    """
    try:
        # Check if IP address already exists
        existing_query = select(Camera).where(Camera.ip_address == camera.ip_address)
        existing_result = await db.execute(existing_query)
        existing_camera = existing_result.scalar_one_or_none()
        
        if existing_camera:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Camera with this IP address already exists"
            )
        
        # Create camera instance
        db_camera = Camera(**camera.dict())
        
        db.add(db_camera)
        await db.commit()
        await db.refresh(db_camera)
        
        return db_camera
        
    except HTTPException:
        raise
    except Exception as e:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating camera: {str(e)}"
        )

@router.put("/{camera_id}", response_model=CameraResponse)
async def update_camera(
    camera_id: str = Path(..., description="Camera ID"),
    camera_update: CameraUpdate = ...,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """
    Update an existing camera (admin only)
    """
    try:
        # Get existing camera
        query = select(Camera).where(Camera.id == uuid.UUID(camera_id))
        result = await db.execute(query)
        db_camera = result.scalar_one_or_none()
        
        if not db_camera:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Camera not found"
            )
        
        # Update fields
        update_data = camera_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_camera, field, value)
        
        await db.commit()
        await db.refresh(db_camera)
        
        return db_camera
        
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid camera ID format"
        )
    except HTTPException:
        raise
    except Exception as e:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error updating camera: {str(e)}"
        )

@router.delete("/{camera_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_camera(
    camera_id: str = Path(..., description="Camera ID"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """
    Delete a camera (admin only)
    """
    try:
        # Get camera
        query = select(Camera).where(Camera.id == uuid.UUID(camera_id))
        result = await db.execute(query)
        db_camera = result.scalar_one_or_none()
        
        if not db_camera:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Camera not found"
            )
        
        await db.delete(db_camera)
        await db.commit()
        
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid camera ID format"
        )
    except Exception as e:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error deleting camera: {str(e)}"
        )

@router.post("/{camera_id}/test-connection")
async def test_camera_connection(
    camera_id: str = Path(..., description="Camera ID"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """
    Test camera connection and update status
    """
    try:
        # Get camera
        query = select(Camera).where(Camera.id == uuid.UUID(camera_id))
        result = await db.execute(query)
        camera = result.scalar_one_or_none()
        
        if not camera:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Camera not found"
            )
        
        # TODO: Implement actual camera connection test
        # This is a placeholder for camera connectivity testing
        connection_success = True  # Replace with actual test
        
        # Update camera status based on test result
        if connection_success:
            camera.is_online = True
            camera.status = CameraStatus.ACTIVE
            camera.last_heartbeat = datetime.utcnow()
        else:
            camera.is_online = False
            camera.status = CameraStatus.ERROR
        
        await db.commit()
        
        return {
            "camera_id": str(camera.id),
            "connection_status": "online" if connection_success else "offline",
            "test_timestamp": datetime.utcnow().isoformat()
        }
        
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid camera ID format"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error testing camera connection: {str(e)}"
        )

@router.post("/batch-operation", response_model=Dict[str, Any])
async def batch_camera_operation(
    batch: CameraBatch,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """
    Perform batch operations on cameras (admin only)
    """
    try:
        results = {"processed": 0, "failed": 0, "errors": []}
        
        for camera_id in batch.camera_ids:
            try:
                query = select(Camera).where(Camera.id == uuid.UUID(camera_id))
                result = await db.execute(query)
                camera = result.scalar_one_or_none()
                
                if camera:
                    # Apply batch operation
                    if batch.operation == "enable":
                        camera.status = CameraStatus.ACTIVE
                        camera.ai_enabled = True
                    elif batch.operation == "disable":
                        camera.status = CameraStatus.INACTIVE
                        camera.ai_enabled = False
                    elif batch.operation == "maintenance":
                        camera.status = CameraStatus.MAINTENANCE
                    elif batch.operation == "activate_ai":
                        camera.ai_enabled = True
                    elif batch.operation == "deactivate_ai":
                        camera.ai_enabled = False
                    
                    results["processed"] += 1
                else:
                    results["failed"] += 1
                    results["errors"].append(f"Camera {camera_id} not found")
                    
            except Exception as e:
                results["failed"] += 1
                results["errors"].append(f"Error processing {camera_id}: {str(e)}")
        
        await db.commit()
        return results
        
    except Exception as e:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error in batch operation: {str(e)}"
        )