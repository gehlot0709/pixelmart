import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Input from '../../components/Input';
import Button from '../../components/Button';

// Pre-defined colors for picker
const PRESET_COLORS = [
    '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
    '#FFFF00', '#FF00FF', '#00FFFF', '#808080', '#A52A2A',
    '#FFA500', '#800080', '#FFC0CB', '#F5F5DC'
];

const AdminProductEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;

    const [title, setTitle] = useState('');
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState('');
    const [stock, setStock] = useState(0);
    const [category, setCategory] = useState('');

    // Size & Color with Skip Logic
    const [sizes, setSizes] = useState('');
    const [skipSizes, setSkipSizes] = useState(false);

    const [colors, setColors] = useState('');
    const [skipColors, setSkipColors] = useState(false);

    const [deliveryTime, setDeliveryTime] = useState('3-5 Business Days');
    const [isOffer, setIsOffer] = useState(false);
    const [images, setImages] = useState(null);

    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCats = async () => {
            try {
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/categories`);
                setCategories(data);
                if (data.length > 0 && !category && !isEdit) setCategory(data[0]._id);
            } catch (error) {
                console.error("Failed to fetch categories:", error);
                // Alert the user if it's an admin page so they know something is wrong
                // alert("Failed to load categories. Check console for details."); 
            }
        };
        fetchCats();
    }, []);

    useEffect(() => {
        if (isEdit) {
            const fetchProduct = async () => {
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/products/${id}`);
                setTitle(data.title);
                setPrice(data.price);
                setDescription(data.description);
                setStock(data.stock);
                setCategory(data.category?._id || data.category);

                if (data.sizes && data.sizes.length > 0) {
                    setSizes(data.sizes.join(','));
                } else {
                    setSkipSizes(true);
                }

                if (data.colors && data.colors.length > 0) {
                    setColors(data.colors.join(','));
                } else {
                    setSkipColors(true);
                }

                setDeliveryTime(data.deliveryTime);
                setIsOffer(data.isOffer || false);
            };
            fetchProduct();
        }
    }, [id, isEdit]);

    const addColor = (hex) => {
        if (skipColors) return;
        const current = colors ? colors.split(',').map(c => c.trim()) : [];
        if (!current.includes(hex)) {
            setColors(current.length > 0 ? `${colors},${hex}` : hex);
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', title);
        formData.append('price', price);
        formData.append('description', description);
        formData.append('stock', stock);
        formData.append('category', category);

        formData.append('sizes', skipSizes ? '' : sizes);
        formData.append('colors', skipColors ? '' : colors);

        formData.append('deliveryTime', deliveryTime);
        formData.append('isOffer', isOffer);

        if (images) {
            for (let i = 0; i < images.length; i++) {
                formData.append('images', images[i]);
            }
        }

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            };

            if (isEdit) {
                alert("Update logic pending backend implementation. Please add new product for now.");
            } else {
                await axios.post(`${import.meta.env.VITE_API_URL}/api/products`, formData, config);
                navigate('/admin/products');
            }
        } catch (error) {
            alert('Error Saving Product');
        }
    };

    // Organized Categories Logic
    const parentCategories = categories.filter(c => !c.parent);
    const getSubCategories = (parentId) => categories.filter(c => c.parent === parentId);

    return (
        <div className="max-w-3xl mx-auto glass dark:glass-dark p-8 rounded-3xl">
            <h1 className="text-3xl font-bold mb-6">{isEdit ? 'Edit Product' : 'Add Product'}</h1>

            <form onSubmit={submitHandler} className="space-y-6">
                <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                <div className="grid grid-cols-2 gap-4">
                    <Input label="Price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
                    <Input label="Stock" type="number" value={stock} onChange={(e) => setStock(e.target.value)} required />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                        className="w-full p-3 rounded-xl bg-white/50 border border-slate-200 focus:ring-2 focus:ring-primary outline-none"
                        rows="4"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Category</label>
                        <select
                            className="w-full p-3 rounded-xl bg-white/50 border border-slate-200 focus:ring-2 focus:ring-primary outline-none"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <option value="">Select Category</option>
                            {parentCategories.map(parent => (
                                <>
                                    <option key={parent._id} value={parent._id} className="font-bold text-slate-800">
                                        {parent.name}
                                    </option>
                                    {getSubCategories(parent._id).map(sub => (
                                        <option key={sub._id} value={sub._id} className="text-slate-600">
                                            &nbsp;&nbsp;-- {sub.name}
                                        </option>
                                    ))}
                                </>
                            ))}
                        </select>
                    </div>
                    <Input label="Delivery Time" value={deliveryTime} onChange={(e) => setDeliveryTime(e.target.value)} required />
                </div>

                {/* Sizes */}
                <div className="p-4 border border-slate-200 rounded-xl bg-white/30">
                    <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium">Sizes</label>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="skipSizes"
                                checked={skipSizes}
                                onChange={(e) => setSkipSizes(e.target.checked)}
                                className="mr-2"
                            />
                            <label htmlFor="skipSizes" className="text-sm text-slate-500 cursor-pointer">Skip / Not Applicable</label>
                        </div>
                    </div>

                    {!skipSizes && (
                        <div className="space-y-4">
                            <div>
                                <p className="text-xs text-slate-400 mb-2">Clothing</p>
                                <div className="flex flex-wrap gap-2">
                                    {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(size => (
                                        <button
                                            key={size}
                                            type="button"
                                            onClick={() => {
                                                const current = sizes ? sizes.split(',').filter(s => s) : [];
                                                if (current.includes(size)) {
                                                    setSizes(current.filter(s => s !== size).join(','));
                                                } else {
                                                    setSizes([...current, size].join(','));
                                                }
                                            }}
                                            className={`px-3 py-1 rounded-lg border text-sm transition-all ${sizes.split(',').includes(size)
                                                ? 'bg-primary text-white border-primary'
                                                : 'bg-white border-slate-200 hover:border-primary text-slate-600'
                                                }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <p className="text-xs text-slate-400 mb-2">Footwear (US/EU)</p>
                                <div className="flex flex-wrap gap-2">
                                    {['6', '7', '8', '9', '10', '11', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45'].map(size => (
                                        <button
                                            key={size}
                                            type="button"
                                            onClick={() => {
                                                const current = sizes ? sizes.split(',').filter(s => s) : [];
                                                if (current.includes(size)) {
                                                    setSizes(current.filter(s => s !== size).join(','));
                                                } else {
                                                    setSizes([...current, size].join(','));
                                                }
                                            }}
                                            className={`px-3 py-1 rounded-lg border text-sm transition-all ${sizes.split(',').includes(size)
                                                ? 'bg-primary text-white border-primary'
                                                : 'bg-white border-slate-200 hover:border-primary text-slate-600'
                                                }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    <input
                        type="text"
                        value={sizes}
                        onChange={(e) => setSizes(e.target.value)}
                        disabled={skipSizes}
                        placeholder="Selected sizes will appear here (or type manually)"
                        className={`w-full p-3 mt-3 rounded-xl bg-white/50 border border-slate-200 ${skipSizes ? 'opacity-50 cursor-not-allowed' : ''}`}
                    />
                </div>

                {/* Colors */}
                <div className="p-4 border border-slate-200 rounded-xl bg-white/30">
                    <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium">Colors (Hex Codes)</label>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="skipColors"
                                checked={skipColors}
                                onChange={(e) => setSkipColors(e.target.checked)}
                                className="mr-2"
                            />
                            <label htmlFor="skipColors" className="text-sm text-slate-500 cursor-pointer">Skip / Not Applicable</label>
                        </div>
                    </div>

                    <input
                        type="text"
                        value={colors}
                        onChange={(e) => setColors(e.target.value)}
                        disabled={skipColors}
                        placeholder="e.g. #FF0000, #0000FF"
                        className={`w-full p-3 rounded-xl bg-white/50 border border-slate-200 mb-3 ${skipColors ? 'opacity-50 cursor-not-allowed' : ''}`}
                    />

                    {/* Color Picker Swatches */}
                    {!skipColors && (
                        <div className="flex flex-wrap gap-2">
                            {PRESET_COLORS.map(color => (
                                <button
                                    key={color}
                                    type="button"
                                    onClick={() => addColor(color)}
                                    style={{ backgroundColor: color }}
                                    className="w-8 h-8 rounded-full border border-slate-300 shadow-sm hover:scale-110 transition"
                                    title={color}
                                />
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="isOffer"
                        checked={isOffer}
                        onChange={(e) => setIsOffer(e.target.checked)}
                        className="w-5 h-5 text-primary rounded border-gray-300"
                    />
                    <label htmlFor="isOffer" className="ml-2 text-sm font-medium">
                        Mark as Special Offer
                    </label>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Product Images</label>
                    <input
                        type="file"
                        multiple
                        onChange={(e) => setImages(e.target.files)}
                        className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                    />
                </div>

                <Button type="submit" className="w-full">Save Product</Button>
            </form>
        </div>
    );
};

export default AdminProductEdit;
