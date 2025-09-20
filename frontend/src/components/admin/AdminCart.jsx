import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

const AdminCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [userEmails, setUserEmails] = useState({});

  useEffect(() => {
    getCartData();
  }, []);

  const getCartData = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_CART_URL, { withCredentials: true });

      const grouped = groupByUser(res.data.cart);
      setCartItems(grouped);

      // Remove trailing slash if any from VITE_SINGLE_USER_URL
      const apiBase = import.meta.env.VITE_SINGLE_USER_URL.replace(/\/$/, '');

      const userIds = [...new Set(res.data.cart.map(item => item.userId))];
      const emailMap = {};

      await Promise.all(
        userIds.map(async (id) => {
          try {
            const userRes = await axios.get(`${apiBase}/user/${id}`, { withCredentials: true });
            emailMap[id] = userRes.data.user?.email || 'Unknown';
          } catch {
            emailMap[id] = 'Unknown';
          }
        })
      );

      setUserEmails(emailMap);
    } catch (error) {
      console.log("Error loading cart data:", error);
    }
  };

  const groupByUser = (cartArray) => {
    const grouped = {};
    cartArray.forEach(item => {
      const userKey = item.userId || 'Unknown';
      if (!grouped[userKey]) grouped[userKey] = [];
      grouped[userKey].push(item);
    });
    return grouped;
  };

  return (
    <section className="min-h-screen bg-gray-100 px-4 py-10 md:px-10">
      <h1 className="text-3xl font-bold text-center text-violet-700 mb-8">
        All Users' Cart Overview
      </h1>

      {Object.keys(cartItems).length > 0 ? (
        <div className="space-y-10">
          {Object.entries(cartItems).map(([userId, items], index) => {
            const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

            return (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-violet-600 mb-4">
                  User: {userEmails[userId] || "Unknown User"}
                </h2>

                <div className="grid gap-4">
                  {items.map((item, i) => (
                    <div
                      key={i}
                      className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border rounded-lg p-4"
                    >
                      <div className="flex gap-4 items-center">
                        <img
                          src={`${import.meta.env.VITE_PRODUCT_IMAGE_URL}/${item.image}`}
                          alt={item.name}
                          className="w-20 h-20 object-contain rounded bg-gray-100"
                        />
                        <div>
                          <p className="font-medium text-gray-800">{item.name}</p>
                          <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                          <p className="text-sm text-gray-500">Price: ₹{item.price}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {item.inStock ? (
                          <span className="text-green-600 flex items-center gap-1">
                            <CheckCircle size={16} /> In Stock
                          </span>
                        ) : (
                          <span className="text-red-500 flex items-center gap-1">
                            <XCircle size={16} /> Out of Stock
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 text-right text-lg font-semibold text-gray-800">
                  Grand Total: ₹{total.toFixed(2)}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center text-gray-600 mt-20">
          <p>No cart data available.</p>
        </div>
      )}
    </section>
  );
};

export default AdminCart;