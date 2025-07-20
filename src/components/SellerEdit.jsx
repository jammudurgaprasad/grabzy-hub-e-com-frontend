import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/SellerDashboard.css"; // Reusing the same CSS

const SellerEdit = () => {
  const [seller, setSeller] = useState(null);
  const [formData, setFormData] = useState({});
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

        const sellerRes = await fetch(`${process.env.REACT_APP_API_BASE_URL}/seller/${userId}`);
        const sellerData = await sellerRes.json();

        setSeller(sellerData);
        setFormData(sellerData);
      } catch (err) {
        console.error("Error loading seller data:", err);
        navigate("/");
      }
    };

    fetchSellerData();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleUpdate = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/seller/${seller.sellerId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("Seller updated successfully.");
        navigate("/seller/dashboard");
      } else {
        alert("Update failed.");
      }
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  const handleLogout = async () => {
    await fetch(`${process.env.REACT_APP_API_BASE_URL}/seller/seller-logout`, {
      method: "POST",
      credentials: "include",
    });
    navigate("/");
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

      {/* Form */}
      <div className="edit-form-container">
        <h2>Edit Seller Profile</h2>

        <div className="form-field">
          <label>Name:</label>
          <input
            name="name"
            value={formData.name || ""}
            onChange={handleChange}
          />
        </div>

        <div className="form-field">
          <label>Organization:</label>
          <input
            name="organizationName"
            value={formData.organizationName || ""}
            onChange={handleChange}
          />
        </div>

        <div className="form-field">
          <label>Phone:</label>
          <input
            name="phoneNo"
            value={formData.phoneNo || ""}
            onChange={handleChange}
          />
        </div>

        <div className="form-field">
          <label>Address:</label>
          <input
            name="address"
            value={formData.address || ""}
            onChange={handleChange}
          />
        </div>

        <div className="form-field">
          <label>City:</label>
          <input
            name="city"
            value={formData.city || ""}
            onChange={handleChange}
          />
        </div>

        <div className="form-field">
          <label>District:</label>
          <input
            name="district"
            value={formData.district || ""}
            onChange={handleChange}
          />
        </div>

        <div className="form-field">
          <label>State:</label>
          <input
            name="state"
            value={formData.state || ""}
            onChange={handleChange}
          />
        </div>

        <div className="form-field">
          <label>Pin Code:</label>
          <input
            name="pinCode"
            value={formData.pinCode || ""}
            onChange={handleChange}
          />
        </div>

        <button className="save-button" onClick={handleUpdate}>
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default SellerEdit;
