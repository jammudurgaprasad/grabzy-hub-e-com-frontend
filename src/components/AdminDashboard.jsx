import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/AdminDashboard.css";

const AdminDashboard = () => {
  const [approvedSellers, setApprovedSellers] = useState([]);
  const [pendingSellers, setPendingSellers] = useState([]);

  useEffect(() => {
    fetchSellers();
  }, []);

  const fetchSellers = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/seller`);
      const allSellers = res.data;
      setApprovedSellers(allSellers.filter(seller => seller.approved));
      setPendingSellers(allSellers.filter(seller => !seller.approved));
    } catch (error) {
      console.error("Failed to fetch sellers:", error);
    }
  };

  const handleToggleApproval = async (seller) => {
    try {
      const endpoint = seller.approved
        ? `/seller/${seller.sellerId}/unapprove`
        : `/seller/${seller.sellerId}/approve`;

      await axios.put(`${process.env.REACT_APP_API_BASE_URL}${endpoint}`);

      // Refresh sellers list
      fetchSellers();
    } catch (error) {
      console.error("Error toggling seller approval:", error);
    }
  };

  return (
    <div className="dashboard-container">
      <h2>Welcome Admin!</h2>
      <p>This is your control panel. You'll manage sellers and agents here.</p>

      <div className="sellers-section">
        <h3>Approved Sellers</h3>
        {approvedSellers.length === 0 ? (
          <p>No approved sellers found.</p>
        ) : (
          approvedSellers.map(seller => (
            <div className="seller-card" key={seller.sellerId}>
              <p><strong>{seller.name}</strong> ({seller.organizationName})</p>
              <p>{seller.gmail}</p>
              <p>{seller.phoneNo}</p>
              <button onClick={() => handleToggleApproval(seller)}>Unapprove</button>
            </div>
          ))
        )}
      </div>

      <div className="sellers-section">
        <h3>Pending Sellers</h3>
        {pendingSellers.length === 0 ? (
          <p>No pending sellers found.</p>
        ) : (
          pendingSellers.map(seller => (
            <div className="seller-card" key={seller.sellerId}>
              <p><strong>{seller.name}</strong> ({seller.organizationName})</p>
              <p>{seller.gmail}</p>
              <p>{seller.phoneNo}</p>
              <button onClick={() => handleToggleApproval(seller)}>Approve</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
