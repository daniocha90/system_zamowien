import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import { useCart } from '../../contexts/CartContext';
import { ShoppingCart, Sun, Moon, Globe } from 'lucide-react';

const Header = () => {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme, banners } = useTheme();
  const { getCartItemsCount } = useCart();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const activeBanner = banners.find(banner => banner.isActive);

  return (
    <header className="bg-white dark:bg-gray-800 shadow-lg transition-colors">
      {/* Top Banner */}
      {activeBanner && (
        <div 
          className="bg-primary-500 text-white text-center py-2 px-4"
          style={{ 
            backgroundColor: activeBanner.backgroundColor,
            color: activeBanner.textColor
          }}
        >
          <p className="font-medium">{activeBanner.text}</p>
        </div>
      )}

      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <img 
              src="/logo.png" 
              alt="Logo" 
              className="h-12 w-auto"
            />
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              {t('welcome')}
            </h1>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-4">
            {/* Language Selector */}
            <div className="flex items-center space-x-2">
              <Globe className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              <select 
                value={i18n.language}
                onChange={(e) => changeLanguage(e.target.value)}
                className="bg-transparent border-none focus:outline-none text-gray-700 dark:text-gray-300"
              >
                <option value="pl">PL</option>
                <option value="en">EN</option>
                <option value="de">DE</option>
              </select>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>

            {/* Cart */}
            <div className="relative">
              <button className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                <ShoppingCart className="h-5 w-5" />
              </button>
              {getCartItemsCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getCartItemsCount()}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-4">
          <div className="flex space-x-8">
            <a href="/zamowienia" className="text-gray-700 dark:text-gray-300 hover:text-primary-500 font-medium">
              {t('products')}
            </a>
            <a href="/zamowienia/order" className="text-gray-700 dark:text-gray-300 hover:text-primary-500 font-medium">
              {t('order')}
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;