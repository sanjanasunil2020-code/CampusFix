import React, { useState } from 'react';
import { 
  Shield, GraduationCap, Briefcase, Wrench, ShieldCheck, Plus, ChevronRight, LogOut, Lock
} from 'lucide-react';

import StudentDashboard from './dashboards/StudentDashboard';
import FacultyDashboard from './dashboards/FacultyDashboard';
import MaintenanceDashboard from './dashboards/MaintenanceDashboard';
import AdminDashboard from './dashboards/AdminDashboard';

// ── Complaint category → maintenance wing mapping ──────────────────────────
const CATEGORY_TO_DEPT = {
  'IT & Wi-Fi Network':        'IT & Network Operations',
  'HVAC & Electrical':         'HVAC & Electrical',
  'Plumbing & Sanitation':     'Plumbing & Sanitation',
  'Furniture & Carpentry':     'Furniture & Carpentry',
  'Campus Security & Safety':  'Campus Security & Safety',
  'Academics & Examinations':  'Academic Affairs',
};
// ─────────────────────────────────────────────────────────────────────────────

// DashboardPreview now receives complaints/registrations/broadcasts as props
// from App.jsx (global state) so data persists across role switches.
export default function DashboardPreview({
  user,
  showToast,
  onLogout,
  complaints,
  setComplaints,
  pendingRegistrations,
  setPendingRegistrations,
  sentBroadcasts,
  setSentBroadcasts,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showNewModal, setShowNewModal] = useState(false);

  // STRICT CONFIDENTIAL ACCESS: role resolution
  const userRoleId = (() => {
    if (user.roleId) return user.roleId;
    const r = (user.role || '').toLowerCase();
    if (r.includes('admin') || r.includes('dean')) return 'admin';
    if (r.includes('maintenance') || r.includes('tech') || r.includes('facility')) return 'maintenance';
    if (r.includes('faculty') || r.includes('staff')) return 'faculty';
    return 'student';
  })();

  // Filter broadcasts for current user's role
  const userNotifications = sentBroadcasts.filter(b => b.target === 'all' || b.target === userRoleId);

  // ── New Complaint Modal State ──
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('IT & Wi-Fi Network');
  const [newLocation, setNewLocation] = useState('Engineering Block A - Room 204');
  const [newPriority, setNewPriority] = useState('Medium');
  const [newDesc, setNewDesc] = useState('');

  const handleTitleChange = (val) => {
    setNewTitle(val);
    const lower = val.toLowerCase();
    if (lower.includes('water') || lower.includes('tap') || lower.includes('pipe') || lower.includes('flush')) {
      setNewCategory('Plumbing & Sanitation');
    } else if (lower.includes('wifi') || lower.includes('net') || lower.includes('router') || lower.includes('port')) {
      setNewCategory('IT & Wi-Fi Network');
    } else if (lower.includes('ac') || lower.includes('fan') || lower.includes('light') || lower.includes('power') || lower.includes('switch')) {
      setNewCategory('HVAC & Electrical');
    } else if (lower.includes('desk') || lower.includes('chair') || lower.includes('door') || lower.includes('bench')) {
      setNewCategory('Furniture & Carpentry');
    } else if (
      lower.includes('exam') || lower.includes('grade') || lower.includes('professor') ||
      lower.includes('lecture') || lower.includes('timetable') || lower.includes('syllabus') ||
      lower.includes('attendance') || lower.includes('result') || lower.includes('marks') ||
      lower.includes('assignment') || lower.includes('faculty') || lower.includes('course')
    ) {
      setNewCategory('Academics & Examinations');
    }
  };

  // ── Complaint Submission (writes to global shared state) ──
  const handleCreateComplaint = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      showToast('Please enter an issue title', 'warning');
      return;
    }

    const newTicket = {
      id: `CMP-${Math.floor(1000 + Math.random() * 9000)}`,
      title: newTitle,
      category: newCategory,
      location: newLocation,
      priority: newPriority,
      status: 'pending',
      technician: 'Awaiting Admin Approval...',
      date: 'Just now',
      eta: 'Pending Approval',
      isNew: true,
      submittedBy: {
        name: user.name || 'Student',
        email: user.email || '',
        campusId: user.campusId || 'N/A',
        role: user.role || 'Student',
        roleId: userRoleId,
      },
      timeline: [
        { step: 'Submitted', time: 'Just now', done: true },
        { step: 'Awaiting Admin Approval', time: 'In Queue', done: false },
        { step: 'Work In Progress', time: 'Pending', done: false },
        { step: 'Resolved', time: 'Pending', done: false },
      ],
    };

    // Prepend to global complaints — admin sees it immediately
    setComplaints(prev => [newTicket, ...prev]);
    setShowNewModal(false);
    setNewTitle('');
    setNewDesc('');
    showToast(`Issue ${newTicket.id} submitted! Awaiting Admin Approval.`, 'success');
  };

  // ── Workflow Handlers ──
  const handleAdminApprove = (id) => {
    setComplaints(prev => prev.map(c => {
      if (c.id !== id) return c;
      // Stamp assignedCategory so it routes to the right maintenance wing
      const dept = CATEGORY_TO_DEPT[c.category] || c.category;
      return {
        ...c,
        status: 'approved',
        isNew: false,
        assignedCategory: c.category,  // the routing key
        technician: `Dispatched to ${dept} Wing`,
        eta: 'Ready for Repair',
        timeline: c.timeline.map((t, idx) =>
          idx <= 1 ? { ...t, done: true, time: 'Approved Now' } : t
        ),
      };
    }));
    showToast(`Admin approved ticket ${id}! Routed to the matching Maintenance Wing.`, 'success');
  };

  const handleStaffStartWork = (id) => {
    setComplaints(prev => prev.map(c => {
      if (c.id !== id) return c;
      return {
        ...c,
        status: 'in-progress',
        technician: user.name || 'David Miller (HVAC Tech)',
        eta: '30 mins',
        timeline: c.timeline.map((t, idx) =>
          idx <= 2 ? { ...t, done: true, time: 'Started Now' } : t
        ),
      };
    }));
    showToast(`Maintenance Staff started work on ticket ${id}!`, 'info');
  };

  const handleMarkResolved = (id, action) => {
    if (action === 'rejected') {
      setComplaints(prev => prev.map(c => {
        if (c.id !== id) return c;
        return {
          ...c,
          status: 'rejected',
          isNew: false,
          technician: 'Rejected by Admin',
          eta: 'Rejected',
          timeline: c.timeline.map((t, idx) =>
            idx === 0 ? { ...t, done: true } : { ...t, done: false }
          ),
        };
      }));
      showToast(`Ticket ${id} has been rejected by Admin.`, 'error');
    } else {
      setComplaints(prev => prev.map(c => {
        if (c.id !== id) return c;
        return {
          ...c,
          status: 'resolved',
          eta: 'Completed',
          timeline: c.timeline.map(t => ({ ...t, done: true })),
        };
      }));
      showToast(`Ticket ${id} marked as Resolved!`, 'success');
    }
  };

  // ── Registration Handlers ──
  const handleApproveRegistration = (id) => {
    const reg = pendingRegistrations.find(r => r.id === id);
    setPendingRegistrations(prev => prev.filter(r => r.id !== id));
    showToast(`Registration for ${reg ? reg.name : id} APPROVED! User account activated.`, 'success');
  };

  const handleRejectRegistration = (id) => {
    const reg = pendingRegistrations.find(r => r.id === id);
    setPendingRegistrations(prev => prev.filter(r => r.id !== id));
    showToast(`Registration for ${reg ? reg.name : id} REJECTED.`, 'error');
  };

  // ── Broadcast Handler ──
  const handleSendNotification = (newBroadcast) => {
    setSentBroadcasts(prev => [newBroadcast, ...prev]);
    const targetLabel =
      newBroadcast.target === 'student' ? 'Students Dashboard' :
      newBroadcast.target === 'faculty' ? 'Faculty Dashboard' :
      newBroadcast.target === 'maintenance' ? 'Maintenance Dashboard' : 'All Dashboards';
    showToast(`Notification broadcast sent to ${targetLabel}!`, 'success');
  };

  // ── Per-student filter for StudentDashboard ──
  // Show pre-seeded demo tickets (no submittedBy) OR only this student's own submissions
  const studentComplaints = complaints.filter(
    c => !c.submittedBy || c.submittedBy.email === user.email
  );

  // ── Enrich maintenance user with a guaranteed specialization ──
  // Derive from email prefix OR department string if not already set in user payload.
  // This ensures the demo tech and any signed-up maintenance user always have routing.
  const DEPT_TO_SPEC = {
    'it':        'it & wi-fi network',
    'network':   'it & wi-fi network',
    'wifi':      'it & wi-fi network',
    'tech':      'it & wi-fi network',
    'plumb':     'plumbing & sanitation',
    'sanit':     'plumbing & sanitation',
    'water':     'plumbing & sanitation',
    'carpent':   'furniture & carpentry',
    'furniture': 'furniture & carpentry',
    'security':  'campus security & safety',
    'guard':     'campus security & safety',
    'hvac':      'hvac & electrical',
    'electr':    'hvac & electrical',
  };
  const SPEC_NORMALIZED_TO_DISPLAY = {
    'it & wi-fi network':       'IT & Wi-Fi Network',
    'hvac & electrical':        'HVAC & Electrical',
    'plumbing & sanitation':    'Plumbing & Sanitation',
    'furniture & carpentry':    'Furniture & Carpentry',
    'campus security & safety': 'Campus Security & Safety',
  };

  const enrichedMaintenanceUser = (() => {
    if (userRoleId !== 'maintenance') return user;
    if (user.specialization) return user; // already set
    // Try to derive from email prefix, then from department string
    const emailPrefix = (user.email || '').split('@')[0].toLowerCase();
    const deptStr = (user.department || '').toLowerCase();
    const searchStr = emailPrefix + ' ' + deptStr;
    let derived = null;
    for (const [keyword, spec] of Object.entries(DEPT_TO_SPEC)) {
      if (searchStr.includes(keyword)) {
        derived = SPEC_NORMALIZED_TO_DISPLAY[spec] || spec;
        break;
      }
    }
    return { ...user, specialization: derived || 'HVAC & Electrical' };
  })();

  return (
    <div className="dashboard-preview-container">
      {/* Strict Role Dashboard Render (Confidential Isolation - No Cross-Role Viewing!) */}
      {userRoleId === 'student' && (
        <StudentDashboard
          user={user}
          complaints={studentComplaints}
          notifications={userNotifications}
          onOpenReportModal={() => setShowNewModal(true)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />
      )}

      {userRoleId === 'faculty' && (
        <FacultyDashboard
          user={user}
          complaints={complaints}
          notifications={userNotifications}
          onOpenReportModal={() => setShowNewModal(true)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />
      )}

      {userRoleId === 'maintenance' && (
        <MaintenanceDashboard
          user={enrichedMaintenanceUser}
          complaints={complaints}
          notifications={userNotifications}
          onStaffStartWork={handleStaffStartWork}
          onMarkResolved={handleMarkResolved}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />
      )}

      {userRoleId === 'admin' && (
        <AdminDashboard
          user={user}
          complaints={complaints}
          onAdminApprove={handleAdminApprove}
          onMarkResolved={handleMarkResolved}
          pendingRegistrations={pendingRegistrations}
          onApproveRegistration={handleApproveRegistration}
          onRejectRegistration={handleRejectRegistration}
          sentBroadcasts={sentBroadcasts}
          onSendNotification={handleSendNotification}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          showToast={showToast}
        />
      )}

      {/* Report Issue Modal */}
      {showNewModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Plus size={20} style={{ color: 'var(--accent-cyan)' }} />
                <span>Report College Campus Issue</span>
              </h3>
              <button className="close-btn" onClick={() => setShowNewModal(false)}>✕</button>
            </div>

            <form onSubmit={handleCreateComplaint}>
              <div className="form-group">
                <label className="form-label">Issue Title (Brief Summary)</label>
                <input
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: '1rem' }}
                  placeholder="e.g. Library 3rd Floor Wi-Fi or Lab 102 Air Conditioner fault"
                  value={newTitle}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    className="form-select"
                    style={{ paddingLeft: '1rem' }}
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                  >
                    <option value="IT & Wi-Fi Network">IT & Wi-Fi Network</option>
                    <option value="HVAC & Electrical">HVAC & Electrical</option>
                    <option value="Plumbing & Sanitation">Plumbing & Sanitation</option>
                    <option value="Furniture & Carpentry">Furniture & Carpentry</option>
                    <option value="Campus Security & Safety">Campus Security & Safety</option>
                    <option value="Academics & Examinations">Academics & Examinations</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Priority</label>
                  <select
                    className="form-select"
                    style={{ paddingLeft: '1rem' }}
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value)}
                  >
                    <option value="Low">Low (General)</option>
                    <option value="Medium">Medium (Normal)</option>
                    <option value="High">High (Requires Prompt Action)</option>
                    <option value="Urgent">Urgent (Exam / Lecture Interrupted)</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Campus Building & Room Location</label>
                <input
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: '1rem' }}
                  placeholder="e.g. Science Block B - Chemistry Lab 2"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Additional Details / Technical Description</label>
                <textarea
                  className="form-input"
                  style={{ paddingLeft: '1rem', minHeight: '80px', resize: 'vertical' }}
                  placeholder="Provide notes or symptoms for technician..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                ></textarea>
              </div>

              <button type="submit" className="btn-primary">
                <span>Submit Complaint Ticket</span>
                <ChevronRight size={18} />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
