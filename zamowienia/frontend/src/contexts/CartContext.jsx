import React, { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload };
    
    case 'ADD_TO_CART':
      const existingItem = state.cartItems.find(item => item._id === action.payload._id);
      if (existingItem) {
        return {
          ...state,
          cartItems: state.cartItems.map(item =>
            item._id === action.payload._id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        };
      }
      return {
        ...state,
        cartItems: [...state.cartItems, { ...action.payload, quantity: 1 }]
      };
    
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        cartItems: state.cartItems.map(item =>
          item._id === action.payload.productId
            ? { ...item, quantity: Math.max(0, action.payload.quantity) }
            : item
        ).filter(item => item.quantity > 0)
      };
    
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cartItems: state.cartItems.filter(item => item._id !== action.payload)
      };
    
    case 'CLEAR_CART':
      return { ...state, cartItems: [] };
    
    default:
      return state;
  }
};

const initialState = {
  products: [],
  cartItems: [],
  loading: false,
  error: null
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load products on mount
  useEffect(() => {
    const loadProducts = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const response = await fetch('/api/products');
        const products = await response.json();
        dispatch({ type: 'SET_PRODUCTS', payload: products });
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    loadProducts();
  }, []);

  const addToCart = (product) => {
    dispatch({ type: 'ADD_TO_CART', payload: product });
  };

  const updateQuantity = (productId, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
  };

  const removeFromCart = (productId) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getCartTotal = () => {
    return state.cartItems.reduce((total, item) => {
      const discountedPrice = item.priceGross * (1 - item.discount / 100);
      return total + (discountedPrice * item.quantity);
    }, 0);
  };

  const getCartItemsCount = () => {
    return state.cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    ...state,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartItemsCount
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};