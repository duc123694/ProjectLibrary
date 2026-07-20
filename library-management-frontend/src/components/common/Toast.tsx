import React, { useEffect, useState, useCallback } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastContextType {
  showToast: (type: ToastType, message: string, duration?: number) => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

const toastConfig: Record<ToastType, { icon: React.ReactNode; bg: string; border: string; iconColor: string }> = {
  success: {
    icon: <CheckCircle className="w-5 h-5" />,
    bg: 'bg-emerald-50',
    border: 'border-emerald-200/60',
    iconColor: 'text-emerald-500',
  },
  error: {
    icon: <XCircle className="w-5 h-5" />,
    bg: 'bg-red-50',
    border: 'border-red-200/60',
    iconColor: 'text-red-500',
  },
  warning: {
    icon: <AlertTriangle className="w-5 h-5" />,
    bg: 'bg-amber-50',
    border: 'border-amber-200/60',
    iconColor: 'text-amber-500',
  },
  info: {
    icon: <Info className="w-5 h-5" />,
    bg: 'bg-primary-50',
    border: 'border-primary-200/60',
    iconColor: 'text-primary-500',
  },
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((type: ToastType, message: string, duration = 4000) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, message, duration }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-4 right-4 z-[100] space-y-3 max-w-sm">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

const ToastItem: React.FC<{ toast: Toast; onClose: () => void }> = ({ toast, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, toast.duration || 4000);
    return () => clearTimeout(timer);
  }, [toast.duration, onClose]);

  const config = toastConfig[toast.type];

  return (
    <div
      className={`
        flex items-start gap-3 p-4 rounded-2xl border shadow-xl shadow-surface-200/30
        backdrop-blur-sm animate-slide-in-right
        ${config.bg} ${config.border}
      `}
    >
      <div className={`flex-shrink-0 mt-0.5 ${config.iconColor}`}>
        {config.icon}
      </div>
      <p className="text-sm font-semibold text-surface-800 flex-1 leading-relaxed">{toast.message}</p>
      <button
        onClick={onClose}
        className="text-surface-400 hover:text-surface-600 transition-colors flex-shrink-0 p-0.5 rounded-lg hover:bg-white/50"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
