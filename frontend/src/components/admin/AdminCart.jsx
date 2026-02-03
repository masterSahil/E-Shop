import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { 
  Check, 
  X, 
  ShoppingBag, 
  User, 
  AlertOctagon,
  CreditCard,
  RefreshCw,
  TrendingUp,
  Package
} from 'lucide-react';
import Navbar from '../main/Navbar';

const AdminCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [userEmails, setUserEmails] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    getCartData();
  }, []);

  const getCartData = async () => {
    try {
      if(!loading) setRefreshing(true);
      const res = await axios.get(import.meta.env.VITE_CART_URL, { withCredentials: true });
      const grouped = groupByUser(res.data.cart);
      setCartItems(grouped);

      const apiBase = import.meta.env.VITE_SINGLE_USER_URL.replace(/\/$/, '');
      const userIds = [...new Set(res.data.cart.map(item => item.userId))];
      const emailMap = {};

      await Promise.all(
        userIds.map(async (id) => {
          try {
            const userRes = await axios.get(`${apiBase}/user/${id}`, { withCredentials: true });
            emailMap[id] = userRes.data.user?.email || 'Unknown';
          } catch {
            emailMap[id] = 'Guest User';
          }
        })
      );

      setUserEmails(emailMap);
    } catch (error) {
      console.log("Error loading cart data:", error);
    } finally {
        setLoading(false);
        setTimeout(() => setRefreshing(false), 500);
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

  // Stats Calculation
  const totalActiveCarts = Object.keys(cartItems).length;
  const totalRevenue = Object.values(cartItems)
    .flat()
    .reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItems = Object.values(cartItems)
    .flat()
    .reduce((sum, item) => sum + item.quantity, 0);

  if (loading) {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-6">
            <div className="relative flex items-center justify-center">
                <div className="absolute w-20 h-20 bg-lime-400/20 rounded-full animate-ping"></div>
                <div className="relative bg-white p-6 rounded-2xl shadow-xl">
                    <ShoppingBag size={32} className="text-emerald-950 animate-bounce" />
                </div>
            </div>
            <p className="text-emerald-900/40 font-bold tracking-[0.2em] text-xs uppercase">Initializing Dashboard</p>
        </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-800 selection:bg-lime-200 selection:text-emerald-900">
      
      {/* 1. Navigation */}
      <Navbar />

      {/* 2. Floating Stats Bar (Glassmorphism) */}
      <div className="sticky top-0 z-30 px-4 py-4 pointer-events-none">
        <div className="max-w-7xl mx-auto pointer-events-auto">
            <div className="bg-white/80 backdrop-blur-xl border border-white/40 shadow-xl shadow-slate-200/50 rounded-2xl p-2 pl-6 flex flex-wrap items-center justify-between gap-4">
                
                {/* Left: Title & Refresh */}
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-lime-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-lime-500/20 text-white">
                        <ShoppingBag size={20} fill="currentColor" className="text-white/20" />
                        <ShoppingBag size={20} className="absolute" />
                    </div>
                    <div>
                        <h1 className="text-base font-black text-slate-800 leading-none">Live Monitor</h1>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mt-1">Real-time Cart Data</p>
                    </div>
                </div>

                {/* Right: Metrics */}
                <div className="flex items-center gap-2">
                    <div className="hidden md:flex items-center gap-4 px-6 border-r border-slate-100">
                        <div className="text-right">
                            <span className="block text-[10px] font-bold text-slate-400 uppercase">Active Carts</span>
                            <span className="block text-lg font-black text-slate-800 leading-none">{totalActiveCarts}</span>
                        </div>
                        <div className="text-right">
                            <span className="block text-[10px] font-bold text-slate-400 uppercase">Total Items</span>
                            <span className="block text-lg font-black text-slate-800 leading-none">{totalItems}</span>
                        </div>
                    </div>
                    
                    <div className="bg-emerald-950 text-lime-400 px-5 py-2.5 rounded-xl flex items-center gap-3 shadow-lg shadow-emerald-900/20">
                        <div className="p-1.5 bg-white/10 rounded-lg">
                            <TrendingUp size={16} />
                        </div>
                        <div>
                            <span className="block text-[9px] font-bold text-emerald-400 uppercase opacity-80">Projected Revenue</span>
                            <span className="block text-base font-bold text-white leading-none">₹{totalRevenue.toLocaleString()}</span>
                        </div>
                    </div>

                    <button 
                        onClick={getCartData}
                        className={`p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 hover:text-emerald-600 hover:border-emerald-200 transition-all ${refreshing ? 'animate-spin' : ''}`}
                    >
                        <RefreshCw size={18} />
                    </button>
                </div>
            </div>
        </div>
      </div>

      {/* 3. Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 pb-20">
        {Object.keys(cartItems).length > 0 ? (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {Object.entries(cartItems).map(([userId, items], index) => {
              const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
              const hasIssues = items.some(i => !i.inStock);

              return (
                <div 
                  key={index} 
                  className="group flex flex-col bg-white rounded-[2rem] border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-500 overflow-hidden"
                >
                  {/* Card Header */}
                  <div className="px-8 py-6 bg-white border-b border-slate-50 flex justify-between items-start">
                      <div className="flex items-center gap-4">
                          <div className="relative">
                            <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-emerald-950">
                                <User size={24} strokeWidth={1.5} />
                            </div>
                            <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-[3px] border-white flex items-center justify-center ${hasIssues ? 'bg-amber-400' : 'bg-lime-500'}`}>
                                {hasIssues ? <AlertOctagon size={10} className="text-white" /> : <Check size={10} className="text-white" />}
                            </div>
                          </div>
                          <div>
                              <h3 className="text-slate-900 font-bold text-base">
                                  {userEmails[userId] || "Guest User"}
                              </h3>
                              <p className="text-slate-400 text-xs font-medium mt-1 font-mono bg-slate-50 inline-block px-1.5 py-0.5 rounded">
                                  ID: {userId.substring(0,8)}...
                              </p>
                          </div>
                      </div>
                      <div className="text-right">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Items</span>
                          <span className="text-xl font-black text-slate-900 bg-slate-50 px-3 py-1 rounded-lg">{items.length}</span>
                      </div>
                  </div>

                  {/* Scrollable Item List */}
                  <div className="flex-1 max-h-[400px] overflow-y-auto custom-scrollbar bg-white p-2">
                    <div className="flex flex-col">
                        {items.map((item, i) => (
                            <div 
                                key={i}
                                className={`relative flex items-center gap-5 p-4 mx-2 my-1 rounded-2xl transition-all duration-300 group/item ${
                                    !item.inStock 
                                    ? 'bg-slate-50 opacity-90' 
                                    : 'hover:bg-[#f8fafc]'
                                }`}
                            >
                                {/* Image Container */}
                                <div className="relative shrink-0 w-16 h-16">
                                    <img
                                        src={`${import.meta.env.VITE_PRODUCT_IMAGE_URL}/${item.image}`}
                                        alt={item.name}
                                        className={`w-full h-full object-contain bg-white rounded-xl border p-1 ${
                                            item.inStock 
                                            ? 'border-slate-100 shadow-sm' 
                                            : 'border-slate-200 grayscale opacity-60'
                                        }`}
                                    />
                                    {!item.inStock && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-white/40 rounded-xl backdrop-blur-[1px]">
                                            <X size={24} className="text-slate-800" />
                                        </div>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start mb-1">
                                        <p className={`text-sm font-bold truncate pr-4 ${item.inStock ? 'text-slate-800' : 'text-slate-400 line-through decoration-slate-300'}`}>
                                            {item.name}
                                        </p>
                                        <p className="text-sm font-bold text-emerald-950">
                                            ₹{(item.price * item.quantity).toLocaleString()}
                                        </p>
                                    </div>
                                    
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[11px] font-bold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-md shadow-sm">
                                                {item.quantity} x ₹{item.price}
                                            </span>
                                        </div>
                                        
                                        {/* Status Badge */}
                                        {item.inStock ? (
                                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100/50">
                                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                                                IN STOCK
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
                                                <Package size={10} />
                                                SOLD OUT
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="p-6 bg-[#f8fafc] border-t border-slate-100 flex justify-between items-center group-hover:bg-[#f0fdf4] transition-colors duration-500">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white rounded-lg border border-slate-100 text-slate-400 shadow-sm">
                                <CreditCard size={18} />
                            </div>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Value</span>
                        </div>
                        <div className="text-right">
                            <span className="text-2xl font-black text-emerald-950 tracking-tight">
                                ₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </span>
                        </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State Illustration */
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
            <div className="relative mb-8">
                <div className="absolute inset-0 bg-lime-400 blur-3xl opacity-20 rounded-full"></div>
                <div className="relative w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-2xl shadow-lime-900/5 border-4 border-white">
                    <ShoppingBag size={48} className="text-slate-300" />
                </div>
                <div className="absolute bottom-0 right-0 p-3 bg-white rounded-full shadow-lg border border-slate-50">
                    <Check size={20} className="text-lime-500" />
                </div>
            </div>
            <h3 className="text-3xl font-black text-slate-800 mb-3 tracking-tight">All Carts Cleared</h3>
            <p className="text-slate-400 max-w-sm text-sm font-medium leading-relaxed">
                There are no active shopping sessions at the moment. New customer activity will appear here automatically.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCart;