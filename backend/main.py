from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from typing import List
import models, schemas, database

# Create tables
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="Traffic Violation Detection API")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], # Vite default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount media directory
app.mount("/media", StaticFiles(directory="media"), name="media")

@app.get("/")
def read_root():
    return {"message": "Traffic Violation Detection System API is running"}

# Dependency
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/violations/", response_model=List[schemas.Violation])
def read_violations(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    violations = db.query(models.Violation).offset(skip).limit(limit).all()
    return violations

@app.post("/violations/", response_model=schemas.Violation)
def create_violation(violation: schemas.ViolationCreate, db: Session = Depends(get_db)):
    db_violation = models.Violation(**violation.dict())
    db.add(db_violation)
    db.commit()
    db.refresh(db_violation)
    return db_violation

@app.get("/stats/dashboard")
def get_dashboard_stats(db: Session = Depends(get_db)):
    from sqlalchemy import func
    from datetime import datetime, timedelta
    
    today = datetime.utcnow().date()
    
    total_violations_today = db.query(models.Violation).filter(
        func.date(models.Violation.timestamp) == today
    ).count()
    
    critical_violations = db.query(models.Violation).filter(
        models.Violation.severity == models.Severity.CRITICAL
    ).count()
    
    active_cameras = db.query(models.Camera).filter(
        models.Camera.status == "Active"
    ).count()
    
    pending_actions = db.query(models.Violation).filter(
        models.Violation.status.in_([models.Status.OPEN, models.Status.UNDER_REVIEW])
    ).count()
    
    return {
        "totalViolationsToday": total_violations_today,
        "criticalViolations": critical_violations,
        "activeCameras": active_cameras,
        "pendingActions": pending_actions
    }

@app.get("/stats/charts")
def get_chart_data(db: Session = Depends(get_db)):
    from sqlalchemy import func
    from datetime import datetime, timedelta
    
    # Violations by Day (Last 7 days)
    end_date = datetime.utcnow()
    start_date = end_date - timedelta(days=6)
    
    violations_by_day = db.query(
        func.date(models.Violation.timestamp).label('date'),
        func.count(models.Violation.id).label('count')
    ).filter(
        models.Violation.timestamp >= start_date
    ).group_by(
        func.date(models.Violation.timestamp)
    ).all()
    
    # Format for frontend: { name: "Mon", violations: 12 }
    formatted_by_day = []
    # Create a map for easy lookup
    data_map = {str(d.date): d.count for d in violations_by_day}
    
    for i in range(7):
        date = start_date + timedelta(days=i)
        date_str = str(date.date())
        day_name = date.strftime("%a") # Mon, Tue, etc.
        count = data_map.get(date_str, 0)
        formatted_by_day.append({"name": day_name, "violations": count})

    # Violations by Type
    violations_by_type = db.query(
        models.Violation.violation_type,
        func.count(models.Violation.id).label('count')
    ).group_by(
        models.Violation.violation_type
    ).all()
    
    formatted_by_type = [
        {"name": v.violation_type, "value": v.count} for v in violations_by_type
    ]
    
    return {
        "violationsByDay": formatted_by_day,
        "violationsByType": formatted_by_type
    }

@app.get("/stats/analytics")
def get_analytics_data(db: Session = Depends(get_db)):
    from sqlalchemy import func, desc
    
    # Top Risk Locations (Top 5 by violation count)
    top_locations = db.query(
        models.Violation.location,
        func.count(models.Violation.id).label('count')
    ).group_by(
        models.Violation.location
    ).order_by(
        desc('count')
    ).limit(5).all()
    
    formatted_top_locations = [
        {
            "name": loc.location, 
            "area": "Downtown", # Placeholder as we don't have area in DB
            "avgDailyViolations": round(loc.count / 30, 1), # Approx avg
            "suggestion": "Increase patrol" # Placeholder
        } 
        for loc in top_locations
    ]
    
    # Violations by Location (All)
    violations_by_location = db.query(
        models.Violation.location,
        func.count(models.Violation.id).label('count')
    ).group_by(
        models.Violation.location
    ).all()
    
    formatted_by_location = [
        {"name": v.location, "value": v.count} for v in violations_by_location
    ]
    
    return {
        "topRiskLocations": formatted_top_locations,
        "violationsByLocation": formatted_by_location
    }

# Camera Management Endpoints

@app.get("/cameras/", response_model=List[schemas.Camera])
def read_cameras(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    cameras = db.query(models.Camera).offset(skip).limit(limit).all()
    return cameras

@app.post("/cameras/", response_model=schemas.Camera)
def create_camera(camera: schemas.CameraCreate, db: Session = Depends(get_db)):
    db_camera = models.Camera(**camera.dict())
    db.add(db_camera)
    db.commit()
    db.refresh(db_camera)
    return db_camera

@app.put("/cameras/{camera_id}", response_model=schemas.Camera)
def update_camera(camera_id: str, camera: schemas.CameraBase, db: Session = Depends(get_db)):
    db_camera = db.query(models.Camera).filter(models.Camera.id == camera_id).first()
    if not db_camera:
        raise HTTPException(status_code=404, detail="Camera not found")
    
    db_camera.location = camera.location
    db_camera.status = camera.status
    db_camera.resolution = camera.resolution
    
    db.commit()
    db.refresh(db_camera)
    return db_camera

@app.delete("/cameras/{camera_id}")
def delete_camera(camera_id: str, db: Session = Depends(get_db)):
    db_camera = db.query(models.Camera).filter(models.Camera.id == camera_id).first()
    if not db_camera:
        raise HTTPException(status_code=404, detail="Camera not found")
    
    db.delete(db_camera)
    db.commit()
    return {"message": "Camera deleted successfully"}
