import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/AgentDelivered.css";

const AgentDelivered = () => {
  const API_BASE = process.env.REACT_APP_API_BASE_URL;

  const [agentId, setAgentId] = useState(null);
  const [deliveredOrders, setDeliveredOrders] = useState([]);
  useEffect(() => {
  const checkAuth = async () => {
    try {
      const res = await axios.get(`${API_BASE}/delivery-agents/check-agent-auth`, {
        withCredentials: true,
      });
      setAgentId(res.data.agentId);
    } catch (error) {
      console.error("Auth failed:", error.response?.data || error.message);
    }
  };

  checkAuth();
}, [API_BASE]); // ← added API_BASE here

  useEffect(() => {
  const fetchDeliveredOrders = async () => {
    if (!agentId) return;

    try {
      const res = await axios.get(`${API_BASE}/agent-orders/agent/${agentId}`);
      const deliveredOnly = res.data
        .filter(item => item.order.status === "DELIVERED")
        .sort((a, b) => b.order.orderId - a.order.orderId);
      setDeliveredOrders(deliveredOnly);
    } catch (error) {
      console.error("Error fetching delivered orders:", error.response?.data || error.message);
    }
  };

  fetchDeliveredOrders();
}, [agentId, API_BASE]); // ← added API_BASE here





  return (
    <div className="delivered-container">
      <h2 className="delivered-heading">Delivered Orders (Agent {agentId})</h2>

      {deliveredOrders.length === 0 ? (
        <p className="no-orders">No delivered orders found.</p>
      ) : (
        <div className="delivered-grid">
          {deliveredOrders.map((agentOrder) => {
            const order = agentOrder.order;

            return (
              <div key={agentOrder.id} className="delivered-card">
                <img
                  src={order.image1}
                  alt={order.productName}
                  className="delivered-img"
                />
                <h3>{order.productName}</h3>
                <p><strong>Order ID:</strong> {order.orderId}</p>
                <p><strong>Price:</strong> ₹{order.discountPrice.toFixed(2)}</p>
                <p><strong>Status:</strong> {order.status}</p>
                <p><strong>Receiver:</strong> {order.receiverName}</p>
                <p><strong>Address:</strong> {order.address}, {order.city}, {order.state} - {order.pincode}</p>
                <p><strong>Phone:</strong> {order.phoneNumber}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AgentDelivered;
