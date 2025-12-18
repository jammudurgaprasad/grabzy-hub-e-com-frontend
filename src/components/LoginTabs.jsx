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


      <div>
        <h3>Demo Access & Workflow Information</h3>

        <p><strong>Admin Credentials (for demo/testing):</strong></p>
        <ul>
          <li>Admin Email: <code>y22cm062@rvrjc.ac.in</code></li>
          <li>Admin Password: <code>y22cm062</code></li>
        </ul>

        <h4>Seller Registration & Approval Flow</h4>
        <ol>
          <li>Register as a <strong>Seller</strong> using the seller registration option.</li>
          <li>After registration, go to <strong>Admin Login</strong>.</li>
          <li>Login using the above admin credentials.</li>
          <li>The admin can view all registered sellers.</li>
          <li>The admin has the authority to <strong>approve</strong> or <strong>reject</strong> seller requests.</li>
          <li>Once approved, the seller dashboard is updated.</li>
          <li>Approved sellers can:
            <ul>
              <li>Add products</li>
              <li>Edit products</li>
              <li>Delete products</li>
              <li>Manage seller-related operations</li>
            </ul>
          </li>
        </ol>

        <h4>Delivery Agent Registration & Assignment</h4>
        <ol>
          <li>Delivery agents register by providing their <strong>pincode</strong>.</li>
          <li>The backend matches the delivery agent’s pincode with the seller’s region.</li>
          <li>Only delivery agents from the same region are visible to the seller.</li>
          <li>Sellers can:
            <ul>
              <li>View available delivery agents</li>
              <li>Approve delivery agent requests</li>
              <li>Reject delivery agent requests</li>
            </ul>
          </li>
        </ol>

        <p><em>This project demonstrates role-based access control and approval workflows for Admin, Seller, and Delivery Agent roles.</em></p>
      </div>

    </div>
  );
}

export default LoginTabs;
