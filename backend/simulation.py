import requests
import time
import random
import datetime
import sys

API_URL = "http://localhost:8000"

def get_cameras():
    try:
        response = requests.get(f"{API_URL}/cameras/")
        if response.status_code == 200:
            return response.json()
    except Exception as e:
        print(f"Error fetching cameras: {e}")
    return []

def generate_violation(camera):
    types = [
        "Red Light", "Speeding", "No Helmet", "Wrong Way", "Illegal Turn", "Zebra Crossing"
    ]
    
    violation_type = random.choice(types)
    
    # Assign severity based on type
    if violation_type in ["Red Light", "Wrong Way"]:
        severity = "Critical"
    elif violation_type == "Speeding":
        severity = random.choice(["High", "Medium"])
    else:
        severity = random.choice(["Medium", "Low"])

    # Generate a unique ID based on timestamp
    timestamp = datetime.datetime.utcnow()
    vid = f"VIO-{int(timestamp.timestamp())}-{random.randint(100, 999)}"

    violation_data = {
        "id": vid,
        "timestamp": timestamp.isoformat(),
        "camera_id": camera['id'],
        "location": camera['location'],
        "violation_type": violation_type,
        "severity": severity,
        "status": "Open",
        "plate_number": f"{random.choice(['ABC', 'XYZ', 'KLM', 'PQR'])}-{random.randint(100, 999)}",
        "description": f"Detected {violation_type} violation at {camera['location']}",
        "evidence_url": "/media/demo.png"
    }
    
    return violation_data

def run_simulation():
    print(f"Starting Traffic Violation Simulation...")
    print(f"Target API: {API_URL}")
    
    # Check if requests is installed
    try:
        import requests
    except ImportError:
        print("Error: 'requests' library is missing. Please run: pip install requests")
        return

    while True:
        cameras = get_cameras()
        
        if not cameras:
            print("No cameras found. Please add cameras via the Dashboard first.")
            time.sleep(5)
            continue
            
        # Pick a random active camera
        active_cameras = [c for c in cameras if c['status'] == 'Active']
        
        if not active_cameras:
            print("No active cameras found.")
            time.sleep(5)
            continue
            
        camera = random.choice(active_cameras)
        violation = generate_violation(camera)
        
        try:
            response = requests.post(f"{API_URL}/violations/", json=violation)
            if response.status_code == 200:
                print(f"[{datetime.datetime.now().strftime('%H:%M:%S')}] Generated: {violation['violation_type']} at {violation['location']}")
            else:
                print(f"Failed to send violation: {response.text}")
        except Exception as e:
            print(f"Connection error: {e}")
            
        # Wait for random interval (5-15 seconds)
        sleep_time = random.randint(5, 15)
        time.sleep(sleep_time)

if __name__ == "__main__":
    try:
        run_simulation()
    except KeyboardInterrupt:
        print("\nSimulation stopped.")
