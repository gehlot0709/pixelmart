import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle, XCircle, Key, ArrowRight } from 'lucide-react';
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
      const safeApiUrl = API_URL || "https://pixelmartserver.vercel.app";
      const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
      await axios.put(`${safeApiUrl}/api/auth/change-password`, { currentPassword, newPassword }, config);
      setPassMessage('Password Updated');
      toast.success('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowPassForm(false);
    } catch (error) {
      const msg = error.response?.data?.message || 'Update failed';
      setPassError(msg);
      toast.error(msg);
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
        const safeApiUrl = API_URL || "https://pixelmartserver.vercel.app";
        const { data } = await axios.get(
          `${safeApiUrl}/api/orders/myorders`,
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

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-48 animate-pulse">
      <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
      <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Loading Profile...</p>
    </div>
  );

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-24">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div className="max-w-xl">
            <h1 className="text-4xl md:text-7xl font-black tracking-tighter text-slate-900 mb-4">
              Your <span className="text-slate-400 italic font-light">Account</span>
            </h1>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
              Manage your orders and security settings
            </p>
          </div>
          <button
            onClick={() => setShowPassForm(!showPassForm)}
            className="flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-slate-900/10 transition-all hover:bg-primary active:scale-95"
          >
            <Key size={14} /> {showPassForm ? 'Cancel Update' : 'Change Password'}
          </button>
        </div>

        <AnimatePresence>
          {showPassForm && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100 mb-20 overflow-hidden"
            >
              <h2 className="text-xs font-black mb-10 uppercase tracking-[0.4em] text-slate-900">Change Password</h2>

              {passError && (
                <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl mb-8 font-bold text-[10px] uppercase tracking-widest">
                  {passError}
                </div>
              )}

              {passMessage && (
                <div className="p-4 bg-green-50 border border-green-100 text-green-600 rounded-xl mb-8 font-black text-[10px] uppercase tracking-widest">
                  {passMessage}
                </div>
              )}

              <form onSubmit={handleChangePassword} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Input label="Current Password" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
                <Input label="New Password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                <Input label="Confirm New Password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                <div className="md:col-span-3">
                  <button
                    type="submit"
                    disabled={passLoading}
                    className="px-12 h-14 bg-slate-900 text-white rounded-xl font-black uppercase tracking-widest text-[10px] shadow-xl hover:bg-primary disabled:opacity-50 transition-all"
                  >
                    {passLoading ? 'Verifying...' : 'Update Password'}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-12">
          <h2 className="text-xs font-black uppercase tracking-[0.4em] text-slate-900 border-b border-slate-100 pb-6">Order History</h2>

          {orders.length === 0 ? (
            <div className="text-center py-40 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
              <Clock size={32} className="mx-auto text-slate-300 mb-6" />
              <h2 className="text-xl font-bold text-slate-900 mb-4">No acquisitions found.</h2>
              <Link to="/shop">
                <button className="px-8 py-4 bg-slate-900 text-white rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-primary transition-all">
                  Browse Collection
                </button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {orders.map((order, idx) => (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group p-8 rounded-3xl border border-slate-100 bg-white hover:border-slate-200 transition-all hover:shadow-sm"
                >
                  <div className="flex flex-col lg:flex-row justify-between gap-8">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-4 mb-6">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Order #{order._id.slice(-8)}</span>
                        <span className={`px-3 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest ${order.isDelivered ? 'bg-green-50 text-green-600' :
                          order.isPaid ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'
                          }`}>
                          {order.isDelivered ? 'Delivered' : order.isPaid ? 'In Transit' : 'Payment Pending'}
                        </span>
                        <div className="flex items-center gap-2 text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-auto">
                          <Clock size={12} />
                          <span>{new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                        {order.orderItems.map((item, index) => (
                          <div key={index} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className="w-16 h-16 rounded-xl bg-white p-2 overflow-hidden border border-slate-100 flex-shrink-0">
                              <img src={(() => {
                                if (item.image.startsWith('http') && !item.image.includes('localhost:5000')) return item.image;
                                let path = item.image.replace(/^http:\/\/localhost:5000/, '').replace(/^\/uploads\//, '/assets/').replace(/^\/server\/uploads\//, '/assets/');
                                return path.startsWith('/') ? path : `${API_URL}${path}`;
                              })()} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                            </div>
                            <div className="min-w-0">
                              <h4 className="text-xs font-bold text-slate-900 truncate">{item.name}</h4>
                              <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest mt-1">{item.qty} × {item.size || 'STD'}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="lg:w-48 flex flex-col justify-between items-end">
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Value</p>
                        <p className="text-2xl font-bold text-slate-900 tracking-tighter">₹{order.totalPrice.toLocaleString()}</p>
                      </div>
                      <div className="mt-6 flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-slate-400">
                        {order.paymentMethod} Confirmation <CheckCircle size={12} className={order.isPaid ? 'text-green-500' : 'text-slate-200'} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
