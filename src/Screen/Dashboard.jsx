import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { useNavigate } from "react-router-dom";
import useWebSocket from "../hooks/useWebSocket";
import "./../styles/Dashboard.css";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function Dashboard() {
  const navigate = useNavigate();
  const socketUrl = "ws://172.20.8.36:8765";
  const authToken = "secure_handshake_token"; // Ensure this matches the server
  const sensorData = useWebSocket(socketUrl, authToken);

  const [user, setUser] = useState(null); // Initialize user state

  useEffect(() => {
    // Retrieve user data from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate("/"); // Redirect to login if no user is found
    }
  }, [navigate]);

  const [temperatureData, setTemperatureData] = useState({
    labels: [],
    datasets: [
      {
        label: "Water Temperature (°C)",
        data: [],
        borderColor: "blue",
        backgroundColor: "rgba(0, 0, 255, 0.2)",
        tension: 0.3,
      },
    ],
  });

  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (sensorData) {
      setTemperatureData((prevData) => {
        const newTemp = sensorData.temperature;
        const newLabels = [...prevData.labels, new Date().toLocaleTimeString().slice(0, 5)];
        const newData = [...prevData.datasets[0].data, newTemp];

        return {
          labels: newLabels.slice(-10),
          datasets: [{ ...prevData.datasets[0], data: newData.slice(-10) }],
        };
      });
    }
  }, [sensorData]);

  const handleLogout = () => {
    localStorage.removeItem("user"); 
    localStorage.removeItem("token"); 
    navigate("/"); 
  };

  return (
    <div className="dashboard">
      {/* Sidebar Section */}
      <aside className="sidebar">
        <div className="logo">
          <img src="/b.png" alt="Water Temp. Corp." />
          <h2>WATER TEMP. CORP.</h2>
        </div>
        <div className="user-info">
          <img src="/c.png" alt="User" />
          <p>{user ? `${user.first_name} ${user.last_name}` : "Guest"}</p>
        </div>
        <nav>
          <ul>
            <li>Dashboard</li>
            <li>Records</li>
            <li>Device Reading</li>
          </ul>
        </nav>
        <button className="logout-btn" onClick={handleLogout}>
          LOG OUT
        </button>
      </aside>

      {/* Main Content Section */}
      <main className="main-content">
        <h2>PAST READING</h2>

        <p>📅 {new Date().toLocaleDateString()} | ⏰ {currentTime}</p>

        {/* Display Real-Time Data */}
        <div className="data-display">
          <div className="humidity">
            <img src="/e.png" alt="Humidity" />
            <p>HUMIDITY <br /> <strong>{sensorData?.humidity ?? "Loading..."}%</strong></p>
          </div>
          <div className="temperature">
            <img src="/d.png" alt="Temperature" />
            <p>
              TEMPERATURE <br />
              <strong>{sensorData?.temperature ?? "Loading..."}°C</strong>
            </p>
          </div>
        </div>

        {/* Temperature Graph */}
        <div className="chart">
          <h3>Water Temperature Graph (°C)</h3>
          <Line data={temperatureData} />
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
