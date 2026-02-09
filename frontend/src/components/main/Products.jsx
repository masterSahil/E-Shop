import axios from 'axios';
import React, { useEffect, useState, useMemo } from 'react';
import { FaShoppingCart, FaCheckCircle, FaLeaf } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { toast, Toaster } from 'react-hot-toast';
import { RiSearchLine } from 'react-icons/ri';

const Products = () => {
    const [data, setData] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.08 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30, scale: 0.9 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { type: "spring", stiffness: 200, damping: 18 }
        },
        exit: {
            opacity: 0,
            scale: 0.9,
            transition: { duration: 0.2 }
        }
    };

    // --- UNIFIED LEAF TOAST FUNCTION (Handles both Add & Remove) ---
    const showLeafToast = (title, productName) => {
        toast.custom((t) => (
            <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.8 }}
                className={`${t.visible ? 'flex' : 'hidden'} max-w-md w-full bg-emerald-950 border-2 border-lime-400/30 shadow-[0_20px_50px_rgba(6,78,59,0.3)] rounded-xl pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden`}
            >
                <div className="flex-1 w-0 p-4">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 pt-0.5">
                            <div className="h-12 w-12 rounded-xl bg-lime-400 flex items-center justify-center shadow-lg shadow-lime-500/20">
                                <FaLeaf className="text-emerald-900 text-xl" />
                            </div>
                        </div>
                        <div className="ml-4 flex-1">
                            <p className="text-[10px] font-black text-lime-400/50 uppercase tracking-[0.2em]">
                                {title}
                            </p>
                            <p className="text-lg font-black text-white leading-tight mt-0.5 line-clamp-1">
                                {productName}
                            </p>
                            <p className="text-xs font-bold text-lime-200/60 italic">
                                Curated for your shop
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        ), { duration: 2000 });
    };

    const getData = async () => {
        try {
            setLoading(true);
            const res = await axios.get(import.meta.env.VITE_PRODUCT_URL, { withCredentials: true });
            setData(res.data.product);
        } catch (error) {
            toast.error('Failed to load products.');
        } finally {
            setLoading(false);
        }
    };

    const fetchCartItems = async () => {
        try {
            const res = await axios.get(import.meta.env.VITE_CART_URL, { withCredentials: true });
            const tokenRes = await axios.get(import.meta.env.VITE_CURRENT_USER_TOKEN_URL, { withCredentials: true });
            const userId = tokenRes?.data?.user?._id;
            if (userId) {
                const userCart = res.data.cart.filter((item) => item.userId === userId);
                setCartItems(userCart);
            }
        } catch (error) { console.log(error); }
    };

    const addToCart = async (productId) => {
        try {
            const selectedProduct = data.find((p) => p.productId === productId);
            if (!selectedProduct) return;

            const cartItem = { ...selectedProduct, quantity: 1 };
            
            // Optimistic UI Update: Show checkmark immediately
            setCartItems(prev => [...prev, { ...cartItem, productId: productId, _id: 'temp-' + Date.now() }]);

            // Show Toast
            showLeafToast("Added to Collection", selectedProduct.name);

            // API Call
            await axios.post(import.meta.env.VITE_CART_URL, cartItem, { withCredentials: true });
            
            // Sync actual data in background
            fetchCartItems(); 
            window.dispatchEvent(new Event("cartUpdated"));
        } catch (error) {
            toast.error('Error adding to cart.');
            // Revert on failure
            fetchCartItems();
        }
    };

    const removeFromCart = async (productId) => {
        try {
            const cart_Item = cartItems.find(p => p.productId === productId);
            if (!cart_Item) return;

            const productName = cart_Item.name;

            // Optimistic UI Update: Remove checkmark immediately
            setCartItems(prev => prev.filter(item => item.productId !== productId));

            // Show Toast
            showLeafToast("Removed from Collection", productName);

            // API Call
            if (cart_Item._id && !cart_Item._id.startsWith('temp-')) {
                 await axios.delete(`${import.meta.env.VITE_CART_URL}/${cart_Item._id}`, { withCredentials: true });
            }

            // Sync actual data
            fetchCartItems();
            window.dispatchEvent(new Event("cartUpdated"));
        } catch (error) {
            console.log(error);
            toast.error("Remove failed");
            fetchCartItems();
        }
    };

    const isInCart = (productId) => cartItems.some((item) => item.productId === productId);

    useEffect(() => {
        getData();
        fetchCartItems();
    }, []);

    const filteredProducts = useMemo(() => {
        return data.filter(product =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (product.desc && product.desc.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [data, searchTerm]);

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center h-screen bg-[#f7fee7]">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="w-14 h-14 border-4 border-lime-200 border-t-emerald-600 rounded-full"
                />
                <p className="mt-4 text-emerald-900 font-black tracking-widest animate-pulse">CURATING COLLECTION...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f7fee7] p-6 lg:p-12">
            <Toaster position="bottom-right" reverseOrder={false} />

            {/* Header Section */}
            <header className="max-w-7xl mx-auto text-center mb-16 relative">
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="inline-flex items-center gap-2 bg-white px-4 py-1.5 rounded-full shadow-sm border border-lime-100 mb-6"
                >
                    <FaLeaf className="text-lime-500 text-sm" />
                    <span className="text-emerald-900/60 font-bold tracking-widest uppercase text-[10px]">Premium Experience</span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-6xl md:text-8xl font-black text-emerald-950 tracking-tighter"
                >
                    THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-500 to-emerald-600">SHOP</span>
                </motion.h1>
            </header>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-20">
                <div className="relative group">
                    <div className="absolute inset-0 bg-lime-400/20 blur-3xl group-focus-within:bg-lime-400/40 transition-all duration-700 rounded-full"></div>
                    <input
                        type="text"
                        placeholder="Search our collection..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="relative w-full pl-16 pr-8 py-6 bg-white border-2 border-transparent focus:border-lime-400 rounded-[2rem] shadow-2xl shadow-emerald-900/5 outline-none transition-all duration-300 text-emerald-950 font-semibold placeholder:text-emerald-900/30"
                    />
                    <RiSearchLine className="absolute left-6 top-1/2 transform -translate-y-1/2 text-lime-500 text-3xl group-focus-within:scale-110 transition-transform" />
                </div>
            </div>

            {/* Product Grid */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10"
            >
                <AnimatePresence mode='popLayout'>
                    {filteredProducts.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="col-span-full flex flex-col items-center justify-center py-20"
                        >
                            <div className="w-24 h-24 rounded-[2rem] bg-white shadow-xl flex items-center justify-center mb-6 rotate-12">
                                <RiSearchLine className="text-lime-500 text-4xl" />
                            </div>
                            <h2 className="text-3xl font-black text-emerald-900 mb-2">No matches found</h2>
                            <button
                                onClick={() => setSearchTerm("")}
                                className="mt-4 px-6 py-2 bg-emerald-900 text-lime-400 rounded-full font-bold hover:bg-emerald-800 transition shadow-lg shadow-emerald-200"
                            >
                                Show All Products
                            </button>
                        </motion.div>
                    ) : (
                        filteredProducts.map((val) => (
                            <motion.div
                                key={val.productId}
                                layout
                                variants={itemVariants}
                                whileHover={{ y: -10 }}
                                className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-2xl hover:shadow-lime-200/50 transition-all duration-500 border border-lime-50 flex flex-col group relative overflow-hidden"
                            >
                                {/* Image Container */}
                                <div className="relative h-72 bg-[#f9fafb] rounded-2xl overflow-hidden mb-6 flex items-center justify-center">
                                    <div className="absolute inset-0 bg-gradient-to-br from-lime-100/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <motion.img
                                        whileHover={{ scale: 1.1, rotate: -2 }}
                                        src={`${import.meta.env.VITE_PRODUCT_IMAGE_URL}/${val.image}`}
                                        alt={val.name}
                                        className="w-full h-full object-contain p-10 z-10"
                                        onError={(e) => { e.target.src = `https://placehold.co/400x400/f7fee7/064e3b?text=${val.name}`; }}
                                    />
                                    <div className="absolute top-4 right-4 bg-emerald-900 text-lime-400 px-4 py-2 rounded-2xl font-black text-sm shadow-lg">
                                        ₹{val.price}
                                    </div>
                                </div>

                                <div className="px-2 pb-2 flex flex-col flex-grow">
                                    <h2 className="text-xl font-black text-emerald-950 mb-2 group-hover:text-lime-600 transition-colors line-clamp-1">
                                        {val.name}
                                    </h2>
                                    <p className="text-emerald-800/50 text-xs font-bold leading-relaxed mb-6 line-clamp-2 italic">
                                        {val.desc || "A premium selection curated for quality and style."}
                                    </p>

                                    {/* Action Row */}
                                    <div className="mt-auto flex items-center justify-between gap-4">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black text-emerald-900/30 uppercase tracking-widest">Status</span>
                                            <span className={`text-xs font-bold flex items-center gap-1 ${val.inStock ? 'text-emerald-700' : 'text-red-500'}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${val.inStock ? 'bg-lime-500 animate-pulse' : 'bg-red-500'}`} />
                                                {val.inStock ? 'Available' : 'Out of Stock'}
                                            </span>
                                        </div>

                                        {val.inStock ? (
                                            isInCart(val.productId) ? (
                                                <motion.button 
                                                    key="remove-btn"
                                                    onClick={() => removeFromCart(val.productId)}
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    // Added shrink-0 to prevent button from being crushed by long text
                                                    className="shrink-0 bg-emerald-900 text-lime-400 p-4 rounded-2xl shadow-lg shadow-emerald-100 hover:bg-emerald-800 transition-colors"
                                                >
                                                    <FaCheckCircle size={20} />
                                                </motion.button>
                                            ) : (
                                                <motion.button
                                                    key="add-btn"
                                                    whileHover={{ scale: 1.05, backgroundColor: '#a3e635' }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => addToCart(val.productId)}
                                                    // Added shrink-0 here as well
                                                    className="shrink-0 bg-lime-400 text-emerald-950 p-4 rounded-2xl shadow-xl shadow-lime-200 flex items-center gap-2 group/btn"
                                                >
                                                    <FaShoppingCart size={20} className="group-hover/btn:rotate-12 transition-transform" />
                                                </motion.button>
                                            )
                                        ) : (
                                            <div className="shrink-0 bg-gray-100 text-gray-400 p-4 rounded-2xl cursor-not-allowed">
                                                <FaShoppingCart size={20} />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default Products;