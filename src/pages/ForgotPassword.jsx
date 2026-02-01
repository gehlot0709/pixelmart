import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [step, setStep] = useState(1); // 1: Email, 2: OTP & New Password
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const requestOtpHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/forgot-password`, { email });
            setStep(2);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    const resetPasswordHandler = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        setError('');
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/reset-password`, {
                email,
                otp,
                password: newPassword
            });
            alert('Password reset successfully! Please login.');
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center">
            <div className="glass dark:glass-dark p-8 rounded-3xl w-full max-w-md">
                <h2 className="text-3xl font-bold mb-6 text-center text-primary">
                    {step === 1 ? 'Forgot Password' : 'Reset Password'}
                </h2>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                        {error}
                    </div>
                )}

                {step === 1 ? (
                    <form onSubmit={requestOtpHandler} className="space-y-4">
                        <Input
                            label="Enter your email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="email@example.com"
                        />
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Sending OTP...' : 'Send OTP'}
                        </Button>
                    </form>
                ) : (
                    <form onSubmit={resetPasswordHandler} className="space-y-4">
                        <div className="bg-blue-50 text-blue-700 p-3 rounded-lg text-sm mb-4">
                            OTP sent to <strong>{email}</strong>
                        </div>
                        <Input
                            label="Enter 6-digit OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                            placeholder="123456"
                        />
                        <Input
                            label="New Password"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            placeholder="******"
                        />
                        <Input
                            label="Confirm New Password"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            placeholder="******"
                        />
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Resetting...' : 'Reset Password'}
                        </Button>
                        <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="w-full text-sm text-slate-500 hover:text-primary mt-2"
                        >
                            Change Email
                        </button>
                    </form>
                )}

                <div className="mt-6 text-center">
                    <Link to="/login" className="text-sm text-slate-500 hover:text-primary transition">
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
