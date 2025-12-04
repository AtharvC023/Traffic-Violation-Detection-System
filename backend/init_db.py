"""
Initial database setup and sample data creation
Run this script to initialize the database with sample data
"""

import asyncio
import sys
from pathlib import Path

# Add the parent directory to sys.path to import our modules
sys.path.append(str(Path(__file__).parent.parent))

from app.core.database import init_db, AsyncSessionLocal
from app.models import User, Camera, Violation, DailyAnalytics
from app.models.user import UserRole, UserStatus
from app.models.camera import CameraType, CameraStatus
from app.models.violation import ViolationType, ViolationSeverity, ViolationStatus
from app.core.auth import get_password_hash
from datetime import datetime, date
import uuid

async def create_sample_data():
    """Create sample data for development and testing"""
    
    async with AsyncSessionLocal() as db:
        try:
            # Create admin user
            admin_user = User(
                username="admin",
                email="admin@traffic-system.com",
                password_hash=get_password_hash("admin123"),
                full_name="System Administrator",
                role=UserRole.ADMIN,
                status=UserStatus.ACTIVE,
                is_superuser=True,
                is_verified=True,
                department="IT Department",
                badge_number="ADMIN001"
            )
            db.add(admin_user)
            
            # Create operator user
            operator_user = User(
                username="operator",
                email="operator@traffic-system.com",
                password_hash=get_password_hash("operator123"),
                full_name="Traffic Operator",
                role=UserRole.OPERATOR,
                status=UserStatus.ACTIVE,
                is_verified=True,
                department="Traffic Management",
                badge_number="OP001"
            )
            db.add(operator_user)
            
            # Create sample cameras
            cameras = [
                Camera(
                    name="Main Street Camera 1",
                    description="Traffic light intersection monitoring",
                    camera_type=CameraType.TRAFFIC_LIGHT,
                    location="Main Street & 1st Avenue",
                    coordinates={"latitude": 40.7128, "longitude": -74.0060},
                    address="123 Main Street, City, State 12345",
                    zone="Downtown",
                    ip_address="192.168.1.101",
                    port=554,
                    rtsp_url="rtsp://192.168.1.101:554/stream1",
                    resolution="1920x1080",
                    fps=30,
                    status=CameraStatus.ACTIVE,
                    is_online=True,
                    ai_enabled=True,
                    recording_enabled=True,
                    alert_enabled=True,
                    health_score=95.5,
                    uptime_percentage=98.2
                ),
                Camera(
                    name="Highway Speed Camera",
                    description="Speed monitoring on Highway 101",
                    camera_type=CameraType.SPEED,
                    location="Highway 101 Mile Marker 25",
                    coordinates={"latitude": 40.7589, "longitude": -73.9851},
                    address="Highway 101, Mile 25",
                    zone="Highway",
                    ip_address="192.168.1.102",
                    port=554,
                    rtsp_url="rtsp://192.168.1.102:554/stream1",
                    resolution="1920x1080",
                    fps=60,
                    status=CameraStatus.ACTIVE,
                    is_online=True,
                    ai_enabled=True,
                    recording_enabled=True,
                    alert_enabled=True,
                    health_score=92.1,
                    uptime_percentage=96.8
                ),
                Camera(
                    name="School Zone Camera",
                    description="School zone safety monitoring",
                    camera_type=CameraType.GENERAL_SURVEILLANCE,
                    location="Elementary School Main Entrance",
                    coordinates={"latitude": 40.7505, "longitude": -73.9934},
                    address="456 School Street, City, State 12345",
                    zone="School District",
                    ip_address="192.168.1.103",
                    port=554,
                    rtsp_url="rtsp://192.168.1.103:554/stream1",
                    status=CameraStatus.ACTIVE,
                    is_online=False,  # This one is offline for testing
                    ai_enabled=True,
                    health_score=0.0,
                    uptime_percentage=45.2
                )
            ]
            
            for camera in cameras:
                db.add(camera)
            
            await db.commit()
            
            # Get camera IDs for violations
            await db.refresh(cameras[0])
            await db.refresh(cameras[1])
            
            # Create sample violations
            violations = [
                Violation(
                    violation_type=ViolationType.RED_LIGHT,
                    severity=ViolationSeverity.HIGH,
                    status=ViolationStatus.CONFIRMED,
                    license_plate="ABC123",
                    vehicle_type="car",
                    vehicle_color="red",
                    camera_id=cameras[0].id,
                    location="Main Street & 1st Avenue",
                    coordinates={"latitude": 40.7128, "longitude": -74.0060},
                    detection_time=datetime.utcnow(),
                    confidence_score=0.95,
                    fine_amount=150.00,
                    penalty_points=3,
                    ai_analysis={
                        "detected_objects": ["car", "traffic_light"],
                        "violation_confidence": 0.95,
                        "scene_analysis": "Vehicle clearly ran red light"
                    }
                ),
                Violation(
                    violation_type=ViolationType.OVERSPEED,
                    severity=ViolationSeverity.MEDIUM,
                    status=ViolationStatus.UNDER_REVIEW,
                    license_plate="XYZ789",
                    vehicle_type="motorcycle",
                    vehicle_color="black",
                    camera_id=cameras[1].id,
                    location="Highway 101 Mile Marker 25",
                    coordinates={"latitude": 40.7589, "longitude": -73.9851},
                    detection_time=datetime.utcnow(),
                    confidence_score=0.88,
                    fine_amount=200.00,
                    penalty_points=2,
                    ai_analysis={
                        "detected_speed": 85,
                        "speed_limit": 65,
                        "violation_confidence": 0.88
                    }
                ),
                Violation(
                    violation_type=ViolationType.NO_HELMET,
                    severity=ViolationSeverity.MEDIUM,
                    status=ViolationStatus.DETECTED,
                    license_plate="BIKE456",
                    vehicle_type="motorcycle",
                    vehicle_color="blue",
                    camera_id=cameras[0].id,
                    location="Main Street & 1st Avenue",
                    detection_time=datetime.utcnow(),
                    confidence_score=0.92,
                    fine_amount=75.00,
                    penalty_points=1
                )
            ]
            
            for violation in violations:
                db.add(violation)
            
            # Create sample daily analytics
            today_analytics = DailyAnalytics(
                date=date.today(),
                total_violations=15,
                violations_by_type={
                    "red_light": 6,
                    "overspeed": 5,
                    "no_helmet": 3,
                    "parking": 1
                },
                violations_by_severity={
                    "low": 2,
                    "medium": 8,
                    "high": 4,
                    "critical": 1
                },
                violations_by_hour={
                    "8": 2, "9": 1, "12": 3, "17": 4, "18": 3, "19": 2
                },
                active_cameras=2,
                total_cameras=3,
                camera_uptime=85.5,
                processed_violations=12,
                pending_violations=3,
                confirmed_violations=10,
                dismissed_violations=2,
                average_detection_confidence=0.91,
                false_positive_rate=0.08,
                processing_time_avg=2.1,
                total_fines=1250.00,
                collected_fines=850.00,
                pending_fines=400.00
            )
            db.add(today_analytics)
            
            await db.commit()
            
            print("✅ Sample data created successfully!")
            print(f"Admin credentials: admin / admin123")
            print(f"Operator credentials: operator / operator123")
            print(f"Created {len(cameras)} cameras and {len(violations)} violations")
            
        except Exception as e:
            await db.rollback()
            print(f"❌ Error creating sample data: {e}")
            raise

async def main():
    """Main initialization function"""
    print("🚀 Initializing Traffic Violation Detection System database...")
    
    try:
        # Initialize database tables
        print("📝 Creating database tables...")
        await init_db()
        
        # Create sample data
        print("🏗️ Creating sample data...")
        await create_sample_data()
        
        print("✅ Database initialization completed successfully!")
        print("\n🎯 Next steps:")
        print("1. Start the backend server: uvicorn app.main:app --reload")
        print("2. Visit the API docs: http://localhost:8000/docs")
        print("3. Test WebSocket connections: ws://localhost:8000/ws/")
        
    except Exception as e:
        print(f"❌ Database initialization failed: {e}")
        raise

if __name__ == "__main__":
    asyncio.run(main())