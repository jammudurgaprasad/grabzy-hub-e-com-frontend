import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/CurrentOrders.css";

const CurrentOrders = () => {
  const API_BASE = process.env.REACT_APP_API_BASE_URL;

  const [agentId, setAgentId] = useState(null);
  const [agentEmail, setAgentEmail] = useState(null);
  const [orders, setOrders] = useState([]);
  const [statusUpdates, setStatusUpdates] = useState({});

  // Fetch authenticated agent
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(`${API_BASE}/delivery-agents/check-agent-auth`, {
          withCredentials: true,
        });
        setAgentId(res.data.agentId);
        setAgentEmail(res.data.userEmail);
      } catch (error) {
        console.error("Auth failed:", error.response?.data || error.message);
      }
    };
    checkAuth();
  }, [API_BASE]);

  // Fetch orders for the agent
  useEffect(() => {
    if (agentId) {
      const fetchOrders = async () => {
        try {
          const res = await axios.get(`${API_BASE}/agent-orders/agent/${agentId}/active`);
          setOrders(res.data);
          console.log("Orders data:", res.data); // Debugging
        } catch (error) {
          console.error("Failed to fetch orders:", error.response?.data || error.message);
        }
      };
      fetchOrders();
    }
  }, [agentId, API_BASE]);

  const handleStatusChange = (orderId, newStatus) => {
    setStatusUpdates((prev) => ({
      ...prev,
      [orderId]: newStatus,
    }));
  };

  const handleSubmitStatus = async (orderId) => {
    const selectedStatus = statusUpdates[orderId];
    if (!selectedStatus) return;

    try {
      await axios.patch(`${API_BASE}/orders/${orderId}/status?status=${selectedStatus}`);
      // Refetch orders after update
      const res = await axios.get(`${API_BASE}/agent-orders/agent/${agentId}/active`);
      setOrders(res.data);
    } catch (error) {
      console.error("Failed to update status:", error.response?.data || error.message);
    }
  };

  return (
    <div className="orders-container">
      <h2 className="heading">Welcome, {agentEmail}</h2>

      {orders.length === 0 ? (
        <p>No active orders assigned.</p>
      ) : (
        <div className="orders-grid">
          {orders
            .filter((agentOrder) => 
              agentOrder.order.status !== "PENDING" && 
              agentOrder.order.status !== "DELIVERED"
            )
            .map((agentOrder) => {
              const order = agentOrder.order;
              return (
                <div className="order-card" key={agentOrder.id}>
                  <img src={order.image1} alt={order.productName} className="product-img" />
                  <h3>{order.productName}</h3>
                  <p><strong>Price:</strong> ₹{order.discountPrice.toFixed(2)}</p>
                  <p><strong>Status:</strong> {order.status}</p>
                  <p><strong>Receiver:</strong> {order.receiverName}</p>
                  <p><strong>Address:</strong> {order.address}, {order.city}, {order.state} - {order.pincode}</p>
                  <p><strong>Phone:</strong> {order.phoneNumber}</p>

                  <div className="status-update">
                    <select
                      value={statusUpdates[order.orderId] || ""}
                      onChange={(e) => handleStatusChange(order.orderId, e.target.value)}
                    >
                      <option value="">Update Status</option>
                      <option value="OUT_FOR_DELIVERY">Out for delivery</option>
                      <option value="DELIVERED">Delivered</option>
                    </select>
                    <button onClick={() => handleSubmitStatus(order.orderId)}>
                      Submit
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default CurrentOrders;