# Traffic Violation Detection System - Backend

## Overview
Advanced FastAPI backend with AI-powered traffic violation detection using Llama 4 Maverick and GPT-4o.

## Features
- Real-time traffic violation detection
- AI-powered image analysis
- WebSocket for live feeds
- Advanced analytics and reporting
- JWT authentication
- Database management with PostgreSQL

## Setup

### Prerequisites
- Python 3.9+
- PostgreSQL 14+
- Redis (for caching)

### Installation
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
```

### Environment Setup
Create `.env` file with required configurations (see .env.example)

### Database Setup
```bash
alembic upgrade head
```

### Run Development Server
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## API Endpoints
- `/api/v1/violations/` - Violation management
- `/api/v1/cameras/` - Camera management
- `/api/v1/analytics/` - Analytics and reports
- `/api/v1/auth/` - Authentication
- `/ws/live-feed` - WebSocket for live feeds

## AI Integration
- Llama 4 Maverick for advanced scene analysis
- GPT-4o for violation classification and reporting
- Custom computer vision pipeline

## Documentation
API documentation available at: http://localhost:8000/docs