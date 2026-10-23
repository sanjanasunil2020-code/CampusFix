import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import LiveTicker from './components/LiveTicker';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPreview from './components/DashboardPreview';
import EmergencyModal from './components/EmergencyModal';
import ForgotPasswordModal from './components/ForgotPasswordModal';
import SystemInfoModal from './components/SystemInfoModal';
import ToastContainer from './components/ToastContainer';

// ─── Shared Database (survives role switches / logouts) ───────────────────────
const INITIAL_COMPLAINTS = [
  {
    id: "CMP-9042",
    title: "High-Speed Wi-Fi Disconnection in Library 3rd Floor",
    category: "IT & Wi-Fi Network",
    location: "Main Library - Quiet Reading Hall B",
    priority: "High",
    status: "in-progress",
    technician: "David Miller (Network Team)",
    date: "Sep 2, 2026",
    eta: "45 mins",
    timeline: [
      { step: "Submitted", time: "10:15 AM", done: true },
      { step: "Admin Approved", time: "10:20 AM", done: true },
      { step: "Work In Progress", time: "10:40 AM", done: true },
      { step: "Resolved", time: "Pending", done: false }
    ]
  },
  {
    id: "CMP-8819",
    title: "Air Conditioning Cooling Fault in Block C Lecture Hall 102",
    category: "HVAC & Electrical",
    location: "Block C - Lecture Hall 102",
    priority: "Urgent",
    status: "pending",
    technician: "Awaiting Admin Approval...",
    date: "Sep 2, 2026",
    eta: "1.5 hours",
    timeline: [
      { step: "Submitted", time: "11:30 AM", done: true },
      { step: "Admin Approval", time: "Pending", done: false },
      { step: "Work In Progress", time: "Pending", done: false },
      { step: "Resolved", time: "Pending", done: false }
    ]
  },
  {
    id: "CMP-8105",
    title: "Projector Bulb Flickering in Physics Auditorium Lab",
    category: "HVAC & Electrical",
    location: "Science Complex - Hall A",
    priority: "High",
    status: "approved",
    technician: "Electrician Team Assigned",
    date: "Sep 2, 2026",
    eta: "30 mins",
    timeline: [
      { step: "Submitted", time: "11:00 AM", done: true },
      { step: "Admin Approved", time: "11:10 AM", done: true },
      { step: "Awaiting Staff Start Work", time: "Dispatched", done: false },
      { step: "Resolved", time: "Pending", done: false }
    ]
  },
  {
    id: "CMP-7412",
    title: "Water Tap Leakage in Chemistry Lab 2 Washroom",
    category: "Plumbing & Sanitation",
    location: "Science Building - Chemistry Lab 2",
    priority: "Medium",
    status: "resolved",
    technician: "Robert Hayes (Plumbing Dept)",
    date: "Sep 1, 2026",
    eta: "Completed",
    timeline: [
      { step: "Submitted", time: "Yesterday", done: true },
      { step: "Admin Approved", time: "Yesterday", done: true },
      { step: "Work In Progress", time: "Yesterday", done: true },
      { step: "Resolved", time: "Yesterday 4:00 PM", done: true }
    ]
  }
];

const INITIAL_REGISTRATIONS = [
  {
    id: "REG-901",
    name: "Samantha Reed",
    email: "samantha.reed@student.com",
    role: "Student",
    roleId: "student",
    campusId: "2024CS189",
    department: "Computer Science",
    date: "Today 02:15 PM",
    status: "pending"
  },
  {
    id: "REG-902",
    name: "Prof. Alan Turing",
    email: "a.turing@staff.com",
    role: "Faculty & Staff",
    roleId: "faculty",
    campusId: "EMP-5012",
    department: "Mathematics & AI Lab",
    date: "Today 01:40 PM",
    status: "pending"
  },
  {
    id: "REG-903",
    name: "Marcus Vance",
    email: "marcus.v@mstaff.com",
    role: "Maintenance Staff",
    roleId: "maintenance",
    campusId: "TECH-9012",
    department: "Electrical Facilities",
    date: "Yesterday",
    status: "pending"
  }
];

