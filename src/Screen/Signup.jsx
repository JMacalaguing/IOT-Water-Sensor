import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios for API requests
import "../styles/App.css";

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    
    first_name: "",
    last_name: "",
    email: "",
    phone_number:"",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/signup/", {
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone_number: formData.phone_number,
        password: formData.password,
      });

      alert(response.data.message);
      navigate("/"); // Redirect to login
    } catch (error) {
      if (error.response) {
        setError(error.response.data.error || "Signup failed.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="container">
      <div className="login-box">
        <h2>CREATE ACCOUNT</h2>

        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSignup} className="form">

          <label>First Name:</label>
          <input type="text" name="first_name" placeholder="Enter your first name" required onChange={handleChange} />

          <label>Last Name:</label>
          <input type="text" name="last_name" placeholder="Enter your last name" required onChange={handleChange} />

          <label>Phone Number:</label>
          <input type="tel" name="phone_number" placeholder="Enter your Phone Number" required onChange={handleChange} />

          <label>Email:</label>
          <input type="email" name="email" placeholder="Enter your email" required onChange={handleChange} />
          
          <label>Password:</label>
          <input type="password" name="password" placeholder="Enter your password" required onChange={handleChange} />

          <label>Confirm Password:</label>
          <input type="password" name="confirmPassword" placeholder="Confirm password" required onChange={handleChange} />

          <div className="links">
            <Link to="/">Back to Login</Link>
          </div>

          <button type="submit">Sign Up</button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
