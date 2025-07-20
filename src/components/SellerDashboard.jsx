import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/SellerDashboard.css";

const SellerDashboard = () => {
  const [seller, setSeller] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSellerData = async () => {
      try {
        const authRes = await fetch(`${process.env.REACT_APP_API_BASE_URL}/seller/check-seller-auth`, {
          method: "GET",
          credentials: "include",
        });

        if (!authRes.ok) {
          navigate("/");
          return;
        }

        const { userId } = await authRes.json();

        const sellerRes = await fetch(`${process.env.REACT_APP_API_BASE_URL}/seller/${userId}`, {
          method: "GET",
        });

        const sellerData = await sellerRes.json();
        setSeller(sellerData);
      } catch (error) {
        console.error("Error fetching seller:", error);
        navigate("/");
      }
    };

    fetchSellerData();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/seller/seller-logout`, {
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
      {/* Navbar */}
      <nav className="main-navbar">
        <div className="navbar-left">
          <div className="app-title">Grabzy-Hub</div>
          {seller && <div className="welcome-text">Welcome, {seller.name}</div>}
        </div>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </nav>

      {/* Horizontal Info Bar */}
      {seller && (
        <div className="seller-info-bar">
          <span><strong>Name:</strong> {seller.name}</span>
          <span><strong>Organization:</strong> {seller.organizationName}</span>
          <span><strong>Status:</strong> {seller.approved ? "Approved" : "Pending"}</span>
          <button className="edit-button" onClick={() => navigate("/seller-edit")}>Edit</button>
        </div>
      )}

      {/* Action Buttons (No container div) */}
      {seller?.approved && (
        <div className="action-buttons">
           <button onClick={() => navigate("/add-product")}>Add Product</button>
          <button onClick={() => navigate("/my-products")}>My Products</button>
          <button onClick={() => navigate("/pending-orders")}>Pending Orders</button>
          <button onClick={() => navigate("/shipped-orders")}>Shipped Orders</button>
          <button onClick={() => navigate("/completed-orders")}>Completed Orders</button>
          <button onClick={() => navigate("/agents")}>Agents</button>
        </div>
      )}
      
    </div>
  );
};

export default SellerDashboard;
