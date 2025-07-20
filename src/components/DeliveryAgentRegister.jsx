// src/components/DeliveryAgentRegister.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/DeliveryAgentRegister.css";

const DeliveryAgentRegister = () => {
  const [form, setForm] = useState({
    name: "",
    gmail: "",
    password: "",
    drivingLicence: "",
    aadharNumber: "",
    phoneNumber: "",
    address: "",
    city: "",
    district: "",
    state: "",
    pinCode: ""
  });

  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async () => {
    const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/delivery-agents/agent-register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      alert("Registered successfully");
      navigate("/");
    } else {
      alert("Registration failed");
    }
  };

  return (
    <div className="register-form">
      <h2>Delivery Agent Registration</h2>
      {Object.keys(form).map((key) => (
        <input key={key} name={key} placeholder={key} value={form[key]} onChange={handleChange} />
      ))}
      <button onClick={handleRegister}>Register</button>
    </div>
  );
};

export default DeliveryAgentRegister;
