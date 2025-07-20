// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginTabs from "./components/LoginTabs";
import DeliveryAgentRegister from "./components/DeliveryAgentRegister";
import SellerRegister from "./components/SellerRegister";
import DeliveryAgentDashboard from "./components/DeliveryAgentDashboard";
import SellerDashboard from "./components/SellerDashboard";
import AdminDashboard from "./components/AdminDashboard";
import SellerEdit from './components/SellerEdit';
import AddProduct from "./components/AddProduct";
import MyProducts from "./components/MyProducts";
import "./css/App.css";
import PendingOrders from "./components/PendingOrders";
import Agents from "./components/Agents";
import ShippedOrders from "./components/ShippedOrders";
import CompletedOrders from "./components/CompletedOrders";
import CurrentOrders from "./components/CurrentOrders";
import AgentDelivered from "./components/AgentDelivered";

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<LoginTabs />} />
          <Route path="/delivery-agent/register" element={<DeliveryAgentRegister />} />
          <Route path="/seller/" element={<SellerRegister />} />
          <Route path="/delivery-agent/dashboard" element={<DeliveryAgentDashboard />} />
          <Route path="/seller/dashboard" element={<SellerDashboard />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/seller-edit" element={<SellerEdit />} />
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/my-products" element={<MyProducts />} />
          <Route path="/edit-product/:productId" element={<AddProduct />} />
          <Route path= "/pending-orders" element={<PendingOrders/>}/>
          <Route path= "/shipped-orders" element={<ShippedOrders/>}/>
          <Route path= "/completed-orders" element={<CompletedOrders/>}/>
          <Route path="/agents" element={<Agents />} />
          <Route path="/agent-current-orders" element={<CurrentOrders />} />
          <Route path="/agent-delivered-orders" element={<AgentDelivered />} />
          

        </Routes>
      </div>
    </Router>
  );
}

export default App;
