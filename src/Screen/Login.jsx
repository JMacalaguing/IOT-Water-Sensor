import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./../styles/App.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
  
    try {
      const response = await fetch("http://127.0.0.1:8000/api/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        localStorage.setItem("token", data.token); // Store token
        localStorage.setItem("user", JSON.stringify(data.user)); // Store user info
        navigate("/dashboard"); // Redirect to dashboard after login
      } else {
        setError(data.error || "Invalid email or password");
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
    }
  };
  
  return (
    <div className="container">
      <div className="login-box">
        <h2>WELCOME</h2>
        <p>WATER TEMP.</p>
        <div className="content">
          <div className="left">
            <img src="/b.png" alt="Logo" className="logo" />
          </div>
          <div className="divider"></div>
          <div className="right">
            <form onSubmit={handleSubmit}>
              {error && <p className="error">{error}</p>}
              <label>Email:</label>
              <input
                type="text"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label>Password:</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="links">
                <Link to="/forgot-password">Forgot Password?</Link>
                <Link to="/signup">Create Account</Link>
              </div>
              <button type="submit">Login</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
