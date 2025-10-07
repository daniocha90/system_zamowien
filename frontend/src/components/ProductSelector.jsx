import React from 'react';
import { useCart } from '../contexts/CartContext';
import { useTranslation } from 'react-i18next';

const ProductSelector = () => {
  const { t } = useTranslation();
  const { products, cartItems, addToCart, updateQuantity, removeFromCart } = useCart();

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">{t('products')}</h2>
      
      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {products.map(product => (
          <div key={product._id} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
            <img 
              src={product.image || '/placeholder-product.jpg'} 
              alt={product.name}
              className="w-full h-48 object-cover rounded mb-4"
            />
            <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
            <p className="text-gray-600 text-sm mb-2">{t('product.code')}: {product.ean}</p>
            <p className="text-gray-600 text-sm mb-2">{t('product.color')}: {product.color}</p>
            <div className="flex justify-between items-center mb-3">
              <span className="text-lg font-bold">
                {product.priceGross} PLN
              </span>
              {product.discount > 0 && (
                <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">
                  -{product.discount}%
                </span>
              )}
            </div>
            <button
              onClick={() => addToCart(product)}
              className="w-full bg-primary-500 text-white py-2 rounded hover:bg-primary-600 transition-colors"
            >
              {t('add.to.cart')}
            </button>
          </div>
        ))}
      </div>

      {/* Cart Items */}
      {cartItems.length > 0 && (
        <div className="border-t pt-6">
          <h3 className="text-xl font-bold mb-4">{t('order.summary')}</h3>
          <div className="space-y-3">
            {cartItems.map(item => (
              <div key={item._id} className="flex items-center justify-between border-b pb-3">
                <div className="flex-1">
                  <h4 className="font-semibold">{item.name}</h4>
                  <p className="text-sm text-gray-600">
                    {item.ean} • {item.color}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-100"
                    >
                      -
                    </button>
                    <span className="w-12 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                  <div className="text-right min-w-24">
                    <div className="font-semibold">
                      {(item.priceGross * item.quantity * (1 - item.discount / 100)).toFixed(2)} PLN
                    </div>
                    {item.discount > 0 && (
                      <div className="text-sm text-gray-500 line-through">
                        {(item.priceGross * item.quantity).toFixed(2)} PLN
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="text-red-500 hover:text-red-700 p-2"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductSelector;