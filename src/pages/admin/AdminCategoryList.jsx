import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Plus, Trash2, Tag } from 'lucide-react';
import Button from '../../components/Button';
import API_URL from '../../config';

const AdminCategoryList = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newCategory, setNewCategory] = useState({ name: '', image: '' });

    const fetchCategories = useCallback(async () => {
        try {
            const { data } = await axios.get(`${API_URL}/api/categories`);
            setCategories(data);
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const createHandler = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
            await axios.post(`${API_URL}/api/categories`, newCategory, config);
            setNewCategory({ name: '', image: '' });
            fetchCategories();
        } catch (error) {
            alert(error.response?.data?.message || 'Error creating category');
        }
    };

    const deleteHandler = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
            await axios.delete(`${API_URL}/api/categories/${id}`, config);
            fetchCategories();
        } catch (error) {
            alert(error.response?.data?.message || 'Error deleting category');
        }
    };

    if (loading) return <div className="p-8 text-center text-slate-500 font-medium">Loading Categories...</div>;

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">Category Management</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form */}
                <div className="glass dark:glass-dark p-6 rounded-3xl h-fit">
                    <h3 className="text-xl font-bold mb-6">Add New Category</h3>
                    <form onSubmit={createHandler} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Name</label>
                            <input
                                type="text"
                                className="w-full bg-white dark:bg-slate-800 px-4 py-2 rounded-xl focus:ring-2 focus:ring-indigo-500 border-none"
                                value={newCategory.name}
                                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Image URL</label>
                            <input
                                type="text"
                                className="w-full bg-white dark:bg-slate-800 px-4 py-2 rounded-xl focus:ring-2 focus:ring-indigo-500 border-none"
                                value={newCategory.image}
                                onChange={(e) => setNewCategory({ ...newCategory, image: e.target.value })}
                                placeholder="/assets/categories/name.png"
                            />
                        </div>
                        <Button type="submit" className="w-full">
                            <Plus size={20} className="mr-2" /> Create Category
                        </Button>
                    </form>
                </div>

                {/* List */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-xl h-fit">
                    <table className="w-full text-left">
                        <thead className="bg-slate-100 dark:bg-slate-700">
                            <tr>
                                <th className="p-4">IMAGE</th>
                                <th className="p-4">NAME</th>
                                <th className="p-4 text-right">ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map(category => (
                                <tr key={category._id} className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                    <td className="p-4">
                                        <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center overflow-hidden">
                                            {category.image ? (
                                                <img src={category.image} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <Tag size={20} className="text-slate-400" />
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4 font-bold">{category.name}</td>
                                    <td className="p-4 text-right">
                                        <button
                                            onClick={() => deleteHandler(category._id)}
                                            className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminCategoryList;
