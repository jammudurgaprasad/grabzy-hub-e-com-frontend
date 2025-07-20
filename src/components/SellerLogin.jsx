// src/components/SellerLogin.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/SellerLogin.css";

const SellerLogin = () => {
  const [gmail, setGmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

const handleLogin = async () => {
  try {
    // Force logout delivery agent if logged in
    await fetch(`${process.env.REACT_APP_API_BASE_URL}/delivery-agents/agent-logout`, {
      method: "POST",
      credentials: "include",
    });

    const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/seller/seller-login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gmail, password }),
      credentials: "include",
    });

    if (response.ok) {
      navigate("/seller/dashboard");
    } else {
      alert("Invalid credentials");
    }
  } catch (error) {
    console.error("Login failed:", error);
  }
};


  return (
    <div className="login-form">
      <h2>Seller Login</h2>
      <input type="text" placeholder="Gmail" value={gmail} onChange={(e) => setGmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
      <p className="register-link" onClick={() => navigate("/seller")}>New Seller? Register</p>
    </div>
  );
};

export default SellerLogin;
