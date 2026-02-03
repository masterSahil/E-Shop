import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { FaSave, FaArrowLeft, FaCheckCircle, FaTimesCircle, FaTimes, FaCloudUploadAlt } from 'react-icons/fa';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // --- LOGIC STATES ---
  const [product, setProduct] = useState({
    name: '',
    desc: '',
    price: '',
    image: '',
    inStock: true,
  });
  const [previewImage, setPreviewImage] = useState(null);

  // --- UI STATES (New) ---
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  // --- HELPER: NOTIFICATION ---
  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification(prev => ({ ...prev, show: false })), 3000);
  };

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_GET_SINGLE_PRODUCT_URL}/${id}`);
      const { name, desc, price, image, inStock } = res.data.product;
      setProduct({ name, desc, price, image, inStock });
      setPreviewImage(`${import.meta.env.VITE_PRODUCT_IMAGE_URL}/${image}`);
    } catch (err) {
      console.error("Error fetching product:", err);
      showNotification("Failed to fetch product data", "error");
    }
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  const handleChange = (e) => {
    const { name, type, value, files, checked } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: type === "file" ? files[0]
        : type === "checkbox" ? checked
        : value
    }));

    if (type === 'file') {
      const file = files[0];
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const updateProduct = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('name', product.name);
      formData.append('desc', product.desc);
      formData.append('price', product.price);
      formData.append('inStock', product.inStock ? 'true' : 'false');
      if (product.image instanceof File) {
        formData.append('image', product.image);
      }

      // 1. Update product info
      await axios.put(`${import.meta.env.VITE_PRODUCT_URL}/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // 2. Fetch productId
      const productRes = await axios.get(`${import.meta.env.VITE_GET_SINGLE_PRODUCT_URL}/${id}`);
      const productId = productRes.data.product.productId;

      // 3. Bulk update carts
      await axios.put(`${import.meta.env.VITE_CART_URL}/product/${productId}`, {
        inStock: product.inStock,
        quantity: 1
      });

      showNotification("Product and carts updated!", "success");
      
      // Delay navigation slightly so user sees success message
      setTimeout(() => {
        navigate('/admin');
      }, 1000);

    } catch (err) {
      console.error("Error updating product:", err);
      showNotification("Error updating product. Please try again.", "error");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-green-50/50 font-sans selection:bg-emerald-200 py-10 px-4 relative">
      
      {/* --- NOTIFICATION COMPONENT --- */}
      <div className={`fixed top-6 right-6 z-50 transition-all duration-500 transform 
          ${notification.show ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
        <div className={`flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl border-l-4 backdrop-blur-md bg-white/95
          ${notification.type === 'success' ? 'border-emerald-500' : 'border-red-500'}`}>
          {notification.type === 'success' ? <FaCheckCircle className="text-emerald-500 text-xl" /> : <FaTimesCircle className="text-red-500 text-xl" />}
          <div>
            <h4 className={`font-bold text-sm ${notification.type === 'success' ? 'text-emerald-800' : 'text-red-800'}`}>
              {notification.type === 'success' ? 'Success' : 'Error'}
            </h4>
            <p className="text-gray-600 text-xs font-medium">{notification.message}</p>
          </div>
          <button onClick={() => setNotification(prev => ({...prev, show: false}))} className="ml-4 text-gray-400 hover:text-gray-600">
            <FaTimes />
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-emerald-900 flex items-center gap-2">
              Edit Product <span className="text-2xl">✏️</span>
            </h1>
            <p className="text-emerald-600/80 text-sm mt-1">Update inventory details below.</p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-5 py-2.5 bg-white text-emerald-700 border border-emerald-200 rounded-xl hover:bg-emerald-50 hover:shadow-md transition-all font-semibold text-sm"
          >
            <FaArrowLeft /> Back
          </button>
        </div>

        {/* Main Form Card */}
        <div className="bg-white shadow-xl rounded-3xl border border-emerald-100 overflow-hidden">
          <form onSubmit={updateProduct} className="grid grid-cols-1 md:grid-cols-12">
            
            {/* Left Column: Image */}
            <div className="md:col-span-5 bg-emerald-50/50 p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-emerald-100 relative">
              <label className="block text-sm font-bold text-emerald-800 uppercase tracking-wide mb-4 w-full text-left">Product Image</label>
              
              <div className="relative group w-full aspect-square bg-white rounded-2xl border-2 border-dashed border-emerald-200 flex items-center justify-center overflow-hidden hover:border-emerald-400 transition-colors">
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="w-full h-full object-contain p-4 mix-blend-multiply"
                  />
                ) : (
                  <div className="text-center text-emerald-400">
                    <FaCloudUploadAlt className="text-5xl mx-auto mb-2" />
                    <span className="text-sm font-medium">No Image Selected</span>
                  </div>
                )}
                
                {/* Overlay for Click */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors cursor-pointer" 
                     onClick={() => fileInputRef.current.click()}></div>
              </div>

              <input
                type="file"
                name="image"
                ref={fileInputRef}
                onChange={handleChange}
                className="hidden"
              />
              
              <button 
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="mt-4 text-sm font-semibold text-emerald-600 hover:text-emerald-800 hover:underline cursor-pointer"
              >
                Change Image
              </button>
            </div>

            {/* Right Column: Details */}
            <div className="md:col-span-7 p-8 space-y-6">
              
              {/* Name */}
              <div className="group">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 ml-1">Product Name</label>
                <input
                  type="text"
                  name="name"
                  value={product.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none"
                  placeholder="Enter product name"
                />
              </div>

              {/* Price & Stock Row */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 ml-1">Price (₹)</label>
                  <input
                    type="number"
                    name="price"
                    value={product.price}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none"
                  />
                </div>
                
                <div className="flex flex-col justify-end pb-3">
                  <label className="flex items-center gap-3 p-3 border border-emerald-100 rounded-xl bg-emerald-50/30 cursor-pointer hover:bg-emerald-50 transition-colors">
                    <input
                      type="checkbox"
                      name="inStock"
                      checked={product.inStock}
                      onChange={handleChange}
                      className="h-5 w-5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500 accent-emerald-600"
                    />
                    <span className="text-sm font-bold text-emerald-900">Available in Stock</span>
                  </label>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 ml-1">Description</label>
                <textarea
                  name="desc"
                  rows="5"
                  value={product.desc}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none resize-none"
                ></textarea>
              </div>

              {/* Action Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-200 hover:bg-emerald-700 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                     <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  ) : (
                     <>
                       <FaSave /> Save Changes
                     </>
                  )}
                </button>
              </div>

            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;