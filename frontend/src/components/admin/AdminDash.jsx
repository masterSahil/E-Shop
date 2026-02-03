import React, { useEffect, useRef, useState } from 'react';
import Navbar from '../main/Navbar';
import axios from 'axios';
import { 
  FaEdit, FaPlus, FaTrash, FaLeaf, FaExclamationCircle, 
  FaSearch, FaBoxOpen, FaClipboardList, FaCheckCircle, FaTimesCircle, FaTimes 
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const AdminDash = () => {
  // --- STATE ---
  const [data, setData] = useState({ image: '', name: '', desc: '', price: '' });
  const [productsData, setProductsData] = useState([]);
  const [errors, setErrors] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('add');
  
  // Loading State (Professional UX)
  const [isLoading, setIsLoading] = useState(false);

  // --- CUSTOM NOTIFICATION STATE ---
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' }); // type: 'success' | 'error'

  // --- CUSTOM MODAL STATE ---
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // --- HELPER: TRIGGER NOTIFICATION ---
  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    // Auto-hide after 3 seconds
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  // --- VALIDATION ---
  const validate = () => {
    const newErrors = {};
    if (!data.name.trim()) newErrors.name = "Product name is required.";
    if (!data.price || data.price <= 0) newErrors.price = "Price must be greater than 0.";
    if (!data.desc.trim()) newErrors.desc = "Description is required.";
    if (!data.image) newErrors.image = "Product image is required.";
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      showNotification("Please check the form for errors.", "error");
    }
    return Object.keys(newErrors).length === 0;
  };

  // --- HANDLERS ---
  const handleChange = (e) => {
    const { name, type, value, files } = e.target;
    setData(prev => ({ ...prev, [name]: type === "file" ? files[0] : value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  }

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return; 

    setIsLoading(true); // Start Loading

    try {
      const formData = new FormData();
      formData.append("image", data.image);
      formData.append("name", data.name);
      formData.append("desc", data.desc);
      formData.append("price", data.price);

      await axios.post(import.meta.env.VITE_PRODUCT_URL, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" }
      });

      showNotification("Product published successfully!", "success");
      
      getData();
      setData({ image: '', name: '', desc: '', price: '' });
      setErrors({});
      if (fileInputRef.current) fileInputRef.current.value = null;

    } catch (error) {
      showNotification("Failed to add product. Try again.", "error");
      console.error("Error adding product:", error.message);
    } finally {
      setIsLoading(false); // Stop Loading
    }
  };

  // 1. Trigger Modal
  const confirmDelete = (id) => {
    setProductToDelete(id);
    setDeleteModalOpen(true);
  };

  // 2. Actual Delete Action
  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;
    
    setIsLoading(true);

    try {
      // Logic to find Cart Item related to Product
      const products = await axios.get(`${import.meta.env.VITE_PRODUCT_URL}`);
      const findProduct = products.data.product.find(p => p._id === productToDelete)
      const productId = findProduct?.productId; // Optional chaining for safety

      if(productId) {
          const allCarts = await axios.get(`${import.meta.env.VITE_CART_URL}`);
          const findCart = allCarts.data.cart.find(c => c.productId === productId);
          if (findCart) {
            await axios.delete(`${import.meta.env.VITE_CART_URL}/${findCart._id}`)
          }
      }

      await axios.delete(`${import.meta.env.VITE_PRODUCT_URL}/${productToDelete}`);

      showNotification("Product deleted successfully.", "success");
      getData();
    } catch (error) {
      showNotification("Error deleting product.", "error");
      console.log(error);
    } finally {
      setIsLoading(false);
      setDeleteModalOpen(false); // Close Modal
      setProductToDelete(null);
    }
  }

  const getData = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_PRODUCT_URL);
      setProductsData(res.data.product);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  const filteredProducts = productsData.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-green-50/50 min-h-screen font-sans selection:bg-emerald-200 relative overflow-x-hidden">
      <Navbar />

      {/* --- CUSTOM NOTIFICATION COMPONENT --- */}
      <div className={`fixed top-24 right-5 z-[60] transition-all duration-500 transform 
          ${notification.show ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}
      >
        <div className={`flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl border-l-4 backdrop-blur-md bg-white/95
          ${notification.type === 'success' ? 'border-emerald-500' : 'border-red-500'}`}
        >
          {notification.type === 'success' 
            ? <FaCheckCircle className="text-emerald-500 text-xl" /> 
            : <FaTimesCircle className="text-red-500 text-xl" />
          }
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

      {/* --- CUSTOM DELETE MODAL COMPONENT --- */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-emerald-900/20 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 transform transition-all scale-100 border border-emerald-100">
            <div className="flex justify-center mb-4">
              <div className="bg-red-50 p-4 rounded-full text-red-500 text-2xl shadow-inner">
                <FaTrash />
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-800 text-center mb-2">Delete Confirmation</h3>
            <p className="text-gray-500 text-center text-sm mb-6">
              Are you sure you want to permanently delete this product? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button 
                disabled={isLoading}
                onClick={() => setDeleteModalOpen(false)}
                className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button 
                disabled={isLoading}
                onClick={handleDeleteConfirm}
                className="flex-1 px-4 py-2.5 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 shadow-lg shadow-red-200 transition disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
              >
                {isLoading ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MAIN DASHBOARD CONTENT --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        <div className="mb-8 text-center sm:text-left">
          <h1 className="text-3xl font-extrabold text-emerald-900 flex items-center justify-center sm:justify-start gap-3">
            Admin Dashboard <span className="text-2xl">🌿</span>
          </h1>
          <p className="text-emerald-600/80 mt-1">Manage your eco-friendly inventory.</p>
        </div>

        {/* TAB NAVIGATION */}
        <div className="flex justify-center sm:justify-start gap-4 mb-10 border-b border-emerald-200 pb-1">
          <button 
            onClick={() => setActiveTab('add')}
            className={`flex items-center gap-2 px-6 py-3 rounded-t-lg font-bold text-sm transition-all duration-300
              ${activeTab === 'add' 
                ? 'bg-emerald-600 text-white shadow-lg translate-y-[1px]' 
                : 'bg-transparent text-gray-500 hover:text-emerald-600 hover:bg-emerald-50'
              }`}
          >
            <FaBoxOpen /> Add New Product
          </button>

          <button 
            onClick={() => setActiveTab('manage')}
            className={`flex items-center gap-2 px-6 py-3 rounded-t-lg font-bold text-sm transition-all duration-300
              ${activeTab === 'manage' 
                ? 'bg-emerald-600 text-white shadow-lg translate-y-[1px]' 
                : 'bg-transparent text-gray-500 hover:text-emerald-600 hover:bg-emerald-50'
              }`}
          >
            <FaClipboardList /> Manage Inventory ({productsData.length})
          </button>
        </div>

        {/* TAB 1: ADD PRODUCT */}
        {activeTab === 'add' && (
          <section className="animate-fade-in-up">
            <div className="relative bg-white rounded-3xl shadow-xl border border-emerald-100 overflow-hidden grid grid-cols-1 md:grid-cols-5">
              
              <div className="hidden md:flex md:col-span-2 bg-emerald-50 flex-col items-center justify-center p-8 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="relative z-10">
                  <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg text-white text-3xl">
                    <FaPlus />
                  </div>
                  <h3 className="text-2xl font-bold text-emerald-900 mb-2">New Arrival?</h3>
                  <p className="text-emerald-600/80 text-sm">Fill in the details to publish a new item to your store.</p>
                </div>
              </div>

              <div className="p-8 md:col-span-3">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  Create Listing
                </h2>

                <form className="space-y-5" onSubmit={submit}>
                  <div className="group">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 ml-1">Product Name</label>
                    <input
                      type="text"
                      name='name'
                      value={data.name}
                      onChange={handleChange}
                      placeholder="e.g. Organic Green Tea"
                      className={`w-full px-4 py-3 bg-gray-50 border rounded-xl transition-all outline-none
                        ${errors.name ? 'border-red-400 focus:ring-2 focus:ring-red-200 bg-red-50' : 'border-gray-200 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'}`}
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1 ml-1 flex items-center gap-1"><FaExclamationCircle/> {errors.name}</p>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 ml-1">Price (₹)</label>
                      <input
                        type="number"
                        name='price'
                        value={data.price}
                        onChange={handleChange}
                        placeholder="0.00"
                        className={`w-full px-4 py-3 bg-gray-50 border rounded-xl transition-all outline-none
                          ${errors.price ? 'border-red-400 focus:ring-2 focus:ring-red-200 bg-red-50' : 'border-gray-200 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'}`}
                      />
                      {errors.price && <p className="text-red-500 text-xs mt-1 ml-1 flex items-center gap-1"><FaExclamationCircle/> {errors.price}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 ml-1">Upload Image</label>
                      <div className="relative">
                        <input
                          type="file"
                          name='image'
                          ref={fileInputRef}
                          onChange={handleChange}
                          className={`w-full text-sm text-gray-500
                            file:mr-4 file:py-3 file:px-4
                            file:rounded-xl file:border-0
                            file:text-xs file:font-semibold
                            file:bg-emerald-100 file:text-emerald-700
                            hover:file:bg-emerald-200
                            cursor-pointer bg-gray-50 rounded-xl border 
                            ${errors.image ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                        />
                      </div>
                      {errors.image && <p className="text-red-500 text-xs mt-1 ml-1 flex items-center gap-1"><FaExclamationCircle/> {errors.image}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 ml-1">Description</label>
                    <textarea
                      rows="3"
                      name='desc'
                      value={data.desc}
                      onChange={handleChange}
                      placeholder="Describe the product features..."
                      className={`w-full px-4 py-3 bg-gray-50 border rounded-xl transition-all outline-none resize-none
                        ${errors.desc ? 'border-red-400 focus:ring-2 focus:ring-red-200 bg-red-50' : 'border-gray-200 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'}`}
                    ></textarea>
                    {errors.desc && <p className="text-red-500 text-xs mt-1 ml-1 flex items-center gap-1"><FaExclamationCircle/> {errors.desc}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-200 hover:bg-emerald-700 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                     {isLoading ? (
                       <>
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        Publishing...
                       </>
                     ) : (
                       <>
                        <FaPlus /> Publish Product
                       </>
                     )}
                  </button>
                </form>
              </div>
            </div>
          </section>
        )}

        {/* TAB 2: MANAGE */}
        {activeTab === 'manage' && (
          <section className="animate-fade-in-up">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 bg-white p-4 rounded-xl shadow-sm border border-emerald-100">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <span className="h-2 w-2 bg-yellow-400 rounded-full"></span>
                Product List
              </h2>

              <div className="relative w-full sm:w-72">
                <input 
                  type="text" 
                  placeholder="Search products..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none text-sm transition-all"
                />
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((val, key) => (
                <div key={key} className="group bg-white rounded-2xl border border-green-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
                  <div className="relative h-48 p-4 bg-gray-50 flex items-center justify-center overflow-hidden">
                    <img
                      src={`${import.meta.env.VITE_PRODUCT_IMAGE_URL}/${val.image}`}
                      alt={val.name}
                      className="h-full w-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold text-emerald-700 shadow-sm border border-emerald-100">
                      ₹{val.price}
                    </div>
                  </div>

                  <div className="p-5 flex flex-col flex-grow">
                    <h3 className="text-lg font-bold text-gray-800 line-clamp-1 mb-1">{val.name}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-grow">{val.desc}</p>
                    
                    <div className="grid grid-cols-2 gap-3 mt-auto">
                      <button 
                        onClick={() => navigate(`/edit-product/${val._id}`)}
                        className="flex items-center justify-center gap-2 px-3 py-2 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-600 hover:text-white transition-colors duration-200 text-sm font-semibold"
                      >
                        <FaEdit /> Edit
                      </button>
                      <button 
                        onClick={() => confirmDelete(val._id)}
                        className="flex items-center justify-center gap-2 px-3 py-2 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-500 hover:text-white transition-colors duration-200 text-sm font-semibold"
                      >
                        <FaTrash /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {productsData.length === 0 && (
              <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-emerald-200">
                <FaLeaf className="mx-auto text-4xl text-emerald-200 mb-3" />
                <p className="text-gray-400">Inventory is empty.</p>
                <button onClick={() => setActiveTab('add')} className="text-emerald-600 font-bold hover:underline mt-2">Add your first product</button>
              </div>
            )}

            {productsData.length > 0 && filteredProducts.length === 0 && (
              <div className="text-center py-16">
                <p className="text-gray-500 text-lg">No products match your search "{searchQuery}"</p>
                <button 
                  onClick={() => setSearchQuery('')}
                  className="mt-2 text-emerald-600 font-medium hover:underline"
                >
                  Clear Search
                </button>
              </div>
            )}
          </section>
        )}

      </div>
    </div>
  );
};

export default AdminDash;