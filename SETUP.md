# 🚀 Quick Setup Guide

## Project Structure

The project has been reorganized into separate frontend and backend folders:

```
Traffic-Violation-Detection-System/
├── frontend/              # React + Vite application
│   ├── src/              # Source code
│   ├── public/           # Static assets
│   ├── package.json      # Node dependencies
│   └── vite.config.js    # Vite configuration
│
├── backend/              # FastAPI application
│   ├── app/             # Application code
│   ├── requirements.txt  # Python dependencies
│   └── start.py         # Backend startup script
│
├── start.bat            # Windows: Start both servers
├── start.sh             # Linux/Mac: Start both servers
└── README.md            # Main documentation
```

---

## 🎯 Quick Start

### Option 1: Using Start Script (Recommended)

**Windows:**
```bash
start.bat
```

**Linux/Mac:**
```bash
chmod +x start.sh
./start.sh
```

### Option 2: Manual Start

**Terminal 1 - Backend:**
```bash
cd backend
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --access-log
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Option 3: VS Code Tasks

1. Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac)
2. Type "Tasks: Run Task"
3. Select "Start Both Servers"

---

## 📋 Initial Setup (First Time Only)

### 1. Install Backend Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Initialize Database

```bash
cd backend
python init_db.py
```

### 3. Install Frontend Dependencies

```bash
cd frontend
npm install
```

---

## 🌐 Access Points

Once both servers are running:

- **Frontend Dashboard**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **Alternative API Docs**: http://localhost:8000/redoc

---

## 🔐 Login Credentials

### Admin Account (Full Access)
```
Username: admin
Password: admin123
```

### Operator Account (Limited Access)
```
Username: operator
Password: operator123
```

---

## 🛠️ Available VS Code Tasks

Access via `Ctrl+Shift+P` → "Tasks: Run Task":

1. **Start Both Servers** - Launch frontend and backend together
2. **Start Backend Server** - Backend only
3. **Start Frontend Development Server** - Frontend only
4. **Build Frontend** - Create production build
5. **Initialize Database** - Setup/reset database
6. **Install Frontend Dependencies** - npm install
7. **Install Backend Dependencies** - pip install

---

## 📁 Important Files

### Frontend
- `frontend/src/services/api.js` - API configuration
- `frontend/src/App.jsx` - Main app component
- `frontend/vite.config.js` - Build configuration
- `frontend/tailwind.config.js` - Styling configuration

### Backend
- `backend/app/main.py` - FastAPI application
- `backend/app/api/v1/api.py` - API routes
- `backend/app/core/config.py` - Configuration
- `backend/app/models/` - Database models

---

## 🔧 Common Commands

### Frontend (from `frontend/` directory)

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Backend (from `backend/` directory)

```bash
# Development server with auto-reload
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Production server
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000

# Initialize/reset database
python init_db.py
```

---

## 🐛 Troubleshooting

### Frontend won't start
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Backend won't start
```bash
cd backend
pip install --upgrade -r requirements.txt
python init_db.py
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### Port already in use
- Frontend: Change port in `frontend/vite.config.js`
- Backend: Use different port: `--port 8001`

### CORS errors
- Ensure backend is running on port 8000
- Check `backend/app/main.py` CORS configuration

### Database errors
```bash
cd backend
rm traffic_violations.db
python init_db.py
```

---

## 📚 Documentation

- **Frontend README**: `frontend/README.md`
- **Backend README**: `backend/README.md`
- **API Documentation**: http://localhost:8000/docs (when server is running)

---

## 🚀 Deployment

### Frontend (Static Hosting)
```bash
cd frontend
npm run build
# Deploy the 'dist' folder to:
# - Vercel
# - Netlify
# - AWS S3 + CloudFront
# - GitHub Pages
```

### Backend (Server Hosting)
```bash
cd backend
# Use production ASGI server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

---

## 💡 Tips

1. **Development**: Keep both servers running simultaneously
2. **Hot Reload**: Frontend has HMR (Hot Module Replacement)
3. **API Testing**: Use the built-in Swagger UI at `/docs`
4. **Database**: SQLite database is at `backend/traffic_violations.db`
5. **Logs**: Check terminal outputs for debugging

---

## 🤝 Need Help?

- Check the detailed READMEs in `frontend/` and `backend/` folders
- Review API documentation at http://localhost:8000/docs
- Check browser console for frontend errors
- Check terminal for backend errors

---

## ✅ Verification Checklist

- [ ] Python 3.8+ installed
- [ ] Node.js 18+ installed
- [ ] Backend dependencies installed
- [ ] Frontend dependencies installed
- [ ] Database initialized
- [ ] Backend server running on port 8000
- [ ] Frontend server running on port 5173
- [ ] Can access http://localhost:5173
- [ ] Can login with admin credentials

---

**🎉 You're all set! Happy coding!**
