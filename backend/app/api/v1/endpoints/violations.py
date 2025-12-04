from fastapi import APIRouter, Depends, HTTPException, Query, Path, status
from fastapi.responses import JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_, or_
from typing import List, Optional, Dict, Any
from datetime import datetime, date
import uuid

from app.core.database import get_db
from app.models.violation import Violation, ViolationType, ViolationSeverity, ViolationStatus
from app.schemas.violation import (
    ViolationCreate, ViolationUpdate, ViolationResponse, 
    ViolationFilter, ViolationBatch, ViolationStats
)
from app.services.violation_detection import ViolationDetectionService
from app.core.auth import get_current_active_user
from app.models.user import User

router = APIRouter()

@router.get("/", response_model=List[ViolationResponse])
async def get_violations(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(20, ge=1, le=100, description="Number of records to return"),
    violation_type: Optional[ViolationType] = Query(None, description="Filter by violation type"),
    severity: Optional[ViolationSeverity] = Query(None, description="Filter by severity"),
    status: Optional[ViolationStatus] = Query(None, description="Filter by status"),
    camera_id: Optional[str] = Query(None, description="Filter by camera ID"),
    location: Optional[str] = Query(None, description="Filter by location"),
    start_date: Optional[date] = Query(None, description="Filter from this date"),
    end_date: Optional[date] = Query(None, description="Filter to this date"),
    search: Optional[str] = Query(None, description="Search in license plate, location, description"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Get paginated list of violations with optional filtering
    """
    try:
        # Build query
        query = select(Violation)
        
        # Apply filters
        conditions = []
        
        if violation_type:
            conditions.append(Violation.violation_type == violation_type)
        if severity:
            conditions.append(Violation.severity == severity)
        if status:
            conditions.append(Violation.status == status)
        if camera_id:
            conditions.append(Violation.camera_id == uuid.UUID(camera_id))
        if location:
            conditions.append(Violation.location.ilike(f"%{location}%"))
        if start_date:
            conditions.append(Violation.detection_time >= start_date)
        if end_date:
            conditions.append(Violation.detection_time <= end_date)
        if search:
            search_conditions = or_(
                Violation.license_plate.ilike(f"%{search}%"),
                Violation.location.ilike(f"%{search}%"),
                Violation.processing_notes.ilike(f"%{search}%")
            )
            conditions.append(search_conditions)
        
        if conditions:
            query = query.where(and_(*conditions))
        
        # Apply ordering and pagination
        query = query.order_by(Violation.detection_time.desc())
        query = query.offset(skip).limit(limit)
        
        # Execute query
        result = await db.execute(query)
        violations = result.scalars().all()
        
        return violations
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving violations: {str(e)}"
        )

@router.get("/stats", response_model=ViolationStats)
async def get_violation_stats(
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Get violation statistics and metrics
    """
    try:
        # Base query
        base_query = select(Violation)
        
        # Apply date filters
        conditions = []
        if start_date:
            conditions.append(Violation.detection_time >= start_date)
        if end_date:
            conditions.append(Violation.detection_time <= end_date)
        
        if conditions:
            base_query = base_query.where(and_(*conditions))
        
        # Get total count
        count_query = select(func.count(Violation.id)).select_from(base_query.subquery())
        total_result = await db.execute(count_query)
        total_violations = total_result.scalar()
        
        # Get counts by type
        type_query = select(
            Violation.violation_type,
            func.count(Violation.id).label('count')
        ).group_by(Violation.violation_type)
        
        if conditions:
            type_query = type_query.where(and_(*conditions))
        
        type_result = await db.execute(type_query)
        violations_by_type = {row.violation_type.value: row.count for row in type_result}
        
        # Get counts by severity
        severity_query = select(
            Violation.severity,
            func.count(Violation.id).label('count')
        ).group_by(Violation.severity)
        
        if conditions:
            severity_query = severity_query.where(and_(*conditions))
        
        severity_result = await db.execute(severity_query)
        violations_by_severity = {row.severity.value: row.count for row in severity_result}
        
        # Get counts by status
        status_query = select(
            Violation.status,
            func.count(Violation.id).label('count')
        ).group_by(Violation.status)
        
        if conditions:
            status_query = status_query.where(and_(*conditions))
        
        status_result = await db.execute(status_query)
        violations_by_status = {row.status.value: row.count for row in status_result}
        
        return ViolationStats(
            total_violations=total_violations,
            violations_by_type=violations_by_type,
            violations_by_severity=violations_by_severity,
            violations_by_status=violations_by_status
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving stats: {str(e)}"
        )

@router.get("/{violation_id}", response_model=ViolationResponse)
async def get_violation(
    violation_id: str = Path(..., description="Violation ID"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Get a specific violation by ID
    """
    try:
        query = select(Violation).where(Violation.id == uuid.UUID(violation_id))
        result = await db.execute(query)
        violation = result.scalar_one_or_none()
        
        if not violation:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Violation not found"
            )
        
        return violation
        
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid violation ID format"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving violation: {str(e)}"
        )

@router.post("/", response_model=ViolationResponse, status_code=status.HTTP_201_CREATED)
async def create_violation(
    violation: ViolationCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Create a new violation record
    """
    try:
        # Create violation instance
        db_violation = Violation(
            **violation.dict(),
            processed_by=current_user.id if current_user.can_process_violations else None
        )
        
        db.add(db_violation)
        await db.commit()
        await db.refresh(db_violation)
        
        return db_violation
        
    except Exception as e:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating violation: {str(e)}"
        )

@router.put("/{violation_id}", response_model=ViolationResponse)
async def update_violation(
    violation_id: str = Path(..., description="Violation ID"),
    violation_update: ViolationUpdate = ...,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Update an existing violation
    """
    try:
        # Check permissions
        if not current_user.can_process_violations:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions to update violations"
            )
        
        # Get existing violation
        query = select(Violation).where(Violation.id == uuid.UUID(violation_id))
        result = await db.execute(query)
        db_violation = result.scalar_one_or_none()
        
        if not db_violation:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Violation not found"
            )
        
        # Update fields
        update_data = violation_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_violation, field, value)
        
        # Set processor
        db_violation.processed_by = current_user.id
        
        await db.commit()
        await db.refresh(db_violation)
        
        return db_violation
        
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid violation ID format"
        )
    except Exception as e:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error updating violation: {str(e)}"
        )

@router.delete("/{violation_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_violation(
    violation_id: str = Path(..., description="Violation ID"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Delete a violation record
    """
    try:
        # Check permissions
        if not current_user.is_admin:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only administrators can delete violations"
            )
        
        # Get violation
        query = select(Violation).where(Violation.id == uuid.UUID(violation_id))
        result = await db.execute(query)
        db_violation = result.scalar_one_or_none()
        
        if not db_violation:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Violation not found"
            )
        
        await db.delete(db_violation)
        await db.commit()
        
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid violation ID format"
        )
    except Exception as e:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error deleting violation: {str(e)}"
        )

