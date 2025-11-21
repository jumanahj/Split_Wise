import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      className={`bg-gray-800/50 backdrop-blur-lg border border-white/10 rounded-2xl shadow-lg p-6 ${className}`}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};

export default Card;