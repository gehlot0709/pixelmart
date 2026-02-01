import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Edit, Trash2, Plus } from 'lucide-react';
import { Edit, Trash2, Plus } from 'lucide-react';
import Button from '../../components/Button';
import API_URL from '../../config';

const AdminProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchProducts = useCallback(async () => {
        try {
            // Admin gets all products? The public API handles pagination. 
            // We might need an admin endpoint for "all without filter" or just pagination.
            // Using public endpoint for now with large size.
            const { data } = await axios.get(`${API_URL}/api/products?pageNumber=1`);
            // Note: Public API is paginate. Ideally createAdmin specific list.
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
            await axios.delete(`${API_URL}/api/products/${id}`, config); // Need to implement DELETE route in Backend! I think I missed Product DELETE logic in Controller.
            // Wait, I did check `productController`. Let's check.
            // Ah, `productController` had `createProduct` but did I add `deleteProduct`?
            // Step 101: `createProduct` yes. `deleteProduct`? No.
            // Refactoring: I need to add DELETE logic to backend product controller.

            fetchProducts();
        } catch (error) {
            alert('Error deleting product');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Products</h1>
                <Link to="/admin/products/add">
                    <Button><Plus size={20} className="mr-2" /> Add Product</Button>
                </Link>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-xl">
                <table className="w-full text-left">
                    <thead className="bg-slate-100 dark:bg-slate-700">
                        <tr>
                            <th className="p-4">ID</th>
                            <th className="p-4">NAME</th>
                            <th className="p-4">PRICE</th>
                            <th className="p-4">CATEGORY</th>
                            <th className="p-4">STOCK</th>
                            <th className="p-4">ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product._id} className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                <td className="p-4 text-sm font-mono">{product._id.substring(0, 8)}...</td>
                                <td className="p-4 font-semibold">{product.title}</td>
                                <td className="p-4">₹{product.price}</td>
                                <td className="p-4">{product.category?.name || 'N/A'}</td>
                                <td className="p-4">{product.stock}</td>
                                <td className="p-4 flex space-x-2">
                                    <Link to={`/admin/products/${product._id}/edit`}>
                                        <button className="p-2 bg-blue-50 text-blue-500 rounded-lg"><Edit size={18} /></button>
                                    </Link>
                                    <button
                                        onClick={() => deleteHandler(product._id)}
                                        className="p-2 bg-red-50 text-red-500 rounded-lg"
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
    );
};

export default AdminProductList;
