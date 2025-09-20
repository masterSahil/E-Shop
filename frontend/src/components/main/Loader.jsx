import React from 'react';
import { motion } from 'framer-motion';

const Loader = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-indigo-700 to-purple-700 flex items-center justify-center z-50">
      <motion.div
        className="w-24 h-24 border-8 border-white border-t-indigo-500 border-b-purple-400 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      ></motion.div>
      <motion.div
        className="absolute top-3/4 text-white text-xl font-bold"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1, repeat: Infinity, repeatType: "reverse" }}
      >
        Loading...
      </motion.div>
    </div>
  );
};

export default Loader;