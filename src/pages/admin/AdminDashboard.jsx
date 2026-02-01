import { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, ShoppingCart, Package } from 'lucide-react';
import API_URL from '../../config';

const AdminDashboard = () => {
    const [stats, setStats] = useState({ totalOrders: 0, totalSales: 0, topProducts: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
                const { data } = await axios.get(`${API_URL}/api/orders/stats/sales`, config);
                setStats(data);
            } catch (error) {
                console.error(error);
            }
            setLoading(false);
        };
        fetchStats();
    }, []);

    // Mock Data for Charts (since backend aggregation was simplified in code)
    const salesData = [
        { name: 'Jan', sales: 4000 },
        { name: 'Feb', sales: 3000 },
        { name: 'Mar', sales: 5000 },
        { name: 'Apr', sales: 2780 },
        { name: 'May', sales: 1890 },
        { name: 'Jun', sales: 2390 },
    ];

    if (loading) return <div>Loading Stats...</div>;

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">Dashboard</h1>

            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass dark:glass-dark p-6 rounded-3xl flex items-center space-x-4">
                    <div className="p-4 bg-green-100 text-green-600 rounded-full">
                        <DollarSign size={32} />
                    </div>
                    <div>
                        <p className="text-slate-500">Total Sales</p>
                        <h3 className="text-2xl font-bold">₹{stats.totalSales}</h3>
                    </div>
                </div>
                <div className="glass dark:glass-dark p-6 rounded-3xl flex items-center space-x-4">
                    <div className="p-4 bg-blue-100 text-blue-600 rounded-full">
                        <ShoppingCart size={32} />
                    </div>
                    <div>
                        <p className="text-slate-500">Total Orders</p>
                        <h3 className="text-2xl font-bold">{stats.totalOrders}</h3>
                    </div>
                </div>
                <div className="glass dark:glass-dark p-6 rounded-3xl flex items-center space-x-4">
                    <div className="p-4 bg-purple-100 text-purple-600 rounded-full">
                        <Package size={32} />
                    </div>
                    <div>
                        <p className="text-slate-500">Top Product</p>
                        <h3 className="text-lg font-bold truncate w-32">{stats.topProducts[0]?.title || 'N/A'}</h3>
                    </div>
                </div>
            </div>

            {/* Charts */}
            <div className="glass dark:glass-dark p-6 rounded-3xl h-96">
                <h3 className="text-xl font-bold mb-6">Sales Overview</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={salesData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="sales" fill="#6366f1" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default AdminDashboard;
