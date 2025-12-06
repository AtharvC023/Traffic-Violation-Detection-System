# 🏗️ Project Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Traffic Violation                         │
│                   Detection System                           │
└─────────────────────────────────────────────────────────────┘
                            │
            ┌───────────────┴───────────────┐
            │                               │
    ┌───────▼────────┐            ┌────────▼─────────┐
    │   Frontend     │            │     Backend      │
    │   React App    │◄──────────►│   FastAPI App    │
    │  Port: 5173    │    HTTP    │   Port: 8000     │
    └────────────────┘   WebSocket└──────────────────┘
                                          │
                                   ┌──────▼──────┐
                                   │   SQLite    │
                                   │  Database   │
                                   └─────────────┘
```

## Directory Structure

```
Traffic-Violation-Detection-System/
│
├── 📱 frontend/                 # React Dashboard Application
│   ├── src/
│   │   ├── components/         # Reusable UI Components
│   │   │   ├── Sidebar.jsx
│   │   │   ├── TopNavbar.jsx
│   │   │   ├── StatCard.jsx
│   │   │   ├── ViolationsTable.jsx
│   │   │   ├── VideoPreviewPanel.jsx
│   │   │   ├── AnalyticsCharts.jsx
│   │   │   └── Login.jsx
│   │   │
│   │   ├── pages/             # Application Pages
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Violations.jsx
│   │   │   ├── Analytics.jsx
│   │   │   └── Cameras.jsx
│   │   │
│   │   ├── services/          # API Services
│   │   │   └── api.js
│   │   │
│   │   ├── data/              # Mock Data
│   │   │   └── mockData.js
│   │   │
│   │   ├── assets/            # Static Assets
│   │   ├── App.jsx            # Main Component
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx           # Entry Point
│   │
│   ├── public/                # Public Assets
│   ├── dist/                  # Build Output
│   ├── node_modules/          # Dependencies
│   │
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── eslint.config.js
│   ├── .gitignore
│   └── README.md
│
├── 🔧 backend/                # FastAPI Backend Server
│   ├── app/
│   │   ├── api/              # API Endpoints
│   │   │   └── v1/
│   │   │       ├── api.py
│   │   │       └── endpoints/
│   │   │           ├── auth.py
│   │   │           ├── violations.py
│   │   │           ├── analytics.py
│   │   │           ├── cameras.py
│   │   │           └── upload.py
│   │   │
│   │   ├── core/             # Core Configurations
│   │   │   ├── config.py
│   │   │   ├── database.py
│   │   │   └── auth.py
│   │   │
│   │   ├── models/           # Database Models
│   │   │   ├── __init__.py
│   │   │   ├── user.py
│   │   │   ├── violation.py
│   │   │   ├── camera.py
│   │   │   └── analytics.py
│   │   │
│   │   ├── schemas/          # Pydantic Schemas
│   │   │   ├── auth.py
│   │   │   ├── violation.py
│   │   │   ├── camera.py
│   │   │   └── analytics.py
│   │   │
│   │   ├── services/         # Business Logic
│   │   │   ├── violation_detection.py
│   │   │   ├── gpt4o_service.py
│   │   │   └── llama_service.py
│   │   │
│   │   ├── middleware/       # Middleware
│   │   │   ├── logging.py
│   │   │   └── rate_limit.py
│   │   │
│   │   ├── websocket/        # WebSocket
│   │   │   ├── manager.py
│   │   │   └── endpoints.py
│   │   │
│   │   └── main.py           # FastAPI App
│   │
│   ├── uploads/              # Uploaded Files
│   ├── logs/                 # Application Logs
│   │
│   ├── alembic.ini
│   ├── init_db.py
│   ├── start.py
│   ├── requirements.txt
│   └── README.md
│
├── 📚 Documentation
│   ├── README.md            # Main Documentation
│   ├── SETUP.md             # Setup Guide
│   └── ARCHITECTURE.md      # This File
│
├── 🚀 Scripts
│   ├── start.bat            # Windows Start Script
│   └── start.sh             # Linux/Mac Start Script
│
├── ⚙️ Configuration
│   ├── .vscode/
│   │   └── tasks.json
│   ├── .github/
│   │   └── copilot-instructions.md
│   ├── .gitignore
│   ├── .env
│   └── LICENSE
│
└── 💾 Database
    └── traffic_violations.db
