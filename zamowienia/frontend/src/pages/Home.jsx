import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import ProductSelector from '../components/ProductSelector';

const Home = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="text-center py-12 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-2xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          {t('welcome')}
        </h1>
        <p className="text-xl mb-8 opacity-90">
          Profesjonalny system zamówień dla Twojej firmy
        </p>
        <Link
          to="/order"
          className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors inline-block"
        >
          {t('order.now')}
        </Link>
      </section>

      {/* Features */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card text-center">
          <div className="text-3xl mb-4">🚚</div>
          <h3 className="text-xl font-bold mb-2">Szybka dostawa</h3>
          <p className="text-gray-600">Dostawa w 24h na terenie całego kraju</p>
        </div>
        
        <div className="card text-center">
          <div className="text-3xl mb-4">💳</div>
          <h3 className="text-xl font-bold mb-2">Bezpieczne płatności</h3>
          <p className="text-gray-600">Szyfrowane transakcje i różne formy płatności</p>
        </div>
        
        <div className="card text-center">
          <div className="text-3xl mb-4">📞</div>
          <h3 className="text-xl font-bold mb-2">Wsparcie 24/7</h3>
          <p className="text-gray-600">Nasz zespół wsparcia zawsze gotowy do pomocy</p>
        </div>
      </section>

      {/* Products Preview */}
      <section>
        <h2 className="text-3xl font-bold mb-6 text-center">{t('featured.products')}</h2>
        <ProductSelector />
      </section>
    </div>
  );
};

export default Home;