import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

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
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[60vh]">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md p-8 rounded-3xl glass dark:glass-dark"
            >
                <h2 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Welcome Back</h2>
                <p className="text-center text-slate-500 dark:text-gray-400 mb-8">Login to continue shopping</p>

                {error && <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4 text-center text-sm">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <Input
                        label="Email Address"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        icon={Mail}
                        placeholder=""
                        required
                    />
                    <Input
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        icon={Lock}
                        placeholder=""
                        required
                    />

                    <div className="flex justify-end mb-6">
                        <Link to="/forgot-password" className="text-sm text-primary hover:underline">Forgot Password?</Link>
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </Button>
                </form>

                <p className="text-center mt-6 text-sm text-slate-500">
                    Don't have an account? <a href="/register" className="text-primary font-semibold hover:underline">Register</a>
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
