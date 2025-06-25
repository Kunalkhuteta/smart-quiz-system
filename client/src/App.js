import axios from "axios";
import { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    axios.get("/api/test")
      .then(res => setMessage(res.data.msg))
      .catch(err => {
        console.error("Axios error:", err.message);
        setMessage("❌ Could not connect to backend");
      });
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Smart Quiz System</h1>
      <p>{message}</p>
    </div>
  );
}

export default App;
