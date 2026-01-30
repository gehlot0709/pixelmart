

import { motion } from 'framer-motion';

const Button = ({ children, onClick, type = 'button', variant = 'primary', className = '', disabled = false, ...props }) => {
    const baseStyle = "px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg flex items-center justify-center";

    const variants = {
        primary: "bg-gradient-to-r from-primary to-accent text-white hover:shadow-primary/50 hover:scale-105",
        secondary: "bg-white text-primary border border-primary/20 hover:bg-primary/5 hover:scale-105",
        danger: "bg-red-500 text-white hover:bg-red-600 hover:shadow-red-500/50",
        outline: "border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-gray-300 hover:border-primary hover:text-primary"
    };

    return (
        <motion.button
            whileTap={{ scale: 0.95 }}
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseStyle} ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
            {...props}
        >
            {children}
        </motion.button>
    );
};

export default Button;
