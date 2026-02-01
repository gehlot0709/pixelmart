import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
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
            setTimer(30); // Reset timer on successful reg
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
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
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'OTP Verification failed');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        try {
            await resendOTP(formData.email);
            setTimer(30);
            setMessage('OTP resent successfully!');
            setError('');
            // Clear success message after 3s
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to resend OTP');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[60vh]">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md p-8 rounded-3xl glass dark:glass-dark overflow-hidden relative"
            >
                <AnimatePresence mode="wait">
                    {step === 1 ? (
                        <motion.div key="step1" exit={{ x: -100, opacity: 0 }}>
                            <h2 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Create Account</h2>
                            <p className="text-center text-slate-500 mb-8">Join PixelMart today</p>

                            {error && <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4 text-center text-sm">{error}</div>}

                            <form onSubmit={handleRegister}>
                                <Input label="Full Name" name="name" type="text" value={formData.name} onChange={handleChange} icon={User} required placeholder="" />
                                <Input label="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} icon={Mail} required placeholder="" />
                                <Input label="Password" name="password" type="password" value={formData.password} onChange={handleChange} icon={Lock} required placeholder="" />

                                <Button type="submit" className="w-full mt-4" disabled={loading}>
                                    {loading ? 'Sending OTP...' : 'Get OTP'}
                                </Button>
                            </form>
                        </motion.div>
                    ) : (
                        <motion.div key="step2" initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                            <h2 className="text-3xl font-bold text-center mb-2 text-primary">Verify Email</h2>
                            <p className="text-center text-slate-500 mb-8">Enter the OTP sent to {formData.email}</p>

                            {error && <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4 text-center text-sm">{error}</div>}
                            {message && <div className="bg-green-100 text-green-600 p-3 rounded-lg mb-4 text-center text-sm">{message}</div>}

                            <form onSubmit={handleVerifyParams}>
                                <div className="flex justify-center mb-6">
                                    <input
                                        type="text"
                                        maxLength="6"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        className="w-full text-center text-3xl tracking-[1rem] py-3 bg-white/50 border border-primary rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                                        placeholder="······"
                                    />
                                </div>
                                <Button type="submit" className="w-full mb-4" disabled={loading}>
                                    {loading ? 'Verifying...' : 'Verify & Register'}
                                </Button>

                                <div className="text-center">
                                    <button
                                        type="button"
                                        onClick={handleResend}
                                        disabled={timer > 0}
                                        className={`text-sm font-medium ${timer > 0 ? 'text-slate-400 cursor-not-allowed' : 'text-primary hover:underline'}`}
                                    >
                                        {timer > 0 ? `Resend OTP in ${timer}s` : 'Resend OTP'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default Register;
