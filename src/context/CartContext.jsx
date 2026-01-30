import { createContext, useReducer, useContext, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

const cartReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_TO_CART': {
            const item = action.payload;
            const existItem = state.cartItems.find(x => x.product === item.product);

            if (existItem) {
                return {
                    ...state,
                    cartItems: state.cartItems.map(x =>
                        x.product === existItem.product ? item : x
                    )
                };
            } else {
                return {
                    ...state,
                    cartItems: [...state.cartItems, item]
                };
            }
        }
        case 'REMOVE_FROM_CART':
            return {
                ...state,
                cartItems: state.cartItems.filter(x => x.product !== action.payload)
            };
        case 'CLEAR_CART':
            return { ...state, cartItems: [] };
        case 'SAVE_SHIPPING_ADDRESS':
            return { ...state, shippingAddress: action.payload };
        case 'SAVE_PAYMENT_METHOD':
            return { ...state, paymentMethod: action.payload };
        default:
            return state;
    }
};

export const CartProvider = ({ children }) => {
    const initialState = {
        cartItems: localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : [],
        shippingAddress: localStorage.getItem('shippingAddress') ? JSON.parse(localStorage.getItem('shippingAddress')) : {},
        paymentMethod: 'QR Code'
    };

    const [state, dispatch] = useReducer(cartReducer, initialState);

    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        localStorage.setItem('shippingAddress', JSON.stringify(state.shippingAddress));
    }, [state]);

    const addToCart = (product, qty, size, color) => {
        dispatch({
            type: 'ADD_TO_CART',
            payload: {
                product: product._id,
                name: product.title,
                image: product.images[0],
                price: product.salePrice > 0 ? product.salePrice : product.price,
                stock: product.stock,
                qty,
                size,
                color
            }
        });
    };

    const removeFromCart = (id) => {
        dispatch({ type: 'REMOVE_FROM_CART', payload: id });
    };

    const saveShippingAddress = (data) => {
        dispatch({ type: 'SAVE_SHIPPING_ADDRESS', payload: data });
    };

    const clearCart = () => {
        dispatch({ type: 'CLEAR_CART' });
    };

    return (
        <CartContext.Provider value={{ cart: state, addToCart, removeFromCart, saveShippingAddress, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};