const INITIAL_BROADCASTS = [
  {
    id: "BC-1",
    target: "student",
    title: "Library Quiet Hours Wi-Fi Upgrade",
    message: "Network team is upgrading 3rd floor Wi-Fi routers. Service expected back at 12:00 PM.",
    timestamp: "10 mins ago"
  }
];
// ─────────────────────────────────────────────────────────────────────────────

export default function App() {
  const [theme, setTheme] = useState('dark');
  const [currentPage, setCurrentPage] = useState('login');
  const [currentUser, setCurrentUser] = useState(null);
  const [adminRegistered, setAdminRegistered] = useState(true);

  // ── Shared global state (persists across role switches) ──
  const [complaints, setComplaints] = useState(INITIAL_COMPLAINTS);
  const [pendingRegistrations, setPendingRegistrations] = useState(INITIAL_REGISTRATIONS);
  const [sentBroadcasts, setSentBroadcasts] = useState(INITIAL_BROADCASTS);

  // Modals
  const [showSOS, setShowSOS] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showForgot, setShowForgot] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const showToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 4500);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const handleLoginSuccess = (userPayload) => {
    setCurrentUser(userPayload);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage('login');
    showToast('Logged out of CampusFix Portal.', 'info');
  };

  return (
    <div className="app-container">
      {/* Background Ambient Glow Orbs */}
      <div className="ambient-particles">
        <div className="particle particle-1"></div>
        <div className="particle particle-2"></div>
        <div className="particle particle-3"></div>
      </div>

      {/* Header Bar */}
      <Header
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        theme={theme}
        toggleTheme={toggleTheme}
        onOpenSOS={() => setShowSOS(true)}
        onOpenInfo={() => setShowInfo(true)}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Live Campus Resolved Ticker */}
      <LiveTicker />

      {/* Main Body Pages */}
      <main className="main-wrapper">
        {currentPage === 'dashboard' || currentUser ? (
          <DashboardPreview
            user={currentUser || { name: 'Alex Morgan (Demo)', email: 'alex.morgan@student.college.edu', role: 'Student', campusId: '2024CS108' }}
            showToast={showToast}
            onLogout={handleLogout}
            complaints={complaints}
            setComplaints={setComplaints}
            pendingRegistrations={pendingRegistrations}
            setPendingRegistrations={setPendingRegistrations}
            sentBroadcasts={sentBroadcasts}
            setSentBroadcasts={setSentBroadcasts}
          />
        ) : currentPage === 'signup' ? (
          <SignupPage
            onLoginSuccess={handleLoginSuccess}
            onNavigateToLogin={() => setCurrentPage('login')}
            showToast={showToast}
            adminRegistered={adminRegistered}
            setAdminRegistered={setAdminRegistered}
          />
        ) : (
          <LoginPage
            onLoginSuccess={handleLoginSuccess}
            onNavigateToSignup={() => setCurrentPage('signup')}
            showToast={showToast}
            onOpenForgotPassword={() => setShowForgot(true)}
          />
        )}
      </main>

      {/* Modals & Overlays */}
      {showSOS && (
        <EmergencyModal
          onClose={() => setShowSOS(false)}
          showToast={showToast}
        />
      )}

      {showForgot && (
        <ForgotPasswordModal
          onClose={() => setShowForgot(false)}
          showToast={showToast}
        />
      )}

      {showInfo && (
        <SystemInfoModal
          onClose={() => setShowInfo(false)}
        />
      )}

      {/* Toast Alerts */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* Footer */}
      <footer className="footer">
        <p>
          © 2026 CampusFix AI System • Smart College Campus Complaint & Issue Management System
        </p>
      </footer>
    </div>
  );
}
