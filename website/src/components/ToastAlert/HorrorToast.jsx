import React, { useState, useEffect, useCallback } from "react";
import { Skull, X, AlertTriangle } from "lucide-react";

const Toast = ({ id, message, type = "info", onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  // Use useCallback to prevent onClose dependency changes
  const handleClose = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => onClose(id), 300);
  }, [id, onClose]);

  useEffect(() => {
    // console.log("mounted toast check");
    setIsVisible(true);

    const timer = setTimeout(() => {
      handleClose();
    }, 7000);

    return () => {
      // console.log("Cleanup timer");
      clearTimeout(timer);
    };
  }, []); // Remove onClose from dependencies - only run once on mount

  const getToastColors = () => {
    switch (type) {
      case "success":
        return "from-red-900 to-green-900 border-green-700";
      case "error":
        return "from-red-950 to-red-800 border-red-600";
      case "warning":
        return "from-orange-950 to-yellow-900 border-yellow-700";
      default:
        return "from-gray-900 to-red-900 border-red-800";
    }
  };

  const getIcon = () => {
    switch (type) {
      case "error":
        return (
          <Skull className="w-5 h-5 sm:w-6 sm:h-6 text-red-400 animate-pulse" />
        );
      case "warning":
        return (
          <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400 animate-pulse" />
        );
      default:
        return (
          <Skull className="w-5 h-5 sm:w-6 sm:h-6 text-red-400 animate-bounce" />
        );
    }
  };

  return (
    <div
      className={`fixed top-4 left-4 z-50 transition-all duration-300 ease-in-out transform ${
        isVisible ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
      }`}
    >
      <div
        className={`relative bg-gradient-to-r ${getToastColors()} 
        border-2 rounded-lg shadow-2xl shadow-red-900/50 
        p-3 sm:p-4 max-w-xs sm:max-w-sm md:max-w-md
        backdrop-blur-sm overflow-hidden
        hover:shadow-red-800/60 transition-shadow duration-300`}
      >
        {/* Blood drip effect */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 to-red-800">
          <div className="absolute top-0 left-1/4 w-1 h-3 bg-red-600 animate-pulse"></div>
          <div className="absolute top-0 left-3/4 w-1 h-2 bg-red-700 animate-pulse delay-300"></div>
        </div>

        {/* Skull decoration */}
        <div className="absolute -top-1 -right-1 opacity-20">
          <Skull className="w-8 h-8 text-red-300 rotate-12" />
        </div>

        <div className="flex items-start space-x-2 sm:space-x-3 relative z-10">
          <div className="flex-shrink-0 pt-0.5">{getIcon()}</div>

          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm md:text-base font-medium text-red-100 break-words leading-tight">
              {message}
            </p>
          </div>

          <button
            onClick={handleClose}
            className="flex-shrink-0 ml-2 p-1 rounded-full hover:bg-red-800/50 
            transition-colors duration-200 group"
          >
            <X className="w-4 h-4 text-red-300 group-hover:text-red-100" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-red-950/50">
          <div
            className="h-full bg-gradient-to-r from-red-500 to-red-700"
            style={{
              animation: "shrinkWidth 7s linear forwards",
            }}
          ></div>
        </div>
      </div>

      <style>{`
        @keyframes shrinkWidth {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
};

// Main Hook
export const useHorrorToast = () => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = "info") => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  // Stable removeToast function
  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const ToastContainer = useCallback(
    () => (
      <>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            id={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={removeToast}
          />
        ))}
      </>
    ),
    [toasts, removeToast]
  );

  return { showToast, ToastContainer };
};
