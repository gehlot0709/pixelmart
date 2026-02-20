import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import { motion } from 'framer-motion';
import { Mail, Lock } from 'lucide-react';
import Input from '../../components/Input';
import Button from '../../components/Button';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await login(email, password);
            toast.success('Sign in successful');
            navigate('/');
        } catch (err) {
            const msg = err.response?.data?.message || 'Verification Failed';
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white min-h-[90vh] flex flex-col justify-center py-12 px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-12">
                <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 mb-4">
                    Welcome <span className="text-slate-400 italic font-light">Back</span>
                </h1>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                    Access your curated collection
                </p>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="sm:mx-auto sm:w-full sm:max-w-[440px]"
            >
                <div className="bg-white px-8 py-12 border border-slate-100 rounded-[2.5rem] shadow-2xl shadow-slate-200/50">
                    {error && (
                        <div className="mb-8 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-[10px] font-black uppercase tracking-widest text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <Input
                            label="Email Address"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder=""
                            required
                        />
                        <div>
                            <Input
                                label="Password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder=""
                                required
                            />
                            <div className="mt-4 text-right">
                                <Link to="/forgot-password" title="Forgot Password" className="text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors underline decoration-slate-200 underline-offset-4">
                                    Forgot Password?
                                </Link>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-14 bg-slate-900 text-white rounded-xl font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-slate-900/10 hover:bg-primary transition-all active:scale-95 disabled:opacity-50"
                        >
                            {loading ? 'Authenticating...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="mt-12 pt-8 border-t border-slate-50 text-center">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                            New to PixelMart?{' '}
                            <Link to="/register" className="text-slate-900 hover:text-primary underline decoration-slate-200 underline-offset-4">
                                Create Account
                            </Link>
                        </p>
                    </div>
                </div>

                <div className="mt-10 text-center opacity-40">
                    <span className="text-[8px] font-black uppercase tracking-[0.4em] text-slate-400">Secure Encrypted Session</span>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
