import { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, ShoppingCart, Package } from 'lucide-react';
import API_URL from '../../config';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalSales: 0,
        topProducts: [],
        weeklySales: [],
        monthlySales: []
    });
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

    if (loading) return <div>Loading Stats...</div>;

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">Dashboard</h1>

            {/* Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
                        <h3 className="text-lg font-bold truncate w-32" title={stats.topProducts[0]?.title}>
                            {stats.topProducts[0]?.title || 'N/A'}
                        </h3>
                    </div>
                </div>
                <div className="glass dark:glass-dark p-6 rounded-3xl flex items-center space-x-4">
                    <div className="p-4 bg-red-100 text-red-600 rounded-full">
                        <Package size={32} />
                    </div>
                    <div>
                        <p className="text-slate-500">Low Stock</p>
                        <h3 className="text-2xl font-bold text-red-500">
                            {stats.lowStockCount || 0}
                        </h3>
                    </div>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 gap-8">
                <div className="glass dark:glass-dark p-6 rounded-3xl h-96">
                    <h3 className="text-xl font-bold mb-6">Weekly Sales Trend</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={stats.weeklySales}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="sales" fill="#6366f1" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Top Products Table */}
            <div className="glass dark:glass-dark p-6 rounded-3xl">
                <h3 className="text-xl font-bold mb-6">Top Selling Products</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-slate-500 border-b border-slate-100 dark:border-slate-700">
                                <th className="pb-4">Product</th>
                                <th className="pb-4">Sold Qty</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats.topProducts.map((product, index) => (
                                <tr key={index} className="border-b border-slate-100 dark:border-slate-700 last:border-0">
                                    <td className="py-4">
                                        <div className="flex items-center space-x-3">
                                            <img src={product.image} alt={product.title} className="w-10 h-10 rounded-lg object-cover" />
                                            <span className="font-medium truncate w-48">{product.title}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 font-bold">{product.totalQty}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