```

## Component Architecture

### Frontend Stack

```
┌────────────────────────────────────────┐
│           React Application            │
├────────────────────────────────────────┤
│  Components                            │
│  ├── Sidebar (Navigation)             │
│  ├── TopNavbar (Search, Notifications)│
│  ├── StatCard (Metrics Display)       │
│  ├── ViolationsTable (Data Grid)      │
│  ├── VideoPreviewPanel (Live Feed)    │
│  ├── AnalyticsCharts (Visualizations) │
│  └── Login (Authentication)           │
├────────────────────────────────────────┤
│  Pages                                 │
│  ├── Dashboard (Overview)             │
│  ├── Violations (Management)          │
│  ├── Analytics (Insights)             │
│  └── Cameras (Monitoring)             │
├────────────────────────────────────────┤
│  Services                              │
│  └── API Service (HTTP Client)        │
├────────────────────────────────────────┤
│  Styling                               │
│  ├── Tailwind CSS                     │
│  └── Custom Glassmorphism             │
└────────────────────────────────────────┘
```

### Backend Stack

```
┌────────────────────────────────────────┐
│         FastAPI Application            │
├────────────────────────────────────────┤
│  API Layer (v1)                        │
│  ├── Authentication (/auth)           │
│  ├── Violations (/violations)         │
│  ├── Analytics (/analytics)           │
│  ├── Cameras (/cameras)               │
│  └── Upload (/upload)                 │
├────────────────────────────────────────┤
│  Business Logic                        │
│  ├── Violation Detection              │
│  ├── AI Integration (GPT-4o/Llama)   │
│  └── Analytics Processing             │
├────────────────────────────────────────┤
│  Data Layer                            │
│  ├── SQLAlchemy ORM                   │
│  ├── Database Models                  │
│  └── SQLite Database                  │
├────────────────────────────────────────┤
│  Security                              │
│  ├── JWT Authentication               │
│  ├── Password Hashing (bcrypt)       │
│  └── CORS Middleware                  │
├────────────────────────────────────────┤
│  Middleware                            │
│  ├── Request Logging                  │
│  └── Rate Limiting                    │
└────────────────────────────────────────┘
```

## Data Flow

### Authentication Flow

```
Frontend                Backend                Database
   │                       │                      │
   │  1. Login Request     │                      │
   ├──────────────────────►│                      │
   │  (username/password)  │                      │
   │                       │  2. Verify User      │
   │                       ├─────────────────────►│
   │                       │◄─────────────────────┤
   │                       │  3. User Data        │
   │                       │                      │
   │  4. JWT Token         │                      │
   │◄──────────────────────┤                      │
   │  (access_token)       │                      │
   │                       │                      │
   │  5. Store Token       │                      │
   │  (localStorage)       │                      │
   │                       │                      │
```

### Violation Data Flow

```
Frontend                Backend                Database
   │                       │                      │
   │  1. Get Violations    │                      │
   ├──────────────────────►│                      │
   │  + Auth Token         │                      │
   │                       │  2. Query Database   │
   │                       ├─────────────────────►│
   │                       │◄─────────────────────┤
   │                       │  3. Violation Data   │
   │                       │                      │
   │  4. JSON Response     │                      │
   │◄──────────────────────┤                      │
   │                       │                      │
   │  5. Render UI         │                      │
   │                       │                      │
```

### Real-time Updates (WebSocket)

```
Frontend                Backend                Camera/AI
   │                       │                      │
   │  1. WebSocket Connect │                      │
   ├──────────────────────►│                      │
   │                       │                      │
   │                       │  2. Violation Detected
   │                       │◄─────────────────────┤
   │                       │                      │
   │  3. Push Notification │                      │
   │◄──────────────────────┤                      │
   │                       │                      │
   │  4. Update UI         │                      │
   │  (Real-time)          │                      │
   │                       │                      │
```

## Technology Stack

### Frontend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.2+ | UI Framework |
| Vite | 7.2+ | Build Tool |
| Tailwind CSS | 3.4+ | Styling |
| Recharts | 3.5+ | Data Visualization |
| Lucide React | Latest | Icons |
| React Router DOM | 7.9+ | Routing |
| date-fns | 4.1+ | Date Handling |

### Backend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| FastAPI | 0.115+ | Web Framework |
| Python | 3.8+ | Programming Language |
| SQLAlchemy | 2.0+ | ORM |
| SQLite | Latest | Database |
| Uvicorn | Latest | ASGI Server |
| JWT | Latest | Authentication |
| Pydantic | Latest | Data Validation |

## API Endpoints

### Authentication
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/verify-token` - Verify JWT token

