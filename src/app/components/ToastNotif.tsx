// ToastNotification.tsx
import React, { useEffect } from "react";

interface ToastNotificationProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
}

const ToastNotification: React.FC<ToastNotificationProps> = ({
  message,
  isVisible,
  onClose,
}) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000); // Hide the toast after 3 seconds
      return () => clearTimeout(timer); // Clean up the timer on unmount
    }
  }, [isVisible, onClose]);

  return (
    isVisible && (
      <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg">
        <p>{message}</p>
      </div>
    )
  );
};

export default ToastNotification;
