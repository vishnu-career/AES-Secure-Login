import { useState } from "react";
import { login } from "./api";
import "./App.css"; // import css

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleLogin = async () => {
    try {
      const response = await login(username, password);
      setMsg(response.message || response);
    } catch (err) {
      setMsg("Error: " + err.message);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>AES Secure Login</h2>
        <input
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          placeholder="Password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>
        <p className="message">{msg}</p>
      </div>
    </div>
  );
}

export default App;
