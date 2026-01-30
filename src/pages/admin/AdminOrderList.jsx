import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

import { motion } from 'framer-motion';
import { Check, X, Eye, AlertTriangle } from 'lucide-react';

const AdminOrderList = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = useCallback(async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
            const { data } = await axios.get('http://localhost:5000/api/orders', config);
            setOrders(data);
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const markDelivered = async (id) => {
        if (!window.confirm('Mark as Delivered?')) return;
        try {
            const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
            await axios.put(`http://localhost:5000/api/orders/${id}/deliver`, {}, config);
            fetchOrders();
        } catch (error) {
            alert('Error');
        }
    };

    // Calculate pending deliveries
    const pendingDeliveries = orders.filter(o => !o.isDelivered && o.isPaid).length;

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Orders</h1>
                {pendingDeliveries > 0 && (
                    <motion.div
                        initial={{ scale: 0.9 }} animate={{ scale: 1 }}
                        className="bg-orange-100 text-orange-600 px-4 py-2 rounded-xl flex items-center font-bold"
                    >
                        <AlertTriangle className="mr-2" />
                        {pendingDeliveries} Orders Pending Delivery!
                    </motion.div>
                )}
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-xl">
                <table className="w-full text-left">
                    <thead className="bg-slate-100 dark:bg-slate-700">
                        <tr>
                            <th className="p-4">ID</th>
                            <th className="p-4">USER</th>
                            <th className="p-4">DATE</th>
                            <th className="p-4">TOTAL</th>
                            <th className="p-4">PAID</th>
                            <th className="p-4">DELIVERED</th>
                            <th className="p-4">ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order._id} className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                <td className="p-4 text-sm font-mono">{order._id.substring(0, 8)}...</td>
                                <td className="p-4 font-semibold">{order.user?.name}</td>
                                <td className="p-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                                <td className="p-4 font-bold">₹{order.totalPrice}</td>
                                <td className="p-4">
                                    {order.isPaid ? (
                                        <span className="text-green-500 flex items-center"><Check size={16} className="mr-1" /> Paid</span>
                                    ) : (
                                        <span className="text-red-500 flex items-center"><X size={16} className="mr-1" /> Pending</span>
                                    )}
                                    {order.paymentMethod === 'QR Code' && order.paymentResult?.screenshot && (
                                        <a href={`http://localhost:5000${order.paymentResult.screenshot}`} target="_blank" rel="noreferrer" className="text-xs text-blue-500 block mt-1 hover:underline">View Proof</a>
                                    )}
                                </td>
                                <td className="p-4">
                                    {order.isDelivered ? (
                                        <span className="text-green-500 flex items-center"><Check size={16} className="mr-1" /> Delivered</span>
                                    ) : (
                                        <button
                                            onClick={() => markDelivered(order._id)}
                                            className="text-orange-500 hover:text-orange-600 text-sm font-bold bg-orange-100 px-3 py-1 rounded-lg"
                                        >
                                            Mark Delivered
                                        </button>
                                    )}
                                </td>
                                <td className="p-4">
                                    <button className="p-2 hover:bg-slate-100 rounded-lg">
                                        <Eye size={18} className="text-slate-500" />
                                    </button>
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