### Violations
- `GET /api/v1/violations/` - List violations
- `GET /api/v1/violations/{id}` - Get violation details
- `POST /api/v1/violations/` - Create violation
- `PUT /api/v1/violations/{id}` - Update violation
- `DELETE /api/v1/violations/{id}` - Delete violation

### Analytics
- `GET /api/v1/analytics/dashboard` - Dashboard statistics
- `GET /api/v1/analytics/charts` - Chart data
- `GET /api/v1/analytics/trends` - Trend analysis

### Cameras
- `GET /api/v1/cameras/` - List cameras
- `GET /api/v1/cameras/{id}` - Get camera details
- `POST /api/v1/cameras/` - Add camera
- `PUT /api/v1/cameras/{id}` - Update camera

### Upload
- `POST /api/v1/upload/image` - Upload image
- `POST /api/v1/upload/video` - Upload video

## Security Architecture

```
┌─────────────────────────────────────────┐
│           Security Layers               │
├─────────────────────────────────────────┤
│  1. CORS Protection                     │
│     - Allowed Origins                   │
│     - Credentials Support               │
├─────────────────────────────────────────┤
│  2. JWT Authentication                  │
│     - Token Generation                  │
│     - Token Verification                │
│     - Expiration Handling               │
├─────────────────────────────────────────┤
│  3. Password Security                   │
│     - bcrypt Hashing                    │
│     - Salt Rounds                       │
├─────────────────────────────────────────┤
│  4. Rate Limiting                       │
│     - Request Throttling                │
│     - IP-based Limits                   │
├─────────────────────────────────────────┤
│  5. Input Validation                    │
│     - Pydantic Schemas                  │
│     - Type Checking                     │
└─────────────────────────────────────────┘
```

## Database Schema

```sql
┌─────────────────┐
│     USERS       │
├─────────────────┤
│ id (PK)         │
│ username        │
│ email           │
│ password_hash   │
│ role            │
│ created_at      │
└─────────────────┘
        │
        │ 1:N
        ▼
┌─────────────────┐
│   VIOLATIONS    │
├─────────────────┤
│ id (PK)         │
│ camera_id (FK)  │
│ type            │
│ severity        │
│ status          │
│ location        │
│ timestamp       │
│ evidence_url    │
└─────────────────┘
        │
        │ N:1
        ▼
┌─────────────────┐
│    CAMERAS      │
├─────────────────┤
│ id (PK)         │
│ name            │
│ location        │
│ status          │
│ stream_url      │
└─────────────────┘
```

## Deployment Architecture

```
┌──────────────────────────────────────────┐
│         Production Deployment            │
└──────────────────────────────────────────┘
                   │
       ┌───────────┴───────────┐
       │                       │
┌──────▼────────┐    ┌─────────▼────────┐
│   Frontend    │    │     Backend      │
│   (Static)    │    │   (API Server)   │
│               │    │                  │
│  - Vercel     │    │  - AWS EC2       │
│  - Netlify    │    │  - Heroku        │
│  - S3+CF      │    │  - DigitalOcean  │
└───────────────┘    └──────────────────┘
                            │
                     ┌──────▼──────┐
                     │  Database   │
                     │  - SQLite   │
                     │  - PostgreSQL│
                     └─────────────┘
```

## Performance Optimizations

### Frontend
- Code splitting with Vite
- Lazy loading components
- Image optimization
- CSS purging with Tailwind
- Build-time optimization

### Backend
- Async request handling
- Database query optimization
- Connection pooling
- Response caching
- File upload streaming

## Monitoring & Logging

```
┌──────────────────────────────────────┐
│        Logging Architecture          │
├──────────────────────────────────────┤
│  Frontend                            │
│  ├── Browser Console                │
│  ├── Error Tracking                 │
│  └── Performance Metrics            │
├──────────────────────────────────────┤
│  Backend                             │
│  ├── Request Logging                │
│  ├── Error Logging                  │
│  ├── Performance Monitoring         │
│  └── Database Query Logs            │
└──────────────────────────────────────┘
```

## Future Enhancements

- [ ] Mobile application (React Native)
- [ ] Real-time AI detection integration
- [ ] Multi-camera support
- [ ] Advanced analytics dashboard
- [ ] Notification system (Email/SMS)
- [ ] Report generation (PDF)
- [ ] Geolocation mapping
- [ ] Integration with traffic management systems

---

**Last Updated**: December 6, 2025
