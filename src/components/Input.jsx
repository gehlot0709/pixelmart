

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';

const Input = ({ label, type, name, value, onChange, placeholder, icon: Icon, required = false }) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    return (
        <div className="mb-4">
            {label && <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">{label}</label>}
            <div className="relative">
                {Icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Icon size={20} />
                    </div>
                )}
                <input
                    type={isPassword ? (showPassword ? 'text' : 'password') : type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    required={required}
                    className={`w-full ${Icon ? 'pl-10' : 'pl-4'} ${isPassword ? 'pr-12' : 'pr-4'} py-3 bg-white/50 dark:bg-black/20 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent backdrop-blur-sm transition-all text-slate-800 dark:text-white placeholder-slate-400`}
                    placeholder={placeholder}
                />
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-primary transition-colors focus:outline-none"
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                )}
            </div>
        </div>
    );
};

export default Input;
