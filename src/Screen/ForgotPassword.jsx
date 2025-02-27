import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/forgot-password.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/forgot-password/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("A password reset link has been sent to your email.");
      } else {
        setError(data.error || "Email not found.");
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="container">
      <div className="forgot-password-box">
        <h2>Reset Password</h2>
        <p>Enter your email to receive a password reset link.</p>
        <form onSubmit={handleForgotPassword}>
          <label>Email:</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {error && <p className="error">{error}</p>}
          {message && <p className="success">{message}</p>}
          <button type="submit">Send Reset Link</button>
        </form>
        <Link to="/">Back to Login</Link>
      </div>
    </div>
  );
}

export default ForgotPassword;
