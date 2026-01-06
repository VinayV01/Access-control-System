import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { login } from "../auth/auth";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setError("");

    try {
      const res = await api.post("login/", {
        username,
        password,
      });

      login(res.data.access);

      try {
        await api.get("admin/audit-logs/");
        navigate("/admin");
      } catch {
        navigate("/dashboard");
      }

    } catch {
      setError("Invalid username or password");
    }
  };

  return (
  <div className="login-page">
    <h1 className="app-title">Access Control System</h1>

    <div className="login-card">
      <h2>Sign In</h2>

      {error && <div className="error">{error}</div>}

      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleSubmit}>Login</button>
    </div>
  </div>
);

}
