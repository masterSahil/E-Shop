import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaShoppingCart, FaTrashAlt, FaPlus, FaMinus, FaBoxOpen, FaTicketAlt, FaReceipt, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const CartPage = () => {
  const [data, setData] = useState([]);
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const navigate = useNavigate();

  const getData = async () => {
    try {
      const tokenRes = await axios.get(import.meta.env.VITE_CURRENT_USER_TOKEN_URL, {
        withCredentials: true,
      });

      const userId = tokenRes?.data?.user?._id;
      if (!userId) return;

      const res = await axios.get(import.meta.env.VITE_CART_URL, { withCredentials: true });
      const userCart = res.data.cart.filter(item => item.userId === userId);
      setData(userCart);
    } catch (err) {
      console.log('Cart Fetch Error:', err);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const updateQuantity = async (id, qty, inStock) => {
    qty = Math.max(1, Math.min(99, qty));
    try {
      await axios.put(`${import.meta.env.VITE_CART_URL}/${id}`, { quantity: qty, inStock });
      setData(prev => prev.map(item => item._id === id ? { ...item, quantity: qty } : item));
    } catch (err) {
      console.log('Update Error:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_CART_URL}/${id}`);
      setData(prev => prev.filter(item => item._id !== id));
    } catch (err) {
      console.log('Delete Error:', err);
    }
  };

  const handleClearCart = async () => {
    try {
      await Promise.all(data.map(item => axios.delete(`${import.meta.env.VITE_CART_URL}/${item._id}`)));
      setData([]);
    } catch (err) {
      console.log('Clear Cart Error:', err);
    }
  };

  const handleCoupon = () => {
    if (coupon === 'DISCOUNT10') {
      setDiscount(0.1);
    } else {
      setDiscount(0);
    }
  };

  const totalQty = data.reduce((a, b) => a + b.quantity, 0);
  const subtotal = data.reduce((a, b) => a + b.price * b.quantity, 0);
  const discountAmount = subtotal * discount;
  const grandTotal = subtotal - discountAmount;

  return (
    <section className="min-h-screen bg-[#f7fee7] px-4 md:px-20 py-12 font-sans relative">
      
      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate(-1)}
        className="mb-8 flex items-center gap-2 px-5 py-2.5 bg-white/50 hover:bg-lime-400 text-emerald-900 rounded-full font-bold text-sm shadow-sm transition-all border border-lime-100 group"
      >
        <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
        Back to Gallery
      </motion.button>

      {/* Header Section */}
      <div className="flex flex-col items-center mb-16">
        <motion.div 
            initial={{ scale: 0 }} 
            animate={{ scale: 1 }} 
            className="p-4 bg-lime-400 rounded-full shadow-lg shadow-lime-200 mb-4"
        >
          <FaShoppingCart className="text-3xl text-emerald-900" />
        </motion.div>
        <h1 className="text-5xl font-black text-emerald-900 tracking-tighter">
          Shopping <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-500 to-emerald-600">Cart</span>
        </h1>
        <p className="text-emerald-700/60 font-bold tracking-widest uppercase text-[10px] mt-2">Review your collection</p>
      </div>

      {data.length > 0 ? (
        <div className="flex flex-col lg:flex-row gap-10 items-start max-w-7xl mx-auto">
          
          {/* Items List */}
          <motion.div 
            className="flex-1 space-y-6 w-full"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <AnimatePresence mode="popLayout">
              {data.map((item, idx) => (
                <motion.div
                  key={item._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white border border-lime-50 p-5 rounded-[2.5rem] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6 hover:shadow-xl hover:shadow-lime-200/30 transition-all group"
                >
                  <div className="bg-[#f9fafb] p-4 rounded-[2rem] group-hover:scale-105 transition-transform flex items-center justify-center w-32 h-32 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-lime-100/50 to-transparent" />
                    <img
                      src={`${import.meta.env.VITE_PRODUCT_IMAGE_URL}/${item.image}`}
                      className="w-full h-full object-contain relative z-10"
                      alt={item.name}
                    />
                  </div>

                  <div className="flex-1 text-center sm:text-left">
                    <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-lime-500 animate-pulse" />
                        <span className="text-[10px] font-black text-emerald-900/30 uppercase tracking-widest">Premium Choice</span>
                    </div>
                    <h2 className="text-xl font-black text-emerald-900 group-hover:text-lime-600 transition-colors">{item.name}</h2>
                    <p className="text-xs text-emerald-800/40 font-bold italic line-clamp-1 mb-3">{item.desc || "Exquisite detail and quality."}</p>
                    <span className="text-2xl font-black text-emerald-800 tracking-tighter">₹{item.price}</span>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center bg-[#f9fafb] rounded-2xl p-2 border border-lime-100 shadow-inner">
                    <button 
                        onClick={() => updateQuantity(item._id, item.quantity - 1, item.inStock)} 
                        className="w-10 h-10 flex items-center justify-center bg-white rounded-xl hover:bg-lime-400 text-emerald-700 transition shadow-sm"
                    >
                        <FaMinus size={12} />
                    </button>
                    <input
                      type="text"
                      value={item.quantity}
                      onChange={(e) => {
                        const val = parseInt(e.target.value.replace(/\D/g, ''), 10) || 1;
                        setData(prev => prev.map(i => i._id === item._id ? { ...i, quantity: val } : i));
                      }}
                      onBlur={() => updateQuantity(item._id, item.quantity, item.inStock)}
                      className="w-12 text-center bg-transparent font-black text-emerald-900 focus:outline-none text-lg"
                    />
                    <button 
                        onClick={() => updateQuantity(item._id, item.quantity + 1, item.inStock)} 
                        className="w-10 h-10 flex items-center justify-center bg-white rounded-xl hover:bg-lime-400 text-emerald-700 transition shadow-sm"
                    >
                        <FaPlus size={12} />
                    </button>
                  </div>

                  <button
                    onClick={() => handleDelete(item._id)}
                    className="p-4 text-emerald-900/20 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                  >
                    <FaTrashAlt size={18} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>

            <button
              onClick={handleClearCart}
              className="mt-4 w-full py-4 text-emerald-900/40 font-bold text-xs uppercase tracking-widest hover:text-red-500 transition-colors border-2 border-dashed border-lime-200 rounded-[2rem] hover:border-red-200"
            >
              Empty entire bag
            </button>
          </motion.div>

          {/* Billing Sidebar */}
          <motion.div
            className="lg:sticky lg:top-8 w-full lg:w-[400px]"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="bg-emerald-900 text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-lime-400/10 rounded-full blur-[60px]"></div>
              
              <div className="flex items-center gap-3 mb-8">
                <FaReceipt className="text-lime-400 text-xl" />
                <h2 className="text-2xl font-black tracking-tighter uppercase">Summary</h2>
              </div>

              <div className="space-y-5 mb-10">
                <div className="flex justify-between text-emerald-200/50 font-bold text-sm">
                  <span>SUBTOTAL</span>
                  <span className="text-white">₹{subtotal.toLocaleString()}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-lime-400 font-bold text-sm">
                    <span>DISCOUNT (10%)</span>
                    <span>-₹{discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-emerald-200/50 font-bold text-sm">
                    <span>SHIPPING</span>
                    <span className="text-lime-400 italic">FREE</span>
                </div>
                <div className="h-[1px] bg-emerald-800/60 my-6"></div>
                <div className="flex justify-between items-end">
                  <span className="text-xs text-emerald-300 font-black uppercase tracking-widest">Total</span>
                  <span className="text-4xl font-black text-white tracking-tighter">₹{grandTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Coupon UI */}
              <div className="relative mb-8">
                <input
                  type="text"
                  placeholder="COUPON CODE"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  className="w-full bg-emerald-950/50 text-white pl-6 pr-24 py-5 rounded-2xl outline-none border border-emerald-800 focus:border-lime-400 font-bold text-sm tracking-widest placeholder:text-emerald-800"
                />
                <button
                  onClick={handleCoupon}
                  className="absolute right-2 top-2 bottom-2 bg-lime-400 text-emerald-900 px-5 rounded-xl text-[10px] font-black hover:bg-white transition-colors uppercase tracking-widest"
                >
                  Apply
                </button>
              </div>

              <button
                className="w-full bg-lime-400 text-emerald-900 py-5 rounded-2xl font-black text-lg shadow-xl shadow-emerald-950/40 hover:bg-white hover:scale-[1.02] active:scale-95 transition-all mb-6 uppercase tracking-tighter"
              >
                Checkout Now
              </button>

              <button
                onClick={() => window.print()}
                className="w-full py-2 text-[10px] text-emerald-400 font-black tracking-widest hover:text-white transition-colors flex items-center justify-center gap-2 uppercase"
              >
                Print Invoice
              </button>
            </div>
          </motion.div>

        </div>
      ) : (
        /* Empty State */
        <motion.div
          className="text-center py-20 px-8 bg-white rounded-[3.5rem] shadow-xl shadow-lime-100 border border-lime-50 max-w-2xl mx-auto"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="relative inline-block mb-8">
            <div className="w-32 h-32 bg-[#f7fee7] rounded-[2.5rem] flex items-center justify-center rotate-12 shadow-lg">
                <FaBoxOpen className="text-5xl text-lime-500" />
            </div>
            <motion.div 
                animate={{ y: [0, -10, 0] }} 
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute -top-4 -right-4 bg-emerald-900 text-lime-400 p-4 rounded-full shadow-2xl"
            >
                <FaShoppingCart size={24}/>
            </motion.div>
          </div>
          <h2 className="text-4xl font-black text-emerald-900 mb-3 tracking-tighter">Your bag is empty</h2>
          <p className="text-emerald-800/40 font-bold italic mb-10">Seems like you haven't discovered our premium pieces yet.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-emerald-900 text-lime-400 px-12 py-5 rounded-3xl font-black shadow-2xl shadow-emerald-100 hover:bg-emerald-800 transition-all active:scale-95 uppercase tracking-widest text-sm"
          >
            Explore Collection
          </button>
        </motion.div>
      )}
    </section>
  );
};

export default CartPage;