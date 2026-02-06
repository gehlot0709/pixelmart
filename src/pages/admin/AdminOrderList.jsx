import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

import { motion } from 'framer-motion';

import { Check, X, Eye, AlertTriangle } from 'lucide-react';
import API_URL from '../../config';

const AdminOrderList = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchOrders = useCallback(async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
            const { data } = await axios.get(`${API_URL}/api/orders`, config);
            setOrders(data);
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const updateStatus = async (id, status) => {
        try {
            const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
            await axios.put(`${API_URL}/api/orders/${id}/status`, { status }, config);
            fetchOrders();
        } catch (error) {
            alert('Error updating status');
        }
    };

    const markDelivered = async (id) => {
        if (!window.confirm('Mark as Delivered?')) return;
        try {
            const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
            await axios.put(`${API_URL}/api/orders/${id}/deliver`, {}, config);
            fetchOrders();
        } catch (error) {
            alert('Error');
        }
    };

    const filteredOrders = orders.filter(o =>
        o._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.user?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Calculate pending deliveries
    const pendingDeliveries = orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled' && o.isPaid).length;

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h1 className="text-3xl font-bold">Orders</h1>
                <div className="flex items-center space-x-4 w-full md:w-auto">
                    <input
                        type="text"
                        placeholder="Search ID or User..."
                        className="glass dark:glass-dark px-4 py-2 rounded-xl border-none focus:ring-2 focus:ring-indigo-500 w-full md:w-64"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {pendingDeliveries > 0 && (
                        <motion.div
                            initial={{ scale: 0.9 }} animate={{ scale: 1 }}
                            className="bg-orange-100 text-orange-600 px-4 py-2 rounded-xl flex items-center font-bold whitespace-nowrap"
                        >
                            <AlertTriangle size={18} className="mr-2" />
                            {pendingDeliveries} Pending
                        </motion.div>
                    )}
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-xl overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-100 dark:bg-slate-700">
                        <tr>
                            <th className="p-4">ID</th>
                            <th className="p-4">USER</th>
                            <th className="p-4">DATE</th>
                            <th className="p-4">TOTAL</th>
                            <th className="p-4">STATUS</th>
                            <th className="p-4">ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOrders.map(order => (
                            <tr key={order._id} className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                <td className="p-4 text-xs font-mono">{order._id.substring(0, 8)}...</td>
                                <td className="p-4">
                                    <div className="font-semibold">{order.user?.name}</div>
                                    <div className="text-xs text-slate-500">{order.paymentMethod}</div>
                                </td>
                                <td className="p-4 text-sm">{new Date(order.createdAt).toLocaleDateString()}</td>
                                <td className="p-4 font-bold">₹{order.totalPrice}</td>
                                <td className="p-4">
                                    <select
                                        value={order.status}
                                        onChange={(e) => updateStatus(order._id, e.target.value)}
                                        className={`text-sm font-bold px-3 py-1 rounded-lg border-none focus:ring-0 cursor-pointer ${order.status === 'Delivered' ? 'bg-green-100 text-green-600' :
                                                order.status === 'Cancelled' ? 'bg-red-100 text-red-600' :
                                                    order.status === 'Paid' ? 'bg-blue-100 text-blue-600' :
                                                        'bg-orange-100 text-orange-600'
                                            }`}
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Paid">Paid</option>
                                        <option value="Processing">Processing</option>
                                        <option value="Shipped">Shipped</option>
                                        <option value="Delivered">Delivered</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select>
                                </td>
                                <td className="p-4">
                                    <div className="flex space-x-2">
                                        {order.paymentMethod === 'QR Code' && order.paymentResult?.screenshot && (
                                            <a
                                                href={`${API_URL}${order.paymentResult.screenshot}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="p-2 bg-blue-50 text-blue-500 rounded-lg"
                                                title="View Payment Proof"
                                            >
                                                <Eye size={18} />
                                            </a>
                                        )}
                                        {!order.isDelivered && order.status !== 'Cancelled' && (
                                            <button
                                                onClick={() => updateStatus(order._id, 'Delivered')}
                                                className="p-2 bg-green-50 text-green-500 rounded-lg"
                                                title="Mark Delivered"
                                            >
                                                <Check size={18} />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminOrderList;
