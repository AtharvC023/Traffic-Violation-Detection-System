export const mockViolations = [
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
  },
  {
    id: "VIO-002",
    time: "2024-12-01T09:15:00Z",
    camera: "CAM-South-03",
    location: "Highway 101 Mile 15",
    type: "Overspeed",
    severity: "High",
    status: "Under Review",
    plateNumber: "XYZ-789",
    description: "Speed: 85 mph in 65 mph zone",
    evidence: "/evidence/vio-002.mp4"
  },
  {
    id: "VIO-003",
    time: "2024-12-01T08:45:00Z",
    camera: "CAM-East-02",
    location: "Downtown Plaza",
    type: "No Helmet",
    severity: "Medium",
    status: "Closed",
    plateNumber: "MOT-456",
    description: "Motorcycle rider without helmet",
    evidence: "/evidence/vio-003.jpg"
  },
  {
    id: "VIO-004",
    time: "2024-12-01T11:20:00Z",
    camera: "CAM-West-04",
    location: "Park Ave & Oak St",
    type: "Wrong Way",
    severity: "Critical",
    status: "Open",
    plateNumber: "DEF-321",
    description: "Vehicle traveling against traffic flow",
    evidence: "/evidence/vio-004.mp4"
  },
  {
    id: "VIO-005",
    time: "2024-12-01T07:30:00Z",
    camera: "CAM-Central-01",
    location: "Business District",
    type: "Lane Violation",
    severity: "Medium",
    status: "Under Review",
    plateNumber: "GHI-654",
    description: "Illegal lane change without signaling",
    evidence: "/evidence/vio-005.jpg"
  },
  {
    id: "VIO-006",
    time: "2024-12-01T12:00:00Z",
    camera: "CAM-North-02",
    location: "School Zone Elm St",
    type: "Crosswalk",
    severity: "High",
    status: "Open",
    plateNumber: "JKL-987",
    description: "Failed to yield to pedestrian in crosswalk",
    evidence: "/evidence/vio-006.mp4"
  },
  {
    id: "VIO-007",
    time: "2024-12-01T14:15:00Z",
    camera: "CAM-South-01",
    location: "Mall Parking Lot",
    type: "Parking",
    severity: "Low",
    status: "Closed",
    plateNumber: "MNO-234",
    description: "Parking in handicap zone without permit",
    evidence: "/evidence/vio-007.jpg"
  },
  {
    id: "VIO-008",
    time: "2024-12-01T16:45:00Z",
    camera: "CAM-Highway-01",
    location: "I-95 North Bound",
    type: "Tailgating",
    severity: "Medium",
    status: "Under Review",
    plateNumber: "PQR-567",
    description: "Following too closely in heavy traffic",
    evidence: "/evidence/vio-008.mp4"
  }
];

export const mockStats = {
  totalViolationsToday: 24,
  criticalViolations: 8,
  activeCameras: 12,
  pendingActions: 15
};

export const mockChartData = {
  violationsByDay: [
    { date: "Nov 25", violations: 18 },
    { date: "Nov 26", violations: 22 },
    { date: "Nov 27", violations: 15 },
    { date: "Nov 28", violations: 28 },
    { date: "Nov 29", violations: 20 },
    { date: "Nov 30", violations: 25 },
    { date: "Dec 01", violations: 24 }
  ],
  violationsByType: [
    { name: "Red Light", value: 35, color: "#ef4444" },
    { name: "Overspeed", value: 28, color: "#f59e0b" },
    { name: "No Helmet", value: 15, color: "#8b5cf6" },
    { name: "Wrong Way", value: 12, color: "#10b981" },
    { name: "Lane Violation", value: 8, color: "#14b8a6" },
    { name: "Others", value: 12, color: "#6b7280" }
  ],
  violationsByLocation: [
    { location: "Main St & 5th Ave", violations: 12 },
    { location: "Highway 101", violations: 18 },
    { location: "Downtown Plaza", violations: 8 },
    { location: "Business District", violations: 15 },
    { location: "School Zone", violations: 6 },
    { location: "Mall Area", violations: 4 }
  ],
  violationsOverTime: [
    { date: "Nov 01", violations: 45 },
    { date: "Nov 05", violations: 52 },
    { date: "Nov 10", violations: 38 },
    { date: "Nov 15", violations: 61 },
    { date: "Nov 20", violations: 48 },
    { date: "Nov 25", violations: 55 },
    { date: "Nov 30", violations: 42 }
  ]
};

export const mockTopRiskLocations = [
  {
    name: "Main St & 5th Ave",
    area: "Downtown",
    avgDailyViolations: 4.2,
    suggestion: "Install additional signage"
  },
  {
    name: "Highway 101 Mile 15",
    area: "Highway",
    avgDailyViolations: 6.1,
    suggestion: "Reduce speed limit"
  },
  {
    name: "School Zone Elm St",
    area: "Residential",
    avgDailyViolations: 2.8,
    suggestion: "Add speed bumps"
  },
  {
    name: "Business District",
    area: "Commercial",
    avgDailyViolations: 3.9,
    suggestion: "Increase patrol frequency"
  },
  {
    name: "Park Ave & Oak St",
    area: "Mixed Use",
    avgDailyViolations: 2.1,
    suggestion: "Improve lighting"
  }
];

export const violationTypes = [
  "Red Light",
  "No Helmet", 
  "Overspeed",
  "Wrong Way",
  "Lane Violation",
  "Parking",
  "Tailgating",
  "Crosswalk"
];

export const severityLevels = ["Critical", "High", "Medium", "Low"];
export const statusOptions = ["Open", "Under Review", "Closed"];