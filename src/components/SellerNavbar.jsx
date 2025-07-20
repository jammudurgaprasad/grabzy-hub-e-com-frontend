import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/SellerNavbar.css";

const SellerNavbar = () => {
  const [seller, setSeller] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSeller = async () => {
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

        const sellerRes = await fetch(`${process.env.REACT_APP_API_BASE_URL}/seller/${userId}`);
        const sellerData = await sellerRes.json();

        setSeller(sellerData);
      } catch (error) {
        console.error("Error fetching seller:", error);
        navigate("/");
      }
    };

    fetchSeller();
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
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <nav className="main-navbar">
      <div className="navbar-left">
        <div className="app-title">Grabzy-Hub</div>
        {seller && <div className="welcome-text">Welcome, {seller.name}</div>}
      </div>
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </nav>
  );
};

export default SellerNavbar;
