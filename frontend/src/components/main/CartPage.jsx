import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaShoppingCart, FaTrashAlt, FaPlus, FaMinus, FaBoxOpen } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

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
    <section className="min-h-screen bg-gray-100 px-4 md:px-20 py-10">
      <div className="flex items-center justify-center gap-3 mb-6">
        <FaShoppingCart className="text-4xl text-violet-700" />
        <h1 className="text-4xl font-bold text-violet-700">My Cart</h1>
      </div>

      {data.length > 0 ? (
        <motion.div
          className="flex flex-col md:flex-row gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="flex-1 space-y-4">
            {data.map((item, idx) => (
              <motion.div
                key={idx}
                className="bg-white p-4 rounded-xl shadow-sm flex items-center justify-between hover:shadow-md transition"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: idx * 0.05 }}
              >
                <img
                  src={`${import.meta.env.VITE_PRODUCT_IMAGE_URL}/${item.image}`}
                  className="w-20 h-20 object-contain rounded-md"
                  alt={item.name}
                />

                <div className="flex-1 px-4">
                  <h2 className="font-semibold">{item.name}</h2>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                  <p className="text-sm mt-1 text-violet-700">₹ {item.price}</p>
                  <p className={`text-xs font-medium ${item.inStock ? 'text-green-600' : 'text-red-600'}`}>
                    {item.inStock ? 'In Stock' : 'Out of Stock'}
                  </p>

                  <div className="flex items-center gap-2 mt-2">
                    <button onClick={() => updateQuantity(item._id, item.quantity - 1, item.inStock)} className="bg-gray-200 rounded p-1 hover:bg-gray-300"><FaMinus size={10} /></button>
                    <input
                      type="text"
                      value={item.quantity}
                      onChange={(e) => {
                        const val = parseInt(e.target.value.replace(/\D/g, ''), 10) || 1;
                        setData(prev => prev.map(i => i._id === item._id ? { ...i, quantity: val } : i));
                      }}
                      onBlur={() => updateQuantity(item._id, item.quantity, item.inStock)}
                      className="w-10 text-center border border-gray-300 rounded"
                    />
                    <button onClick={() => updateQuantity(item._id, item.quantity + 1, item.inStock)} className="bg-gray-200 rounded p-1 hover:bg-gray-300"><FaPlus size={10} /></button>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(item._id)}
                  title="Remove from Cart"
                  className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded-md shadow-md transition"
                >
                  <FaTrashAlt />
                </button>
              </motion.div>
            ))}
          </div>

          {/* Billing Summary */}
          <motion.div
            className="sticky top-24 h-max self-start"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="w-full md:w-[300px] bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-bold text-violet-700 mb-3">Billing Summary</h2>
              <div className="space-y-2 mb-3">
                {data.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm border-b pb-1">
                    <span>{item.name}</span>
                    <span>x{item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="text-sm text-gray-600 border-t pt-3 space-y-1">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₹ {subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600 font-medium">
                    <span>Discount (10%):</span>
                    <span>-₹ {discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-base pt-1 border-t mt-2">
                  <span>Total:</span>
                  <span>₹ {grandTotal.toFixed(2)}</span>
                </div>
                <div className="text-xs text-gray-500">Items: {totalQty}</div>
              </div>

              {/* Coupon */}
              <div className="mt-4">
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  className="border border-gray-300 px-3 py-2 w-full rounded mb-2 text-sm"
                />
                <button
                  onClick={handleCoupon}
                  className="w-full bg-violet-600 text-white py-2 rounded hover:bg-violet-700 transition text-sm"
                >
                  Apply Coupon
                </button>
              </div>

              <button
                onClick={() => window.print()}
                className="mt-4 w-full py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded transition"
              >
                Print Bill
              </button>
            </div>

            <button
              onClick={handleClearCart}
              className="bg-red-100 hover:bg-red-200 text-red-600 border border-red-400 py-2 px-4 rounded text-sm font-semibold transition mt-4 w-full"
            >
              Clear All Cart
            </button>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div
          className="text-center mt-20 flex flex-col items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <FaBoxOpen className="text-[80px] text-gray-400 mb-4 animate-bounce" />
          <h2 className="text-2xl font-semibold text-gray-600 mb-2">Your Cart is Empty</h2>
          <p className="text-gray-500 text-sm mb-4">Start adding items to your cart to see them here.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-violet-600 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-violet-700 transition"
          >
            Browse Products
          </button>
        </motion.div>
      )}
    </section>
  );
};

export default CartPage;