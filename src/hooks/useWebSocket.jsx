import { useState, useEffect, useRef } from "react";

const useWebSocket = (url, reconnectInterval = 5000, updateInterval = 5000) => {
  const [data, setData] = useState(null);
  const wsRef = useRef(null);
  const reconnectRef = useRef(null);
  const lastUpdateRef = useRef(0); // Track last state update time

  const connectWebSocket = () => {
    if (wsRef.current) {
      console.log("Closing existing WebSocket connection...");
      wsRef.current.close();
    }

    console.log("Connecting to WebSocket:", url);
    wsRef.current = new WebSocket(url);

    wsRef.current.onopen = () => {
      console.log("✅ WebSocket connected to:", url);

      if (reconnectRef.current) {
        clearTimeout(reconnectRef.current);
        reconnectRef.current = null;
      }

      wsRef.current.send("HANDSHAKE_REQUEST");
    };

    wsRef.current.onmessage = (event) => {
      try {
        const parsedData = JSON.parse(event.data);
        const now = Date.now();

        // Process only if 5 seconds have passed since the last update
        if (now - lastUpdateRef.current >= updateInterval) {
          lastUpdateRef.current = now; // Update the last processed time
          console.log("📩 WebSocket received (updating state):", parsedData);
          setData(parsedData);
        } else {
          console.log("⏳ Skipping update (waiting 5 sec)");
        }
      } catch (error) {
        console.error("❌ WebSocket parsing error:", error);
      }
    };

    wsRef.current.onclose = (event) => {
      console.warn("⚠️ WebSocket closed:", event.reason || "Unknown reason");

      if (event.code !== 1000) {
        if (!reconnectRef.current) {
          console.log(`🔄 Attempting reconnect in 5 seconds...`);
          reconnectRef.current = setTimeout(() => {
            console.log("🔁 Reconnecting now...");
            connectWebSocket();
          }, 5000);
        }
      }
    };

    wsRef.current.onerror = (error) => {
      console.error("❌ WebSocket error:", error);
      wsRef.current.close();
    };
  };

  useEffect(() => {
    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.onclose = null;
        wsRef.current.close();
      }
      if (reconnectRef.current) {
        clearTimeout(reconnectRef.current);
      }
    };
  }, [url]);

  return data;
};

export default useWebSocket;
