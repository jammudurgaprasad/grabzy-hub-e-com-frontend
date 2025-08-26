import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SellerNavbar from "./SellerNavbar";
import "../css/MyProducts.css";

const MyProducts = () => {
  const [products, setProducts] = useState([]);
  const [grouped, setGrouped] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const auth = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/seller/check-seller-auth`, {
          withCredentials: true,
        });

        const sellerId = auth.data.userId;

        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/product/seller/${sellerId}`);
        const sellerProducts = response.data;

        setProducts(sellerProducts);
        groupByCategory(sellerProducts);
      } catch (error) {
        console.error("Auth/Product fetch failed", error);
        navigate("/");
      }
    };

    fetchProducts();
  }, [navigate]);

  const groupByCategory = (products) => {
    const groupedData = {};

    products.forEach((product) => {
      const { category, subCategory } = product;

      if (!groupedData[category]) groupedData[category] = {};
      if (!groupedData[category][subCategory]) groupedData[category][subCategory] = [];

      groupedData[category][subCategory].push(product);
    });

    setGrouped(groupedData);
  };

  const handleDelete = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/product/${productId}`);
        const updated = products.filter((p) => p.productId !== productId);
        setProducts(updated);
        groupByCategory(updated);
      } catch (err) {
        console.error("Delete failed", err);
        alert("Failed to delete product.");
      }
    }
  };

  const handleEdit = (productId) => {
    navigate(`/edit-product/${productId}`);
  };

  // Helper to get first valid image
  const getFirstImage = (product) => {
    return product.image1 || product.image2 || product.image3 || product.image4 || "https://via.placeholder.com/150";
  };

  return (
    <div className="myprod-page">
      <SellerNavbar />
      <div className="myprod-container">
        <h2 className="myprod-title">My Products</h2>

        {Object.keys(grouped).length === 0 ? (
          <p className="myprod-no-products">No products found.</p>
        ) : (
          Object.entries(grouped).map(([category, subcats]) => (
            <div key={category} className="myprod-category">
              <h3 className="myprod-category-title">{category}</h3>
              {Object.entries(subcats).map(([subCategory, items]) => (
                <div key={subCategory} className="myprod-subcategory">
                  <h4 className="myprod-subcategory-title">{subCategory}</h4>
                  <div className="myprod-grid">
                    {items.map((product) => (
                      <div className="myprod-card" key={product.productId}>
                        <img
                          src={getFirstImage(product)}
                          alt={product.productName}
                          className="myprod-img"
                        />
                        <h5 className="myprod-name">{product.productName}</h5>
                        <p className="myprod-price">
                          ₹{product.discountPrice}{" "}
                          <span className="myprod-original">₹{product.actualPrice}</span>
                        </p>
                        <p className="myprod-sizes">
                          Sizes: {product.sizes && product.sizes.length > 0 ? product.sizes.join(", ") : "N/A"}
                        </p>
                        <div className="myprod-actions">
                          <button onClick={() => handleEdit(product.productId)}>Edit</button>
                          <button onClick={() => handleDelete(product.productId)}>Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyProducts;
