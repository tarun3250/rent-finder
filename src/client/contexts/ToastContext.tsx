import React, { createContext, useContext, useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, XCircle, X } from 'lucide-react';

interface ToastContextType {
  showToast: (message: string, type: 'success' | 'error') => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toast, setToast] = useState<{ id: number, message: string, type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    const id = Date.now();
    setToast({ id, message, type });
    setTimeout(() => {
        setToast(current => current?.id === id ? null : current);
    }, 4000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className={`fixed bottom-8 right-8 flex items-center gap-4 px-6 py-4 rounded-2xl shadow-2xl z-[100] text-white font-bold max-w-md ${
              toast.type === 'success' ? 'bg-primary-600' : 'bg-red-500'
            }`}
          >
            {toast.type === 'success' ? <CheckCircle className="w-6 h-6 text-primary-100" /> : <XCircle className="w-6 h-6 text-red-100" />}
            <span className="flex-1">{toast.message}</span>
            <button onClick={() => setToast(null)} className="p-1 hover:bg-white/20 rounded-full transition-colors">
                <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
