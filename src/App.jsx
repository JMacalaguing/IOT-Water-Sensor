import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Screen/Login";
import Signup from "./Screen/Signup";
import Dashboard from "./Screen/Dashboard";
import ForgotPassword from "./Screen/ForgotPassword";
import TemperatureDisplay from "./components/TemperatureDisplay";
import ProtectedRoute from "./components/ProtectedRoute"; // Import ProtectedRoute
import "./styles/App.css";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected Dashboard Route */}
        <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />

        <Route
          path="/temperature"
          element={
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
              <TemperatureDisplay />
            </div>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
