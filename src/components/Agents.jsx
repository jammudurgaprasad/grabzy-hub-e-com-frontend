import React, { useEffect, useState } from "react";
import axios from "axios";
import SellerNavbar from "./SellerNavbar";
import "../css/Agents.css";

const Agents = () => {
  const [approvedAgents, setApprovedAgents] = useState([]);
  const [pendingAgents, setPendingAgents] = useState([]);
  const [sellerPin, setSellerPin] = useState("");

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        // Step 1: Check seller auth
        const authRes = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/seller/check-seller-auth`, {
          withCredentials: true,
        });

        const sellerId = authRes.data.userId;

        // Step 2: Get seller details
        const sellerRes = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/seller/${sellerId}`);
        const seller = sellerRes.data;
        setSellerPin(seller.pinCode);

        // Step 3: Fetch all agents
        const agentRes = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/delivery-agents`);
        const agents = agentRes.data;

        const approved = agents.filter(agent => agent.approved && agent.pinCode === seller.pinCode);
        const pending = agents.filter(agent => !agent.approved && agent.pinCode === seller.pinCode);

        setApprovedAgents(approved);
        setPendingAgents(pending);
      } catch (error) {
        console.error("Error loading agents:", error);
      }
    };

    fetchAgents();
  }, []);

  const handleToggleApproval = async (agent) => {
    try {
      if (agent.approved) {
        // "Unapprove" by deleting agent (or create an unapprove API if needed)
        await axios.put(`${process.env.REACT_APP_API_BASE_URL}/delivery-agents/${agent.agentId}/unapprove`);
      } else {
        // Approve agent
        await axios.put(`${process.env.REACT_APP_API_BASE_URL}/delivery-agents/${agent.agentId}/approve`);
      }

      // Refresh agents list
      const updatedAgents = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/delivery-agents`);
      const filteredApproved = updatedAgents.data.filter(a => a.approved && a.pinCode === sellerPin);
      const filteredPending = updatedAgents.data.filter(a => !a.approved && a.pinCode === sellerPin);

      setApprovedAgents(filteredApproved);
      setPendingAgents(filteredPending);
    } catch (error) {
      console.error("Error toggling agent approval:", error);
    }
  };

  return (
    <div className="agents-page">
      <SellerNavbar />
      <div className="agents-container">
        <h2 className="agents-title">Delivery Agents</h2>
        <div className="agents-columns">
          {/* Approved Agents */}
          <div className="agents-list approved">
            <h3>Approved Agents</h3>
            {approvedAgents.length === 0 ? (
              <p>No approved agents found.</p>
            ) : (
              approvedAgents.map(agent => (
                <div className="agent-card" key={agent.agentId}>
                  <p><strong>{agent.name}</strong></p>
                  <p>{agent.gmail}</p>
                  <p>{agent.phoneNumber}</p>
                  <button onClick={() => handleToggleApproval(agent)}>Unapprove</button>
                </div>
              ))
            )}
          </div>

          {/* Pending Approval Agents */}
          <div className="agents-list pending">
            <h3>Agent Requests</h3>
            {pendingAgents.length === 0 ? (
              <p>No pending agents found.</p>
            ) : (
              pendingAgents.map(agent => (
                <div className="agent-card" key={agent.agentId}>
                  <p><strong>{agent.name}</strong></p>
                  <p>{agent.gmail}</p>
                  <p>{agent.phoneNumber}</p>
                  <button onClick={() => handleToggleApproval(agent)}>Approve</button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Agents;
