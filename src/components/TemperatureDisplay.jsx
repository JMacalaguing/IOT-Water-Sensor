import React from "react";
import useWebSocket from "../hooks/useWebSocket";

const TemperatureDisplay = () => {
  const { temperature, isConnected } = useWebSocket("ws://172.20.9.209:8765");

  return (
    <div className="p-4 rounded-lg shadow-md bg-white text-center">
      <h2 className="text-xl font-bold">Real-Time Temperature</h2>
      {isConnected ? (
        <p className="text-3xl font-semibold text-blue-500">
          {temperature ? `${temperature}°C` : "Loading..."}
        </p>
      ) : (
        <p className="text-red-500">Disconnected</p>
      )}
    </div>
  );
};

export default TemperatureDisplay;
