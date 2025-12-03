# Traffic Violation Detection System - Backend

This is the Python/FastAPI backend for the Traffic Violation Detection System.

## Setup

1. Create a virtual environment:
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Running the Server

Run the server using uvicorn:

```bash
uvicorn main:app --reload
```

The API will be available at http://localhost:8000.
API Documentation (Swagger UI) is available at http://localhost:8000/docs.
