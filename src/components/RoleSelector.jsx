import React from 'react';
import { GraduationCap, Briefcase, Wrench, ShieldCheck } from 'lucide-react';

export const ROLES = [
  { id: 'student', name: 'Student', icon: GraduationCap, placeholder: 'Roll No. (e.g., 2024CS108)', emailDomain: '@student.com' },
  { id: 'faculty', name: 'Faculty & Staff', icon: Briefcase, placeholder: 'Employee ID (e.g., EMP-4092)', emailDomain: '@staff.com' },
  { id: 'maintenance', name: 'Maintenance Staff', icon: Wrench, placeholder: 'Staff ID (e.g., TECH-8821)', emailDomain: '@mstaff.com' },
  { id: 'admin', name: 'College Admin', icon: ShieldCheck, placeholder: 'Admin Key (e.g., ADM-001)', emailDomain: '@admin.com' }
];

export default function RoleSelector({ selectedRole, onSelectRole }) {
  return (
    <div style={{ marginBottom: '1.25rem' }}>
      <div className="role-section-title">
        <span>Select Account Role</span>
        <span style={{ color: 'var(--accent-cyan)', fontSize: '0.72rem' }}>Role-Based Access</span>
      </div>
      <div className="role-grid">
        {ROLES.map((role) => {
          const Icon = role.icon;
          const isSelected = selectedRole.id === role.id;
          return (
            <div
              key={role.id}
              className={`role-chip ${isSelected ? 'selected' : ''}`}
              onClick={() => onSelectRole(role)}
            >
              <div className="role-icon">
                <Icon size={20} />
              </div>
              <span className="role-name">{role.name}</span>
              <span style={{ fontSize: '0.65rem', color: isSelected ? 'var(--accent-cyan)' : 'var(--text-muted)' }}>
                {role.emailDomain}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
