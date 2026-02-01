import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Clock, CheckCircle, XCircle, Key } from 'lucide-react';
import Input from '../components/Input';
import Button from '../components/Button';
import API_URL from '../config';

const Profile = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Change Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passMessage, setPassMessage] = useState('');
  const [passError, setPassError] = useState('');
  const [showPassForm, setShowPassForm] = useState(false);

  const [passLoading, setPassLoading] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPassMessage('');
    setPassError('');
    setPassLoading(true);

    if (newPassword !== confirmPassword) {
      setPassError('New passwords do not match');
      setPassLoading(false);
      return;
    }

    try {
      const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
      await axios.put(`${import.meta.env.VITE_API_URL}/api/auth/change-password`, { currentPassword, newPassword }, config);
      setPassMessage('Password changed successfully');
      alert('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowPassForm(false);
    } catch (error) {
      setPassError(error.response?.data?.message || 'Failed to update password');
    } finally {
      setPassLoading(false);
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        };
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/orders/myorders`,
          config
        );
        setOrders(data);
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };

    fetchOrders();
  }, []);

  if (loading) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto">

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Profile</h1>
        <button
          onClick={() => setShowPassForm(!showPassForm)}
          className="flex items-center gap-2 text-primary font-medium hover:underline bg-primary/10 px-4 py-2 rounded-lg"
        >
          <Key size={18} /> {showPassForm ? 'Cancel' : 'Change Password'}
        </button>
      </div>

      {showPassForm && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="glass dark:glass-dark p-6 rounded-3xl mb-8">
          <h2 className="text-xl font-bold mb-4">Change Password</h2>
          {passError && <p className="text-red-500 mb-2">{passError}</p>}
          {passMessage && <p className="text-green-500 mb-2">{passMessage}</p>}
          <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
            <Input label="Current Password" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
            <Input label="New Password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
            <Input label="Confirm New Password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            <Button type="submit" disabled={passLoading}>{passLoading ? 'Updating...' : 'Update Password'}</Button>
          </form>
        </motion.div>
      )}

      <h2 className="text-2xl font-bold mb-6">My Orders</h2>

      {orders.length === 0 ? (
        <div className="text-center glass dark:glass-dark p-12 rounded-3xl">
          <p className="text-xl">You have no orders yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass dark:glass-dark p-6 rounded-3xl"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-6 border-b border-gray-100 dark:border-gray-700">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm font-medium text-slate-500">Order ID: #{order._id}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.isDelivered
                      ? 'bg-green-100 text-green-700'
                      : order.isPaid
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-yellow-100 text-yellow-700'
                      }`}>
                      {order.isDelivered ? 'Delivered' : order.isPaid ? 'Processing' : 'Pending Verification'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Clock size={16} />
                    <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="mt-4 md:mt-0 text-right">
                  <p className="text-2xl font-bold text-primary">₹{order.totalPrice}</p>
                  <p className="text-sm text-slate-500">{order.paymentMethod}</p>
                </div>
              </div>

              <div className="space-y-4">
                {order.orderItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-800 dark:text-gray-200">{item.name}</h4>
                      <p className="text-sm text-slate-500">Qty: {item.qty} x ₹{item.price}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-600">
                <div>
                  <h5 className="font-bold mb-1">Shipping Address</h5>
                  <p>{order.shippingAddress.address}, {order.shippingAddress.city}</p>
                  <p>{order.shippingAddress.postalCode}, {order.shippingAddress.country}</p>
                  <p>Phone: {order.shippingAddress.phone}</p>
                </div>
                <div className="flex flex-col items-start md:items-end gap-2">
                  {order.isDelivered ? (
                    <div className="flex items-center gap-2 text-green-600 font-bold">
                      <CheckCircle size={18} /> Delivered
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-orange-500 font-medium">
                      <Clock size={18} /> On the way
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;
