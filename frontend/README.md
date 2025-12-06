# Traffic Violation Detection System - Frontend

Modern React dashboard application for managing traffic violations with real-time detection capabilities, analytics, and comprehensive violation management.

## 🚀 Tech Stack

- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with glassmorphism design
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React
- **Routing**: React Router DOM

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Backend server running on `http://localhost:8000`

## 🛠️ Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

## 🏃 Running the Application

### Development Mode
```bash
npm run dev
```
The application will be available at `http://localhost:5174`

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 🔐 Login Credentials

### Admin Account
- **Username**: `admin`
- **Password**: `admin123`
- **Access**: Full system access

### Operator Account
- **Username**: `operator`
- **Password**: `operator123`
- **Access**: Limited operational access

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── Sidebar.jsx
│   │   ├── TopNavbar.jsx
│   │   ├── StatCard.jsx
│   │   ├── ViolationsTable.jsx
│   │   ├── VideoPreviewPanel.jsx
│   │   ├── AnalyticsCharts.jsx
│   │   └── Login.jsx
│   ├── pages/           # Application pages
│   │   ├── Dashboard.jsx
│   │   ├── Violations.jsx
│   │   ├── Analytics.jsx
│   │   └── Cameras.jsx
│   ├── services/        # API services
│   │   └── api.js
│   ├── data/            # Mock data
│   │   └── mockData.js
│   ├── assets/          # Static assets
│   ├── App.jsx          # Main application component
│   ├── App.css          # Application styles
│   ├── index.css        # Global styles
│   └── main.jsx         # Application entry point
├── public/              # Public assets
├── index.html           # HTML entry point
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # Tailwind CSS configuration
├── postcss.config.js    # PostCSS configuration
├── eslint.config.js     # ESLint configuration
└── package.json         # Dependencies and scripts
```

## 🎨 Features

### 1. Dashboard
- Real-time statistics and KPIs
- Live video preview panel
- Recent violations table
- Violation trends charts
- System health monitoring

### 2. Violations Management
- Comprehensive violation data table
- Advanced filtering (type, severity, status, date)
- Search functionality
- Detailed violation view with evidence
- Export capabilities

### 3. Analytics
- Interactive charts and graphs
- Violations over time analysis
- Location-based statistics
- Type distribution visualization
- Performance metrics

### 4. Camera Management
- Camera status monitoring
- Live feed preview
- Camera configuration
- Health status tracking

## 🔗 API Integration

The frontend connects to the FastAPI backend at `http://localhost:8000`. Configure the API base URL in `src/services/api.js`:

```javascript
const API_BASE_URL = 'http://localhost:8000/api/v1';
```

### API Endpoints Used
- `POST /auth/login` - User authentication
- `POST /auth/verify-token` - Token verification
- `GET /violations/` - Get violations list
- `GET /analytics/dashboard` - Dashboard statistics
- `GET /analytics/charts` - Chart data
- `GET /cameras/` - Camera list
- `POST /upload/` - Upload violation evidence

## 🎨 Design System

### Colors
- **Primary**: Teal (`#14b8a6`)
- **Accents**: Purple, Green, Yellow, Red
- **Background**: Dark theme with glassmorphism effects

### Components
- Glassmorphism cards with backdrop blur
- Smooth animations and transitions
- Responsive grid layouts
- Custom scrollbars

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the frontend directory:
```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

### Vite Configuration
The `vite.config.js` includes:
- React plugin for fast refresh
- Development server configuration
- Build optimizations

### Tailwind Configuration
Custom theme extensions in `tailwind.config.js`:
- Custom colors
- Typography settings
- Spacing utilities
- Animation configurations

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop (1920px and above)
- Laptop (1366px - 1920px)
- Tablet (768px - 1366px)
- Mobile (optimized for larger screens)

## 🐛 Development Tools

### ESLint
```bash
npm run lint
```

### VS Code Extensions Recommended
- ESLint
- Tailwind CSS IntelliSense
- ES7+ React/Redux/React-Native snippets
- Prettier

## 🚀 Deployment

### Build the Application
```bash
npm run build
```

### Deploy to Static Hosting
The `dist` folder can be deployed to:
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- Any static hosting service

### Example: Vercel Deployment
```bash
npm install -g vercel
vercel --prod
```

## 🔒 Security Notes

- Authentication tokens stored in localStorage
- CSRF protection via backend
- XSS protection via React
- Input validation on all forms
- Secure API communication

## 📊 Performance

- Lazy loading for components
- Code splitting with Vite
- Optimized bundle size
- Fast refresh in development
- Production build optimization

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
- Check the backend server is running on port 8000
- Verify API endpoints are accessible
- Check browser console for errors
- Review network tab for failed requests

## 🔄 Updates

Stay updated with the latest features and bug fixes by pulling the latest changes from the repository.
