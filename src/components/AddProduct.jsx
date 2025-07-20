import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "../css/SellerDashboard.css";
import "../css/AddProduct.css";
import SellerNavbar from "./SellerNavbar";

const categoryOptions = {
  Clothing: ["Men", "Women", "Kids"],
  Electronics: ["Mobiles", "Laptops", "Accessories"],
  Footwear: ["Men", "Women", "Kids"],
  Home: ["Furniture", "Kitchen", "Decor"],
  Beauty: ["Makeup", "Skincare", "Haircare"],
};

const allSizes = [
  "XS", "S", "M", "L", "XL", "XXL",
  "28", "30", "32", "34", "36", "38", "40", "42", "44",
  "6", "7", "8", "9", "10", "11", "12"
];

const AddProduct = () => {
  const navigate = useNavigate();
  const { productId } = useParams(); // detect edit mode
  const [authChecked, setAuthChecked] = useState(false);
  const [sellerId, setSellerId] = useState(null);

  const [product, setProduct] = useState({
    productName: "",
    actualPrice: "",
    discountPercentage: "",
    discountPrice: "",
    description: "",
    category: "",
    subCategory: "",
    sizes: [],
    image1: "",
    image2: "",
    image3: "",
    image4: "",
  });

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_BASE_URL}/seller/check-seller-auth`, {
      withCredentials: true,
    }).then((res) => {
      setSellerId(Number(res.data.userId));
      setAuthChecked(true);
    }).catch(() => {
      navigate("/seller-login");
    });
  }, [navigate]);

  // 🔁 Load existing product for edit
  useEffect(() => {
    if (productId) {
      axios.get(`${process.env.REACT_APP_API_BASE_URL}/product/${productId}`)
        .then((res) => {
          setProduct(res.data);
        })
        .catch((err) => {
          console.error("Error loading product", err);
          alert("Failed to load product data.");
        });
    }
  }, [productId]);

  // useEffect(() => {
  //   const { actualPrice, discountPercentage } = product;
  //   if (actualPrice && discountPercentage) {
  //     const price = parseFloat(actualPrice);
  //     const discount = parseFloat(discountPercentage);
  //     if (!isNaN(price) && !isNaN(discount)) {
  //       const discounted = price - (price * discount) / 100;
  //       setProduct((prev) => ({
  //         ...prev,
  //         discountPrice: discounted.toFixed(2),
  //       }));
  //     }
  //   }
  // }, [product.actualPrice, product.discountPercentage]);

useEffect(() => {
  const { actualPrice, discountPercentage } = product;
  if (actualPrice && discountPercentage) {
    const price = parseFloat(actualPrice);
    const discount = parseFloat(discountPercentage);
    if (!isNaN(price) && !isNaN(discount)) {
      const discounted = price - (price * discount) / 100;
      setProduct((prev) => ({
        ...prev,
        discountPrice: discounted.toFixed(2),
      }));
    }
  }
}, [product]);



  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSizeChange = (e) => {
    const { value, checked } = e.target;
    setProduct((prev) => ({
      ...prev,
      sizes: checked
        ? [...prev.sizes, value]
        : prev.sizes.filter((size) => size !== value),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      ...product,
      actualPrice: parseFloat(product.actualPrice),
      discountPercentage: parseFloat(product.discountPercentage || 0),
      discountPrice: parseFloat(product.discountPrice || 0),
      seller: { sellerId },
    };

    const request = productId
      ? axios.put(`${process.env.REACT_APP_API_BASE_URL}/product/${productId}`, payload, { withCredentials: true })
      : axios.post(`${process.env.REACT_APP_API_BASE_URL}/product`, payload, { withCredentials: true });

    request
      .then(() => {
        alert(productId ? "Product updated successfully" : "Product added successfully");
        navigate("/seller/dashboard");
      })
      .catch((err) => {
        console.error("Error saving product:", err);
        alert("Error saving product.");
      });
  };

  if (!authChecked) return null;

  return (
    <div className="seller-dashboard">
      <SellerNavbar />
      <form onSubmit={handleSubmit} className="add-product-form">
        <h2>{productId ? "Edit Product" : "Add New Product"}</h2>

        <input name="productName" placeholder="Product Name" value={product.productName} onChange={handleChange} required />
        <input type="number" name="actualPrice" placeholder="Actual Price" value={product.actualPrice} onChange={handleChange} required />
        <input type="number" name="discountPercentage" placeholder="Discount %" value={product.discountPercentage} onChange={handleChange} />
        <input type="number" name="discountPrice" placeholder="Discount Price" value={product.discountPrice} readOnly />

        <textarea name="description" placeholder="Product Description" rows={4} value={product.description} onChange={handleChange} required />

        <select name="category" value={product.category} onChange={(e) => { handleChange(e); setProduct((prev) => ({ ...prev, subCategory: "" })); }} required>
          <option value="">Select Category</option>
          {Object.keys(categoryOptions).map((cat) => <option key={cat} value={cat}>{cat}</option>)}
        </select>

        <select name="subCategory" value={product.subCategory} onChange={handleChange} required disabled={!product.category}>
          <option value="">Select Sub-category</option>
          {product.category && categoryOptions[product.category].map((sub) => <option key={sub} value={sub}>{sub}</option>)}
        </select>

        <div className="size-options">
          <label>Select Sizes:</label>
          <div className="checkboxes">
            {allSizes.map((size) => (
              <label key={size}>
                <input
                  type="checkbox"
                  value={size}
                  checked={product.sizes.includes(size)}
                  onChange={handleSizeChange}
                />
                {size}
              </label>
            ))}
          </div>
        </div>

        <label>Image URLs:</label>
        <input name="image1" placeholder="Image URL 1" value={product.image1} onChange={handleChange} />
        <input name="image2" placeholder="Image URL 2" value={product.image2} onChange={handleChange} />
        <input name="image3" placeholder="Image URL 3" value={product.image3} onChange={handleChange} />
        <input name="image4" placeholder="Image URL 4" value={product.image4} onChange={handleChange} />

        <button type="submit">{productId ? "Update Product" : "Add Product"}</button>
      </form>
    </div>
  );
};

export default AddProduct;
