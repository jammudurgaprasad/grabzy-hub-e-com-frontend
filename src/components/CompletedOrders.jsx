import React, { useEffect, useState } from "react";
import axios from "axios";
import SellerNavbar from "./SellerNavbar";
import "../css/CompletedOrders.css";

const CompletedOrders = () => {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState({});
  const [agentMap, setAgentMap] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ✅ 1. Authenticate seller
      const authRes = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/seller/check-seller-auth`, {
        withCredentials: true,
      });
      const sellerId = authRes.data.userId;

      // ✅ 2. Fetch all orders
      const ordersRes = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/orders`);
      const allOrders = ordersRes.data;

      // ✅ 3. Filter only delivered orders
      const deliveredOrders = allOrders
        .filter(order => order.sellerId === sellerId && order.status === "DELIVERED")
        .sort((a, b) => b.orderId - a.orderId);
      setOrders(deliveredOrders);

        // ✅ 4. Get user info
        const usersRes = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/users`);
        const userMap = {};
        usersRes.data.forEach(user => {
          userMap[user.id] = user.email;
        });
        setUsers(userMap);

        // ✅ 5. Get agent-order mapping
        const agentOrdersRes = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/agent-orders`);
        const map = {};
        agentOrdersRes.data.forEach(ao => {
          if (ao.order && ao.deliveryAgent) {
            map[ao.order.orderId] = ao.deliveryAgent;
          }
        });
        setAgentMap(map);

      } catch (error) {
        console.error("Error fetching completed orders:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="completed-orders-page">
      <SellerNavbar />
      <div className="completed-orders-container">
        <h2 className="completed-orders-title">Completed Orders</h2>

        {orders.length === 0 ? (
          <p className="completed-orders-empty">No completed (delivered) orders found.</p>
        ) : (
          orders.map(order => (
            <div className="completed-order-card" key={order.orderId}>
              <img
                src={order.image1 || "https://via.placeholder.com/100"}
                alt="product"
                className="order-image"
              />

              <div className="order-details">
                <p><strong>{order.productName}</strong></p>
                <p>₹{order.discountPrice}</p>
                <p>Status: {order.status}</p>
                <p>Customer: {users[order.userId] || "Unknown User"}</p>
                <p>{order.receiverName}, {order.address}, {order.city}, {order.state}, {order.pincode}</p>
                {agentMap[order.orderId] ? (
                  <p><strong>Delivered by:</strong> {agentMap[order.orderId].name} ({agentMap[order.orderId].phoneNumber})</p>
                ) : (
                  <p><em>No agent info</em></p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CompletedOrders;
