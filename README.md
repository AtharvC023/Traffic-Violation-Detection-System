# Traffic Violation Detection System Dashboard

A modern, responsive React dashboard for managing traffic violations with real-time detection capabilities, analytics, and comprehensive violation management.

## 🚀 Features

### Core Features
- **Modern Dashboard UI** with glassmorphism design
- **Real-time Traffic Monitoring** with live camera feeds
- **Comprehensive Violations Management** with filtering and search
- **Advanced Analytics** with interactive charts and insights
- **Responsive Design** that works on desktop and tablet
- **Dark Theme** with vibrant accent colors

### Dashboard Pages
1. **Main Dashboard** - Overview with stats cards, live video feed, recent violations, and summary charts
2. **Violations Management** - Full CRUD operations with filtering, search, and detailed violation views
3. **Analytics** - Comprehensive data visualization with performance metrics and insights
4. **Live Detection** - Real-time traffic violation detection interface
5. **Process Video/Images** - Upload and process media for violation detection
6. **Archive** - Historical data management
7. **Settings** - System configuration

### UI Components
- **Glassmorphism Cards** with backdrop blur effects
- **Interactive Charts** powered by Recharts
- **Responsive Tables** with sorting and filtering
- **Modal Overlays** for detailed views
- **Severity Badges** with color coding
- **Status Indicators** with real-time updates

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS with custom themes
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **Date Handling**: date-fns
- **UI Components**: Headless UI

## 📦 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Sidebar.jsx     # Navigation sidebar
│   ├── TopNavbar.jsx   # Top navigation bar
│   ├── StatCard.jsx    # Statistics display cards
│   ├── ViolationsTable.jsx  # Violations data table
│   ├── VideoPreviewPanel.jsx  # Live video preview
│   └── AnalyticsCharts.jsx    # Chart components
├── pages/              # Main application pages
│   ├── Dashboard.jsx   # Main dashboard page
│   ├── Violations.jsx  # Violations management page
│   └── Analytics.jsx   # Analytics and insights page
├── data/               # Mock data and constants
│   └── mockData.js     # Sample violation data
└── styles/
    └── index.css       # Global styles and Tailwind config
```

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
