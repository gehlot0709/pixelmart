import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
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
      setPassMessage('Identity Cipher Updated');
      alert('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowPassForm(false);
    } catch (error) {
      setPassError(error.response?.data?.message || 'Update failed');
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
      <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Synchronizing Nexus...</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
        <div className="max-w-xl">
          <span className="text-primary font-black uppercase tracking-[0.5em] text-[10px] mb-4 block underline decoration-primary/30 decoration-4 underline-offset-8">Private Domain</span>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">
            Identity <span className="text-gradient italic">Nexus</span>
          </h1>
        </div>
        <button
          onClick={() => setShowPassForm(!showPassForm)}
          className="flex items-center gap-3 bg-slate-900 dark:bg-white text-white dark:text-black px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl transition-premium hover:-translate-y-1 active:scale-95"
        >
          <Key size={18} /> {showPassForm ? 'Close Vault' : 'Secure Cipher'}
        </button>
      </div>

      <AnimatePresence>
        {showPassForm && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            className="glass dark:glass-dark p-10 rounded-[3rem] border border-white/20 mb-16 overflow-hidden"
          >
            <h2 className="text-2xl font-black mb-8 uppercase italic tracking-tight">Identity Cipher Update</h2>
            {passError && <p className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl mb-6 font-bold text-sm">{passError}</p>}
            {passMessage && <p className="p-4 bg-green-500/10 border border-green-500/20 text-green-500 rounded-xl mb-6 font-bold text-sm uppercase tracking-widest">{passMessage}</p>}
            <form onSubmit={handleChangePassword} className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Input label="Current Master Key" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
              <Input label="New Master Key" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
              <Input label="Confirm New Key" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
              <div className="md:col-span-3">
                <Button type="submit" disabled={passLoading}>{passLoading ? 'Encrypting...' : 'Seal New Cipher'}</Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mb-8">
        <h2 className="text-3xl font-black tracking-tighter uppercase italic decoration-primary decoration-4 underline underline-offset-8 mb-8">Transaction History</h2>

        {orders.length === 0 ? (
          <div className="text-center py-32 glass dark:glass-dark rounded-[4rem] border-4 border-dashed border-slate-100 dark:border-slate-800">
            <Clock size={48} className="mx-auto text-slate-200 mb-6" />
            <h2 className="text-2xl font-black text-slate-300 uppercase tracking-widest">No Legends Written Yet.</h2>
            <Link to="/shop" className="text-primary font-black uppercase tracking-widest text-xs mt-4 inline-block hover:underline underline-offset-4">Begin Your Journey →</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {orders.map((order, idx) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group glass dark:glass-dark p-8 rounded-[3rem] border border-white/20 hover:border-primary/20 transition-premium shadow-2xl shadow-slate-200/50 dark:shadow-none"
              >
                <div className="flex justify-between items-start mb-8 pb-8 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-3 py-1 bg-slate-50 dark:bg-slate-900 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-400 border border-slate-100 dark:border-slate-800">#{order._id.slice(-8)}</span>
                      <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-xl ${order.isDelivered ? 'bg-green-500 text-white shadow-green-500/20' :
                        order.isPaid ? 'bg-blue-500 text-white shadow-blue-500/20' : 'bg-amber-500 text-white shadow-amber-500/20'
                        }`}>
                        {order.isDelivered ? 'Manifested' : order.isPaid ? 'In Flux' : 'Awaiting Seal'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <Clock size={14} className="text-primary" />
                      <span>{new Date(order.createdAt).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">₹{order.totalPrice}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">{order.paymentMethod}</p>
                  </div>
                </div>

                <div className="space-y-6 mb-8 max-h-48 overflow-y-auto pr-4 no-scrollbar">
                  {order.orderItems.map((item, index) => (
                    <div key={index} className="flex items-center gap-6 group/item">
                      <div className="w-16 h-16 rounded-2xl bg-white/50 p-1 flex-shrink-0 overflow-hidden">
                        <img src={item.image.startsWith('http') ? item.image : `${API_URL}${item.image}`} alt={item.name} className="w-full h-full object-contain mix-blend-multiply group-hover/item:scale-110 transition-premium" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-black text-slate-900 dark:text-white line-clamp-1">{item.name}</h4>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 italic">{item.qty} Volume × {item.size || 'Unique'}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-8 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                  <div className="flex -space-x-3 overflow-hidden">
                    {order.orderItems.slice(0, 3).map((item, i) => (
                      <div key={i} className="inline-block h-8 w-8 rounded-full ring-4 ring-white dark:ring-slate-900 bg-slate-200 dark:bg-slate-700 overflow-hidden">
                        <img src={item.image.startsWith('http') ? item.image : `${API_URL}${item.image}`} className="h-full w-full object-cover" alt="" />
                      </div>
                    ))}
                    {order.orderItems.length > 3 && (
                      <div className="flex items-center justify-center h-8 w-8 rounded-full ring-4 ring-white dark:ring-slate-900 bg-slate-900 dark:bg-white text-white dark:text-black text-[10px] font-black">
                        +{order.orderItems.length - 3}
                      </div>
                    )}
                  </div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    Finalized Transaction <CheckCircle size={14} className="text-green-500" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
