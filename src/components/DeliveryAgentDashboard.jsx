import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/SellerDashboard.css"; // ✅ Reusing same CSS for consistent design

const DeliveryAgentDashboard = () => {
  const [agent, setAgent] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAgentDetails = async () => {
      try {
        const authRes = await fetch(`${process.env.REACT_APP_API_BASE_URL}/delivery-agents/check-agent-auth`, {
          credentials: "include",
        });

        if (!authRes.ok) {
          navigate("/");
          return;
        }

        const { agentId } = await authRes.json();

        const dataRes = await fetch(`${process.env.REACT_APP_API_BASE_URL}/delivery-agents/${agentId}`);
        const agentData = await dataRes.json();

        setAgent(agentData);
      } catch (error) {
        console.error("Failed to fetch agent data:", error);
      }
    };

    fetchAgentDetails();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/delivery-agents/agent-logout`, {
        method: "POST",
        credentials: "include",
      });

      if (res.ok) {
        navigate("/");
      } else {
        alert("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="seller-dashboard">
      {/* Top Navbar */}
      <nav className="main-navbar">
        <div className="navbar-left">
          <div className="app-title">Grabzy-Hub</div>
          {agent && <div className="welcome-text">Welcome, {agent.name}</div>}
        </div>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </nav>

      {/* Info Bar */}
      {agent && (
        <div className="seller-info-bar">
          <span><strong>Name:</strong> {agent.name}</span>
          <span><strong>Phone:</strong> {agent.phoneNumber}</span>
          <span><strong>Approval:</strong> {agent.approved ? "Approved" : "Pending"}</span>
        </div>
      )}

      {/* Main Content */}
      {agent?.approved ? (
        <div className="action-buttons">
          <button onClick={() => navigate("/agent-current-orders")}>Current Orders</button>
          <button onClick={() => navigate("/agent-delivered-orders")}>Completed Orders</button>
        </div>
      ) : (
        <div style={{ textAlign: "center", marginTop: "40px", color: "#3D52A0", fontSize: "18px", fontWeight: "500" }}>
          Your account is not approved by any seller.
        </div>
      )}
    </div>
  );
};

export default DeliveryAgentDashboard;
