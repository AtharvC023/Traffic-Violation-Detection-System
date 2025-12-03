from .database import SessionLocal, engine
from . import models
import datetime
import random

# Create tables
models.Base.metadata.create_all(bind=engine)

db = SessionLocal()

print("Cleaning up old data...")
db.query(models.Violation).delete()
db.commit()

print("Seeding database with demo data...")

cameras = [
    "CAM-North-01", "CAM-South-02", "CAM-East-03", "CAM-West-04", 
    "CAM-Central-05", "CAM-Highway-06"
]

locations = [
    "Main St & 5th Ave", "Highway 101 Mile 15", "Downtown Plaza", 
    "Park Ave & Oak St", "School Zone - Elm St", "Market St Intersection"
]

types = [
    "Red Light", "Speeding", "No Helmet", "Wrong Way", "Illegal Turn", "Zebra Crossing"
]

severities = ["Critical", "High", "Medium", "Low"]
statuses = ["Open", "Under Review", "Closed"]

# Generate 50 violations over the last 30 days
violations = []
end_date = datetime.datetime.utcnow()
start_date = end_date - datetime.timedelta(days=30)

for i in range(50):
    # Random timestamp between start_date and end_date
    random_seconds = random.randint(0, int((end_date - start_date).total_seconds()))
    timestamp = start_date + datetime.timedelta(seconds=random_seconds)
    
    violation_type = random.choice(types)
    
    # Assign severity based on type for some realism
    if violation_type in ["Red Light", "Wrong Way"]:
        severity = "Critical"
    elif violation_type == "Speeding":
        severity = random.choice(["High", "Medium"])
    else:
        severity = random.choice(["Medium", "Low"])

    v = {
        "id": f"VIO-{1000 + i}",
        "timestamp": timestamp,
        "camera_id": random.choice(cameras),
        "location": random.choice(locations),
        "violation_type": violation_type,
        "severity": severity,
        "status": random.choice(statuses),
        "plate_number": f"{random.choice(['ABC', 'XYZ', 'KLM', 'PQR'])}-{random.randint(100, 999)}",
        "description": f"Detected {violation_type} violation",
        "evidence_url": "/media/demo.png" # Pointing to our demo image
    }
    violations.append(v)

# Add some specifically for "Today" to ensure dashboard stats look good
today = datetime.datetime.utcnow().date()
for i in range(5):
    v = {
        "id": f"VIO-{2000 + i}",
        "timestamp": datetime.datetime.utcnow(), # Now
        "camera_id": random.choice(cameras),
        "location": random.choice(locations),
        "violation_type": random.choice(types),
        "severity": random.choice(severities),
        "status": "Open",
        "plate_number": f"NEW-{random.randint(100, 999)}",
        "description": "Just occurred",
        "evidence_url": "/media/demo.png"
    }
    violations.append(v)

for v in violations:
    db_violation = models.Violation(**v)
    db.add(db_violation)

# Ensure some cameras are active
# We don't have a Camera model seed here, let's add some if they don't exist
if db.query(models.Camera).count() == 0:
    for cam_id in cameras:
        cam = models.Camera(
            id=cam_id,
            location=random.choice(locations),
            status="Active",
            resolution="1920x1080"
        )
        db.add(cam)

db.commit()
print(f"Database seeded successfully with {len(violations)} violations!")

db.close()
