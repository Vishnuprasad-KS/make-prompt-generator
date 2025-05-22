import React, { useEffect } from 'react';
import { NotificationProps } from '../types';
import { CheckCircle, XCircle, X } from 'lucide-react';

const Notification: React.FC<NotificationProps & { onClose: () => void }> = ({ 
  type, 
  message, 
  onClose 
}) => {
  useEffect(() => {
    if (type) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [type, onClose]);

  if (!type) return null;

  return (
    <div
      className={`fixed top-4 right-4 max-w-md p-4 rounded-lg shadow-lg flex items-center gap-3 transform transition-all duration-300 ease-in-out ${
        type === 'success' 
          ? 'bg-green-50 text-green-800 border-l-4 border-green-500' 
          : 'bg-red-50 text-red-800 border-l-4 border-red-500'
      }`}
      style={{ 
        animation: 'slide-in-right 0.3s ease-out forwards' 
      }}
    >
      {type === 'success' ? (
        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
      ) : (
        <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
      )}
      <p className="flex-1 text-sm font-medium">{message}</p>
      <button 
        onClick={onClose}
        className="text-gray-400 hover:text-gray-500 transition-colors"
        aria-label="Close notification"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export default Notification;