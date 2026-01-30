

import { motion } from 'framer-motion';

const Input = ({ label, type, name, value, onChange, placeholder, icon: Icon, required = false }) => {
    return (
        <div className="mb-4">
            {label && <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">{label}</label>}
            <div className="relative">
                {Icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Icon size={20} />
                    </div>
                )}
                <input
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    required={required}
                    className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-3 bg-white/50 dark:bg-black/20 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent backdrop-blur-sm transition-all text-slate-800 dark:text-white placeholder-slate-400`}
                    placeholder={placeholder}
                />
            </div>
        </div>
    );
};

export default Input;
