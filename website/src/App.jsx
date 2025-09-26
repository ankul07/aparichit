import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import HorrorStarter from "./page/HorrorStarter";
import AparichitVaani from "./page/AparichitVaani";
import Auth from "./page/Auth";
import AparadhDetails from "./page/AparadhDetails";
import AntimVaani from "./page/AntimVaani";
import GarudPuran from "./page/GarudPuran";
import AllComplaints from "./page/AllComplaints";

// Protected Route Component for authenticated users only
const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("authToken");
      const userData = localStorage.getItem("userData");

      // Check if both token and userData exist and userData is valid JSON
      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setIsAuthenticated(!!parsedUser.id || !!parsedUser._id);
        } catch (error) {
          console.error("Invalid userData in localStorage:", error);
          // Clear invalid data
          localStorage.removeItem("authToken");
          localStorage.removeItem("userData");
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  // Show loading while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="h-screen w-screen bg-black flex items-center justify-center">
        <div className="text-red-200 text-center">
          <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="rubik-glitch-regular">प्रमाणीकरण जाँच...</div>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/auth" replace />;
};

// Public Route Component for non-authenticated users only
const PublicRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("authToken");
      const userData = localStorage.getItem("userData");

      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setIsAuthenticated(!!parsedUser.id || !!parsedUser._id);
        } catch (error) {
          console.error("Invalid userData in localStorage:", error);
          localStorage.removeItem("authToken");
          localStorage.removeItem("userData");
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  // Show loading while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="h-screen w-screen bg-black flex items-center justify-center">
        <div className="text-red-200 text-center">
          <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="rubik-glitch-regular">प्रमाणीकरण जाँच...</div>
        </div>
      </div>
    );
  }

  // If user is authenticated and trying to access public routes, redirect to aparadh-detail
  if (isAuthenticated) {
    return <Navigate to="/aparadh-detail" replace />;
  }

  return <>{children}</>;
};

// Mixed Access Route Component (accessible to both authenticated and non-authenticated users)
const MixedRoute = ({ children }) => {
  return <>{children}</>;
};

const App = () => {
  return (
    <>
      <Routes>
        {/* Public Routes - Only for non-authenticated users */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <HorrorStarter />
            </PublicRoute>
          }
        />
        <Route
          path="/aparichit-vaani"
          element={
            <PublicRoute>
              <AparichitVaani />
            </PublicRoute>
          }
        />
        <Route
          path="/auth"
          element={
            <PublicRoute>
              <Auth />
            </PublicRoute>
          }
        />

        {/* Protected Routes - Only for authenticated users */}
        <Route
          path="/aparadh-detail"
          element={
            <ProtectedRoute>
              <AparadhDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/antim-vaani"
          element={
            <ProtectedRoute>
              <AntimVaani />
            </ProtectedRoute>
          }
        />

        {/* Mixed Access Routes - Accessible to all users */}
        <Route
          path="/garuda-purana"
          element={
            <MixedRoute>
              <GarudPuran />
            </MixedRoute>
          }
        />
        <Route
          path="/all-complaints"
          element={
            <MixedRoute>
              <AllComplaints />
            </MixedRoute>
          }
        />

        {/* Catch all route - redirect based on authentication */}
        <Route
          path="*"
          element={
            <Navigate
              to={
                localStorage.getItem("authToken") &&
                localStorage.getItem("userData")
                  ? "/aparadh-detail"
                  : "/"
              }
              replace
            />
          }
        />
      </Routes>
    </>
  );
};

export default App;
