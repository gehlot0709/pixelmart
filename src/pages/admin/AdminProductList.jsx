import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Edit, Trash2, Plus, AlertTriangle, Search } from 'lucide-react';

import Button from '../../components/Button';
import API_URL from '../../config';

const AdminProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchProducts = useCallback(async () => {
        try {
            const { data } = await axios.get(`${API_URL}/api/products?pageNumber=1&pageSize=1000`);
            setProducts(data.products);
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const deleteHandler = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
            await axios.delete(`${API_URL}/api/products/${id}`, config);
            fetchProducts();
        } catch (error) {
            alert('Error deleting product');
        }
    };

    const filteredProducts = products.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const lowStockCount = products.filter(p => p.stock <= 5).length;

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h1 className="text-3xl font-bold">Products</h1>
                <div className="flex items-center space-x-4 w-full md:w-auto">
                    <input
                        type="text"
                        placeholder="Search products..."
                        className="glass dark:glass-dark px-4 py-2 rounded-xl border-none focus:ring-2 focus:ring-indigo-500 w-full md:w-64"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Link to="/admin/products/add">
                        <Button><Plus size={20} className="mr-2" /> Add</Button>
                    </Link>
                </div>
            </div>

            {lowStockCount > 0 && (
                <div className="bg-red-50 text-red-600 p-4 rounded-2xl flex items-center font-bold">
                    <AlertTriangle size={20} className="mr-2" />
                    {lowStockCount} Products are Low on Stock!
                </div>
            )}

            <div className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-xl overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-100 dark:bg-slate-700">
                        <tr>
                            <th className="p-4">IMAGE</th>
                            <th className="p-4">NAME</th>
                            <th className="p-4">PRICE</th>
                            <th className="p-4">STOCK</th>
                            <th className="p-4">ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.map(product => (
                            <tr key={product._id} className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                <td className="p-4">
                                    <img src={product.mainImage || product.images[0]} alt="" className="w-12 h-12 rounded-lg object-cover" />
                                </td>
                                <td className="p-4 font-semibold max-w-xs truncate">{product.title}</td>
                                <td className="p-4 font-bold">₹{product.price}</td>
                                <td className="p-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${product.stock <= 0 ? 'bg-red-100 text-red-600' :
                                        product.stock <= 5 ? 'bg-orange-100 text-orange-600' :
                                            'bg-green-100 text-green-600'
                                        }`}>
                                        {product.stock}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <div className="flex space-x-2">
                                        <Link to={`/admin/products/${product._id}/edit`}>
                                            <button className="p-2 bg-blue-50 text-blue-500 rounded-lg" title="Edit"><Edit size={18} /></button>
                                        </Link>
                                        <button
                                            onClick={() => deleteHandler(product._id)}
                                            className="p-2 bg-red-50 text-red-500 rounded-lg"
                                            title="Delete"
                                        >
                                            <Trash2 size={18} />
                                        </button>
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

export default AdminProductList;
