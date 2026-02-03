import React, { useState, useContext, useEffect } from 'react';
import { ShoppingCart, LogOut, Menu, X, Settings, Info, Home } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { LoginContext } from '../context/Context';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const URL = import.meta.env.VITE_REMOVE_COOKIE_URL;
    const { setIsLogin } = useContext(LoginContext);
    const [cartLength, setCartLength] = useState(0);

    const isActive = (path) => location.pathname === path;

    const logout = async () => {
        try {
            await axios.get(URL, { withCredentials: true });
            localStorage.clear();
            setIsLogin(false);
            navigate('/login');
            window.location.reload();
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    const getData = async () => {
        try {
            const tokenRes = await axios.get(import.meta.env.VITE_CURRENT_USER_TOKEN_URL, {
                withCredentials: true,
            });

            const userId = tokenRes?.data?.user?._id;
            if (!userId) return;

            const res = await axios.get(import.meta.env.VITE_CART_URL, { withCredentials: true });
            const userCart = res.data.cart.filter(item => item.userId === userId);
            
            setCartLength(userCart.length);
        } catch (err) {
            console.log('Cart Fetch Error:', err);
        }
    }

    const navLinks = [
        { name: 'Home', path: '/', icon: <Home size={18} /> },
        { name: 'About Us', path: '/about', icon: <Info size={18} /> },
        { name: 'Settings', path: '/setting', icon: <Settings size={18} /> },
    ];

    useEffect(() => {
        getData();

        const handleCartUpdate = () => {
            getData(); 
        };

        window.addEventListener("cartUpdated", handleCartUpdate);
        return () => {
            window.removeEventListener("cartUpdated", handleCartUpdate);
        };
    }, []);
    
    return (
        <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b-4 border-yellow-400 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20">
                    
                    {/* Logo Section */}
                    <div className="flex items-center">
                        <div 
                            onClick={() => navigate('/')}
                            className="flex items-center gap-2 cursor-pointer group"
                        >
                            <div className="bg-emerald-600 p-2 rounded-lg group-hover:rotate-12 transition-transform duration-300">
                                <ShoppingCart className="text-yellow-400 h-6 w-6" />
                            </div>
                            <h1 className="text-2xl font-black tracking-tighter text-emerald-800">
                                E-<span className="text-emerald-600">SHOP</span>
                            </h1>
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <button
                                key={link.name}
                                onClick={() => navigate(link.path)}
                                className={`flex items-center gap-1 font-semibold transition-all duration-200 hover:text-emerald-600 ${
                                    isActive(link.path) ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-gray-500'
                                }`}
                            >
                                {link.name}
                            </button>
                        ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="hidden md:flex items-center space-x-4">
                        <button 
                            onClick={() => navigate('/cart')}
                            className="relative p-2 text-emerald-700 bg-emerald-50 rounded-full hover:bg-yellow-100 hover:text-emerald-800 transition-colors duration-300"
                        >
                            <ShoppingCart size={24} />
                            {
                                cartLength > 0 && 
                                <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-yellow-400 text-[10px] font-bold text-emerald-900 border-2 border-white">
                                    {cartLength}
                                </span>
                            }
                            
                        </button>
                        
                        <button 
                            onClick={logout}
                            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-200 active:scale-95 transition-all duration-200"
                        >
                            <LogOut size={18} />
                            Logout
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button 
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-emerald-700 p-2 focus:outline-none"
                        >
                            {isMenuOpen ? <X size={30} /> : <Menu size={30} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Sidebar/Menu */}
            <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="px-4 pt-2 pb-6 space-y-2 bg-emerald-50 border-t border-emerald-100">
                    {navLinks.map((link) => (
                        <button
                            key={link.name}
                            onClick={() => { navigate(link.path); setIsMenuOpen(false); }}
                            className="flex items-center gap-3 w-full px-4 py-3 text-emerald-800 font-medium rounded-lg hover:bg-emerald-100 transition-colors"
                        >
                            {link.icon}
                            {link.name}
                        </button>
                    ))}
                    <div className="pt-4 flex flex-col gap-3">
                        <button 
                            onClick={() => { navigate('/cart'); setIsMenuOpen(false); }}
                            className="flex items-center justify-center gap-2 w-full py-3 bg-yellow-400 text-emerald-900 font-bold rounded-lg"
                        >
                            <ShoppingCart size={20} /> Cart  {cartLength > 0 && cartLength}
                        </button>
                        <button 
                            onClick={logout}
                            className="flex items-center justify-center gap-2 w-full py-3 bg-red-500 text-white font-bold rounded-lg"
                        >
                            <LogOut size={20} /> Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;