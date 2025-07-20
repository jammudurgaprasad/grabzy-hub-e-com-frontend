// src/components/AdminLogin.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/AdminLogin.css";

const AdminLogin = () => {
  const [gmail, setGmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    // You will implement backend later
    if (
      gmail === process.env.REACT_APP_ADMIN_GMAIL &&
      password === process.env.REACT_APP_ADMIN_PASSWORD
    ) {
      navigate("/admin/dashboard");
    }
else {
      alert("Invalid admin credentials");
    }
  };

  return (
    <div className="login-form">
      <h2>Admin Login</h2>
      <input type="text" placeholder="Gmail" value={gmail} onChange={(e) => setGmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default AdminLogin;
