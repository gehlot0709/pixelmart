import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { UserCheck, UserX, Search } from 'lucide-react';
import { toast } from 'react-toastify';
import API_URL from '../../config';

const AdminUserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchUsers = useCallback(async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
            const { data } = await axios.get(`${API_URL}/api/auth/users`, config);
            setUsers(data);
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const toggleStatus = async (id) => {
        try {
            const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
            await axios.put(`${API_URL}/api/auth/users/${id}/status`, {}, config);
            toast.success('Status updated successfully');
            fetchUsers();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error updating status');
        }
    };

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="p-8 text-center text-slate-500 font-medium">Loading Users...</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h1 className="text-3xl font-bold">User Management</h1>
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        className="glass dark:glass-dark pl-10 pr-4 py-2 rounded-xl border-none focus:ring-2 focus:ring-indigo-500 w-full"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-xl overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-100 dark:bg-slate-700">
                        <tr>
                            <th className="p-4">NAME</th>
                            <th className="p-4">EMAIL</th>
                            <th className="p-4">ROLE</th>
                            <th className="p-4">STATUS</th>
                            <th className="p-4">ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map(user => (
                            <tr key={user._id} className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                <td className="p-4 font-semibold">{user.name}</td>
                                <td className="p-4">{user.email}</td>
                                <td className="p-4 uppercase text-xs font-bold font-mono">{user.role}</td>
                                <td className="p-4">
                                    {user.isBlocked ? (
                                        <span className="text-red-500 bg-red-50 px-3 py-1 rounded-full text-xs font-bold">Blocked</span>
                                    ) : (
                                        <span className="text-green-500 bg-green-50 px-3 py-1 rounded-full text-xs font-bold">Active</span>
                                    )}
                                </td>
                                <td className="p-4">
                                    {user.role !== 'admin' && (
                                        <button
                                            onClick={() => toggleStatus(user._id)}
                                            className={`p-2 rounded-lg transition ${user.isBlocked ? 'bg-green-50 text-green-500 hover:bg-green-100' : 'bg-red-50 text-red-500 hover:bg-red-100'
                                                }`}
                                            title={user.isBlocked ? 'Unblock' : 'Block'}
                                        >
                                            {user.isBlocked ? <UserCheck size={20} /> : <UserX size={20} />}
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminUserList;
