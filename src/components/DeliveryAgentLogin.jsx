import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/DeliveryAgentLogin.css";

const DeliveryAgentLogin = () => {
  const [gmail, setGmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

const handleLogin = async () => {
  try {
    // Force logout seller if logged in
    await fetch(`${process.env.REACT_APP_API_BASE_URL}/seller/seller-logout`, {
      method: "POST",
      credentials: "include",
    });

    const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/delivery-agents/agent-login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gmail, password }),
      credentials: "include",
    });

    if (response.ok) {
      navigate("/delivery-agent/dashboard");
    } else {
      alert("Invalid credentials");
    }
  } catch (error) {
    console.error("Login failed:", error);
  }
};


  return (
    <div className="login-form">
      <h2>Delivery Agent Login</h2>
      <input type="text" placeholder="Gmail" value={gmail} onChange={(e) => setGmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
      <p onClick={() => navigate("/delivery-agent/register")} className="register-link">
        New Agent? Register
      </p>
    </div>
  );
};

export default DeliveryAgentLogin;
