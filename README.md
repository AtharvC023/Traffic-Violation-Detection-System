# Traffic Violation Detection System

A comprehensive traffic violation detection and management system with AI-powered detection, real-time monitoring, and a modern React dashboard.

## 🏗️ Project Structure

```
Traffic-Violation-Detection-System/
├── frontend/           # React dashboard application
│   ├── src/           # Source code
│   ├── public/        # Static assets
│   └── ...            # Configuration files
├── backend/           # FastAPI backend server
│   ├── app/           # Application code
│   │   ├── api/      # API endpoints
│   │   ├── models/   # Database models
│   │   ├── services/ # Business logic
│   │   └── ...       # Other modules
│   └── ...           # Configuration files
└── README.md         # This file
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v18 or higher)
- **Python** (v3.8 or higher)
- **pip** (Python package manager)
- **npm** or **yarn**

### 1. Setup Backend

```bash
cd backend
pip install -r requirements.txt
python init_db.py
python start.py
```

Backend will run on `http://localhost:8000`

### 2. Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend will run on `http://localhost:5174`

### 3. Access the Application

- **Dashboard**: http://localhost:5174
- **API Documentation**: http://localhost:8000/docs
- **Backend API**: http://localhost:8000/api/v1

## 🔐 Login Credentials

### Admin Account
- **Username**: `admin`
- **Password**: `admin123`

### Operator Account
- **Username**: `operator`
- **Password**: `operator123`

## 🎯 Features

### Frontend Dashboard
- **Modern UI** with glassmorphism design
- **Real-time Traffic Monitoring** with live camera feeds
- **Violations Management** with filtering and search
- **Advanced Analytics** with interactive charts
- **Responsive Design** for desktop and tablet
- **Dark Theme** with vibrant accents

### Backend API
- **FastAPI** with async support
- **JWT Authentication** for secure access
- **SQLAlchemy ORM** with SQLite database
- **WebSocket Support** for real-time updates
- **RESTful API** with OpenAPI documentation
- **AI Integration** for violation detection
- **File Upload** for video/image processing

### Dashboard Pages
1. **Main Dashboard** - Overview with stats, live feeds, and charts
2. **Violations Management** - CRUD operations with filtering
3. **Analytics** - Data visualization and insights
4. **Camera Management** - Monitor and configure cameras

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Recharts** - Data visualization
- **Lucide React** - Icons
- **React Router DOM** - Routing

### Backend
- **FastAPI** - Web framework
- **SQLAlchemy** - ORM
- **SQLite** - Database
- **JWT** - Authentication
- **Uvicorn** - ASGI server
- **Pydantic** - Data validation

## 🎨 Design System

### Color Palette
- **Primary**: Teal/Cyan shades (#14b8a6)
- **Accent Colors**: 
  - Purple (#8b5cf6)
  - Green (#10b981)
  - Yellow (#f59e0b)
  - Red (#ef4444)
- **Background**: Dark slate with glass overlays

### Typography
- **Font**: System fonts with fallbacks
- **Hierarchy**: Clear heading structure with responsive sizing
- **Readability**: High contrast ratios for accessibility

### Components
- **Glass Cards**: Semi-transparent cards with backdrop blur
- **Hover Effects**: Smooth transitions on interactive elements
- **Status Badges**: Color-coded severity and status indicators
- **Responsive Grid**: Flexible layouts for all screen sizes

## 🚦 Traffic Violation Types

The system supports detection and management of:
- Red Light violations
- Speed violations (Overspeed)
- Helmet violations (No Helmet)
- Lane violations (Wrong Way, Lane Violation)
- Parking violations
- Tailgating
- Crosswalk violations

Each violation includes:
- Unique ID and timestamp
- Location and camera information
- Severity level (Critical, High, Medium, Low)
- Status tracking (Open, Under Review, Closed)
- Evidence files (images/videos)
- Vehicle information

## 🔧 Getting Started

### Prerequisites
- Node.js (version 18 or higher)
- npm or yarn package manager

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

3. **Open in browser**
   Navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 📱 Responsive Design

The dashboard is fully responsive and optimized for:
- **Desktop**: Full-featured layout with sidebar navigation
- **Tablet**: Adapted layout with collapsible sidebar
- **Mobile**: Mobile-first approach with touch-friendly interfaces

### Breakpoints
- `sm`: 640px and up
- `md`: 768px and up
- `lg`: 1024px and up
- `xl`: 1280px and up

## 🔮 Future Enhancements

### Planned Features
- Real-time WebSocket connections for live updates
- Advanced AI-powered violation detection
- Integration with traffic management systems
- Mobile companion app
- Advanced reporting and export functionality
- Multi-language support
- Role-based access control

### Technical Improvements
- Performance optimization with lazy loading
- PWA capabilities for offline functionality
- Enhanced accessibility features
- Automated testing suite
- CI/CD pipeline integration

## 📊 Data Structure

### Violation Object
```javascript
{
  id: "VIO-001",
  time: "2024-12-01T10:30:00Z",
  camera: "CAM-North-01",
  location: "Main St & 5th Ave",
  type: "Red Light",
  severity: "Critical",
  status: "Open",
  plateNumber: "ABC-123",
  description: "Vehicle ran red light at intersection",
  evidence: "/evidence/vio-001.jpg"
}
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

---

**Built with ❤️ using React and Tailwind CSS**
