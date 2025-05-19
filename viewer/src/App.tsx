import React, { useEffect, useState } from "react";

import VehicleMap from "./components/Map";
import "./App.css";

const App: React.FC = () => {
  const [time, setTime] = useState<string>(new Date().toUTCString());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toUTCString());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            alignItems: "center",
          }}
        >
          <h1>Viewer</h1>
          <div style={{ fontSize: "1rem" }}>{time}</div>
        </div>
      </header>
      <VehicleMap />
    </div>
  );
};

export default App;
