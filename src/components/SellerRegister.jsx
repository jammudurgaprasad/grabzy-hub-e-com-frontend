// src/components/SellerRegister.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/SellerRegister.css";

const SellerRegister = () => {
  const [form, setForm] = useState({
    name: "",
    gmail: "",
    password: "",
    organizationName: "",
    gstNo: "",
    licenceNo: "",
    aadarNo: "",
    phoneNo: "",
    address: "",
    city: "",
    district: "",
    state: "",
    pinCode: ""
  });

  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async () => {
    const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/seller`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      alert("Seller registered successfully");
      navigate("/");
    } else {
      alert("Registration failed");
    }
  };

  return (
    <div className="register-form">
      <h2>Seller Registration</h2>
      {Object.keys(form).map((key) => (
        <input key={key} name={key} placeholder={key} value={form[key]} onChange={handleChange} />
      ))}
      <button onClick={handleRegister}>Register</button>
    </div>
  );
};

export default SellerRegister;
