// src/components/LoginTabs.jsx
import React, { useState } from "react";
import DeliveryAgentLogin from "./DeliveryAgentLogin";
import SellerLogin from "./SellerLogin";
import AdminLogin from "./AdminLogin";
import "../css/LoginTabs.css";

function LoginTabs() {
  const [activeTab, setActiveTab] = useState("agent");

  const renderLoginSection = () => {
    switch (activeTab) {
      case "agent":
        return <DeliveryAgentLogin />;
      case "seller":
        return <SellerLogin />;
      case "admin":
        return <AdminLogin />;
      default:
        return null;
    }
  };

  return (
    <div className="login-tabs-container">
      <h1 className="grabzy-title">Grabzy Hub</h1>
      <a href="https://grabzy-e-com-frontend.netlify.app/" target="_blank" rel="noopener noreferrer">
        Visit Grabzy!
      </a>
      <div className="tab-buttons">
        <button className={activeTab === "agent" ? "active" : ""} onClick={() => setActiveTab("agent")}>
          Delivery Agent
        </button>
        <button className={activeTab === "seller" ? "active" : ""} onClick={() => setActiveTab("seller")}>
          Seller
        </button>
        <button className={activeTab === "admin" ? "active" : ""} onClick={() => setActiveTab("admin")}>
          Admin
        </button>
      </div>
      <div className="login-section">{renderLoginSection()}</div>
    </div>
  );
}

export default LoginTabs;
