import React, { useEffect, useState } from "react";
import axios from "axios";
import SellerNavbar from "./SellerNavbar";
import "../css/PendingOrders.css";

const PendingOrders = () => {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState({});
  const [agents, setAgents] = useState([]);
  const [selectedAgents, setSelectedAgents] = useState({});
  const [sellerId, setSellerId] = useState(null);
 

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Authenticate seller
        const authRes = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/seller/check-seller-auth`, {
          withCredentials: true,
        });

        const sellerId = authRes.data.userId;
        setSellerId(sellerId);

        // Fetch seller details
        const sellerRes = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/seller/${sellerId}`);
        const seller = sellerRes.data;

        // Fetch all orders
        const ordersRes = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/orders`);
        const allOrders = ordersRes.data;

        const filteredOrders = allOrders
          .filter(order => order.sellerId === sellerId && order.status === "PENDING")
          .sort((a, b) => a.orderId - b.orderId);
        setOrders(filteredOrders);

        // Fetch all users
        const usersRes = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/users`);
        const userMap = {};
        usersRes.data.forEach(user => {
          userMap[user.id] = user.email;
        });
        setUsers(userMap);

        // Fetch all delivery agents and filter by seller's pin code
        const agentsRes = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/delivery-agents`);
        const matchedAgents = agentsRes.data.filter(agent => agent.approved && agent.pinCode === seller.pinCode);
        setAgents(matchedAgents);

      } catch (error) {
        console.error("Error fetching pending orders data:", error);
      }
    };

    fetchData();
  }, []);

  const handleAgentChange = (orderId, agentId) => {
    setSelectedAgents(prev => ({
      ...prev,
      [orderId]: agentId,
    }));
  };

  const handleSubmit = async (orderId) => {
    const agentId = selectedAgents[orderId];
    if (!agentId) {
      alert("Please select an agent.");
      return;
    }

    // ✅ Log values
    console.log("Assigning Order:");
    console.log("Order ID:", orderId);
    console.log("Agent ID:", agentId);

    try {
      // 1. Assign order to agent
      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/agent-orders/assign`, null, {
        params: {
          agentId,
          orderId,
        },
      });

      // 2. Update order status to SHIPPED
      await axios.patch(`${process.env.REACT_APP_API_BASE_URL}/orders/${orderId}/status`, null, {
        params: {
          status: "SHIPPED",
        },
      });

      // 3. Refresh orders
      const updatedOrders = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/orders`);
      const filteredOrders = updatedOrders.data
        .filter(order => order.sellerId === sellerId && order.status === "PENDING")
        .sort((a, b) => a.orderId - b.orderId);
      setOrders(filteredOrders);

      alert("Order assigned and status updated to SHIPPED!");
    } catch (error) {
      console.error("Failed to assign agent:", error);
      alert("Failed to assign agent.");
    }
  };

  return (
    <div className="pending-orders-page">
      <SellerNavbar />
      <div className="pending-orders-container">
        <h2 className="pending-orders-title">Pending Orders</h2>

        {orders.length === 0 ? (
          <p className="pending-orders-empty">No pending orders found.</p>
        ) : (
          orders.map(order => (
            <div className="pending-order-card" key={order.orderId}>
              <img src={order.image1 || "https://via.placeholder.com/100"} alt="product" className="order-image" />

              <div className="order-details">
                <p><strong>{order.productName}</strong></p>
                <p>₹{order.discountPrice}</p>
                <p>Customer: {users[order.userId] || "Unknown User"}</p>
                <p>{order.receiverName}, {order.address}, {order.city}, {order.state}, {order.pincode}</p>
              </div>

              <div className="order-assign">
                <select
                  value={selectedAgents[order.orderId] || ""}
                  onChange={e => handleAgentChange(order.orderId, e.target.value)}
                >
                  <option value="">Select Agent</option>
                  {agents.map(agent => (
                    <option key={agent.agentId} value={agent.agentId}>
                      {agent.name} ({agent.phoneNumber})
                    </option>
                  ))}
                </select>
                <button onClick={() => handleSubmit(order.orderId)}>Submit</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PendingOrders;
