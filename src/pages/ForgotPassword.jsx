import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Input from '../components/Input';
import Button from '../components/Button';
import API_URL from '../config';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [step, setStep] = useState(1); // 1: Email, 2: OTP & New Password
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [timer, setTimer] = useState(30);

    // Timer Logic for Step 2
    useEffect(() => {
        let interval;
        if (step === 2 && timer > 0) {
            interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
        }
        return () => clearInterval(interval);
    }, [step, timer]);

    const navigate = useNavigate();

    const requestOtpHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');
        try {
            await axios.post(`${API_URL}/api/auth/forgot-password`, { email });
            setStep(2);
            setTimer(60);
            toast.success('Security key dispatched to your email.');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Request failed');
        } finally {
            setLoading(false);
        }
    };

    const resendOtpHandler = async () => {
        setLoading(true);
        setError('');
        setMessage('');
        try {
            await axios.post(`${API_URL}/api/auth/forgot-password`, { email });
            setMessage('New security key dispatched.');
            setTimer(30);
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Retry Dispatch Failed');
        } finally {
            setLoading(false);
        }
    };

    const resetPasswordHandler = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError('Credential mismatch');
            return;
        }

        setLoading(true);
        setError('');
        try {
            await axios.post(`${API_URL}/api/auth/reset-password`, {
                email,
                otp,
                password: newPassword
            });
            toast.success('Security credentials updated successfully.');
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Verification Error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white min-h-[90vh] flex flex-col justify-center py-12 px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-12">
                <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 mb-4">
                    Forgot <span className="text-slate-700 italic font-light">Password</span>
                </h1>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">
                    {step === 1 ? 'Reset your account password' : 'OTP Verification'}
                </p>
            </div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white px-8 py-12 border border-slate-100 rounded-[2.5rem] shadow-2xl shadow-slate-200/50">
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

                    {step === 1 ? (
                        <form onSubmit={requestOtpHandler} className="space-y-8">
                            <Input
                                label="Your Email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="IDENTITY@DOMAIN.COM"
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full h-14 bg-slate-900 text-white rounded-xl font-black uppercase tracking-widest text-[10px] shadow-xl hover:bg-primary transition-all active:scale-95 disabled:opacity-50"
                            >
                                {loading ? 'Sending...' : 'Send OTP'}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={resetPasswordHandler} className="space-y-8">
                            <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-center">
                                <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">
                                    OTP Code sent to <span className="text-slate-900 font-black">{email}</span>
                                </p>
                            </div>

                            <Input
                                label="OTP Code"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                                placeholder=""
                            />

                            <Input
                                label="New Password"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                placeholder=""
                            />

                            <Input
                                label="Confirm New Password"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                placeholder=""
                            />

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full h-14 bg-slate-900 text-white rounded-xl font-black uppercase tracking-widest text-[10px] shadow-xl hover:bg-primary transition-all active:scale-95 disabled:opacity-50"
                            >
                                {loading ? 'Updating...' : 'Reset Password'}
                            </button>

                            <div className="text-center pt-4">
                                <button
                                    type="button"
                                    onClick={resendOtpHandler}
                                    disabled={timer > 0 || loading}
                                    className={`text-[9px] font-black uppercase tracking-widest ${timer > 0 || loading ? 'text-slate-400' : 'text-slate-900 hover:text-primary transition-colors underline decoration-slate-300 underline-offset-4'}`}
                                >
                                    {timer > 0 ? `Resend OTP in ${timer}s` : 'Resend OTP'}
                                </button>
                            </div>

                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="w-full text-[8px] font-black text-slate-600 hover:text-slate-900 uppercase tracking-[0.3em] transition-colors"
                            >
                                Incorrect Endpoint? Update
                            </button>
                        </form>
                    )}

                    <div className="mt-12 pt-8 border-t border-slate-50 text-center">
                        <Link to="/login" className="text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-slate-900 transition-colors underline decoration-slate-300 underline-offset-4">
                            Return To Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