@router.post("/batch-process", response_model=Dict[str, Any])
async def batch_process_violations(
    batch: ViolationBatch,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Process multiple violations in batch
    """
    try:
        if not current_user.can_process_violations:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions to process violations"
            )
        
        results = {"processed": 0, "failed": 0, "errors": []}
        
        for violation_id in batch.violation_ids:
            try:
                query = select(Violation).where(Violation.id == uuid.UUID(violation_id))
                result = await db.execute(query)
                violation = result.scalar_one_or_none()
                
                if violation:
                    # Apply batch operation
                    if batch.operation == "confirm":
                        violation.status = ViolationStatus.CONFIRMED
                    elif batch.operation == "dismiss":
                        violation.status = ViolationStatus.DISMISSED
                    elif batch.operation == "review":
                        violation.status = ViolationStatus.UNDER_REVIEW
                    
                    violation.processed_by = current_user.id
                    results["processed"] += 1
                else:
                    results["failed"] += 1
                    results["errors"].append(f"Violation {violation_id} not found")
                    
            except Exception as e:
                results["failed"] += 1
                results["errors"].append(f"Error processing {violation_id}: {str(e)}")
        
        await db.commit()
        return results
        
    except Exception as e:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error in batch processing: {str(e)}"
        )

@router.post("/analyze-frame", response_model=Dict[str, Any])
async def analyze_frame(
    camera_id: str,
    frame_data: bytes,
    location: str,
    camera_type: str = "general",
    current_user: User = Depends(get_current_active_user)
):
    """
    Analyze a single frame for violations using AI
    """
    try:
        if not current_user.can_process_violations:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions to analyze violations"
            )
        
        async with ViolationDetectionService() as detector:
            results = await detector.process_frame(
                frame_data=frame_data,
                camera_id=camera_id,
                location=location,
                camera_type=camera_type
            )
        
        return results
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error analyzing frame: {str(e)}"
        )