import React, { useEffect, useState } from 'react';
import { ShoppingCart, LogOut } from 'lucide-react';
import { FaShoppingCart, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LoginContext } from '../context/Context';
import { useContext } from 'react';

const Navbar = () => {

    const navigate = useNavigate();
    const URL = import.meta.env.VITE_REMOVE_COOKIE_URL;
    const { setIsLogin } = useContext(LoginContext);

    const logout = async () => {
        try {
            await axios.get(URL, { withCredentials: true });
            localStorage.clear();
            navigate('/login');
            window.location.reload();
            setIsLogin(false);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <nav className="bg-white shadow-md p-4 flex justify-between items-center sticky top-0 z-10">
                <div className="flex items-center space-x-4">
                    <h1 className="text-3xl font-extrabold text-indigo-700 cursor-pointer" onClick={()=>navigate('/')}>E-Shop</h1>
                    <div className="hidden md:flex space-x-6 text-gray-600 font-medium">
                        <button className="hover:text-indigo-700 transition-colors duration-200"
                            onClick={()=>navigate('/about')}>About Us</button>
                        <button className="hover:text-indigo-700 transition-colors duration-200"
                            onClick={()=>navigate('/setting')}>Settings</button>
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <button onClick={()=>navigate('/cart')}
                            className="relative p-2 rounded-full bg-indigo-100 text-indigo-700 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                            aria-label="Toggle Cart"
                        >
                            <FaShoppingCart className="h-6 w-6" />
                        </button>
                    </div>
                    <button onClick={logout}
                        className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200" >
                        <FaSignOutAlt className="mr-2" />
                        Logout
                    </button>
                </div>
            </nav>
        </>
    );
};

export default Navbar;
