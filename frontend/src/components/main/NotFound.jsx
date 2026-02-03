import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaLeaf, FaArrowLeft } from 'react-icons/fa';
import { RiSearchLine } from 'react-icons/ri';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#f7fee7] px-6 overflow-hidden relative">
            
            {/* Background Decorative Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-lime-200/30 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-200/20 blur-[120px] rounded-full" />

            {/* Icon/Visual Section */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 100, damping: 15 }}
                className="relative mb-8"
            >
                <div className="w-32 h-32 md:w-40 md:h-40 bg-white rounded-[3rem] shadow-2xl shadow-emerald-900/10 flex items-center justify-center rotate-12 border border-lime-100">
                    <RiSearchLine className="text-lime-500 text-6xl md:text-7xl -rotate-12 animate-pulse" />
                </div>
                <motion.div 
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 3 }}
                    className="absolute -top-4 -right-4 bg-emerald-900 p-4 rounded-2xl shadow-xl"
                >
                    <FaLeaf className="text-lime-400 text-xl" />
                </motion.div>
            </motion.div>

            {/* Text Section */}
            <div className="text-center relative z-10">
                <motion.h1 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-[8rem] md:text-[12rem] font-black text-emerald-950/5 leading-none absolute left-1/2 -translate-x-1/2 -top-20 select-none"
                >
                    404
                </motion.h1>
                
                <motion.h2 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-4xl md:text-6xl font-black text-emerald-950 tracking-tighter mb-4"
                >
                    LOST IN THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-500 to-emerald-600">GARDEN</span>
                </motion.h2>

                <motion.p 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-emerald-800/60 font-bold max-w-md mx-auto mb-10 leading-relaxed"
                >
                    The page you are looking for has been pruned or moved to a different collection. Let's get you back to the shop.
                </motion.p>
            </div>

            {/* Action Buttons */}
            <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-4"
            >
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center justify-center gap-2 px-8 py-4 bg-white text-emerald-900 rounded-full font-black tracking-widest uppercase text-xs border-2 border-emerald-900/5 hover:border-lime-400 transition-all duration-300 shadow-lg shadow-emerald-900/5"
                >
                    <FaArrowLeft /> Go Back
                </button>

                <button
                    onClick={() => navigate('/')}
                    className="flex items-center justify-center gap-2 px-8 py-4 bg-emerald-900 text-lime-400 rounded-full font-black tracking-widest uppercase text-xs hover:bg-emerald-800 transition-all duration-300 shadow-xl shadow-emerald-900/20 group"
                >
                    Return Home 
                    <motion.span animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                        🌿
                    </motion.span>
                </button>
            </motion.div>
        </div>
    );
};

export default NotFound;