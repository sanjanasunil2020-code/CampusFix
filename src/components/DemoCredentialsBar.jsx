import React from 'react';
import { Sparkles } from 'lucide-react';

export default function DemoCredentialsBar({ onSelectDemo }) {
  const demos = [
    { label: '⚡ Demo Student', roleId: 'student', email: 'alex.morgan@student.com', idVal: '2024CS108', name: 'Alex Morgan' },
    { label: '⚡ Demo Faculty', roleId: 'faculty', email: 'dr.sharma@staff.com', idVal: 'EMP-4092', name: 'Dr. Rajesh Sharma' },
    { label: '⚡ Demo Tech', roleId: 'maintenance', email: 'tech.david@mstaff.com', idVal: 'TECH-8821', name: 'David Miller (HVAC)' },
    { label: '⚡ Demo Admin', roleId: 'admin', email: 'dean.office@admin.com', idVal: 'ADM-001', name: 'Dean Office Admin' }
  ];

  return (
    <div style={{ marginBottom: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
        <Sparkles size={12} style={{ color: 'var(--accent-amber)' }} />
        <span>Quick Demo Personas (1-Click Domain Auto-Fill):</span>
      </div>
      <div className="demo-bar">
        {demos.map((d, index) => (
          <button
            key={index}
            type="button"
            className="demo-chip-btn"
            onClick={() => onSelectDemo(d)}
            title={`Fill inputs as ${d.name} (${d.email})`}
          >
            {d.label}
          </button>
        ))}
      </div>
    </div>
  );
}
