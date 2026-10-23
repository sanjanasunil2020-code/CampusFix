import React from 'react';
import { CheckCircle2, Info, AlertTriangle, XCircle } from 'lucide-react';

export default function ToastContainer({ toasts, removeToast }) {
  return (
    <div className="toast-container">
      {toasts.map((toast) => {
        let Icon = Info;
        if (toast.type === 'success') Icon = CheckCircle2;
        if (toast.type === 'warning') Icon = AlertTriangle;
        if (toast.type === 'error') Icon = XCircle;

        return (
          <div
            key={toast.id}
            className={`toast ${toast.type}`}
            onClick={() => removeToast(toast.id)}
          >
            <Icon size={20} style={{ flexShrink: 0 }} />
            <div style={{ flex: 1 }}>{toast.message}</div>
          </div>
        );
      })}
    </div>
  );
}
