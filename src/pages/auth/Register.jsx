import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Lock } from 'lucide-react';
import Input from '../../components/Input';
import Button from '../../components/Button';

const Register = () => {
    const [step, setStep] = useState(1); // 1: Register, 2: OTP
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [otp, setOtp] = useState('');
    const { register, verifyOTP, resendOTP } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [timer, setTimer] = useState(30);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    // Timer Logic
    useEffect(() => {
        let interval;
        if (step === 2 && timer > 0) {
            interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
        }
        return () => clearInterval(interval);
    }, [step, timer]);

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await register(formData);
            setStep(2);
            setTimer(30);
            setError('');
            toast.success('Security key dispatched to your email.');
        } catch (err) {
            const msg = err.response?.data?.message || 'Onboarding failed';
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyParams = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await verifyOTP(formData.email, otp);
            toast.success('Account created successfully');
            navigate('/');
        } catch (err) {
            const msg = err.response?.data?.message || 'Verification Error';
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        try {
            await resendOTP(formData.email);
            setTimer(30);
            setMessage('New security key dispatched.');
            setError('');
            toast.info('New OTP sent successfully');
            // Clear success message after 3s
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            const msg = err.response?.data?.message || 'Retry failed';
            setError(msg);
            toast.error(msg);
        }
    };

    return (
        <div className="bg-white min-h-[90vh] flex flex-col justify-center py-12 px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-12">
                <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 mb-4">
                    Create <span className="text-slate-400 italic font-light">Account</span>
                </h1>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                    {step === 1 ? 'Join PixelMart today' : 'OTP Verification'}
                </p>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="sm:mx-auto sm:w-full sm:max-w-[480px]"
            >
                <div className="bg-white px-8 py-12 border border-slate-100 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 relative overflow-hidden">
                    <AnimatePresence mode="wait">
                        {step === 1 ? (
                            <motion.div key="step1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ x: -20, opacity: 0 }}>
                                {error && (
                                    <div className="mb-8 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-[10px] font-black uppercase tracking-widest text-center">
                                        {error}
                                    </div>
                                )}

                                <form onSubmit={handleRegister} className="space-y-6">
                                    <Input label="Full Name" name="name" value={formData.name} onChange={handleChange} required placeholder="" />
                                    <Input label="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} required placeholder="" />
                                    <Input label="Password" name="password" type="password" value={formData.password} onChange={handleChange} required placeholder="" />

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full h-14 bg-slate-900 text-white rounded-xl font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-slate-900/10 hover:bg-primary transition-all active:scale-95 disabled:opacity-50 mt-4"
                                    >
                                        {loading ? 'Processing...' : 'Sign Up'}
                                    </button>
                                </form>

                                <div className="mt-12 pt-8 border-t border-slate-50 text-center">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                        Already a member?{' '}
                                        <Link to="/login" className="text-slate-900 hover:text-primary underline decoration-slate-200 underline-offset-4">
                                            Sign In
                                        </Link>
                                    </p>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div key="step2" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                                <div className="text-center mb-10">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                                        Verification key dispatched to<br />
                                        <span className="text-slate-900 font-black">{formData.email}</span>
                                    </p>
                                </div>

                                {error && (
                                    <div className="mb-8 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-[10px] font-black uppercase tracking-widest text-center">
                                        {error}
                                    </div>
                                )}
                                {message && (
                                    <div className="mb-8 p-4 bg-green-50 border border-green-100 text-green-600 rounded-xl text-[10px] font-black uppercase tracking-widest text-center">
                                        {message}
                                    </div>
                                )}

                                <form onSubmit={handleVerifyParams} className="space-y-10">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            maxLength="6"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            className="w-full text-center text-4xl tracking-[1rem] py-6 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-slate-900 transition-all font-black text-slate-900"
                                            placeholder=""
                                        />
                                        <p className="absolute -bottom-6 left-0 right-0 text-center text-[8px] font-black uppercase tracking-widest text-slate-300">Enter Verified Key</p>
                                    </div>

                                    <div className="space-y-4 pt-4">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full h-14 bg-slate-900 text-white rounded-xl font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-slate-900/10 hover:bg-primary transition-all active:scale-95 disabled:opacity-50"
                                        >
                                            {loading ? 'Verifying...' : 'Verify & Sign Up'}
                                        </button>

                                        <div className="text-center">
                                            <button
                                                type="button"
                                                onClick={handleResend}
                                                disabled={timer > 0}
                                                className={`text-[9px] font-black uppercase tracking-widest ${timer > 0 ? 'text-slate-300' : 'text-slate-900 hover:text-primary transition-colors underline decoration-slate-200 underline-offset-4'}`}
                                            >
                                                {timer > 0 ? `Retry in ${timer}s` : 'Request New Key'}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="mt-10 text-center opacity-40">
                    <span className="text-[8px] font-black uppercase tracking-[0.4em] text-slate-400">Encrypted Onboarding Endpoint</span>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
