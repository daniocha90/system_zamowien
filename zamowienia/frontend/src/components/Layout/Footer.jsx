import React from 'react';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-800 text-white py-8 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-bold mb-4">Zooleszcz Sp. z o.o.</h3>
            <p className="text-gray-300">
              Profesjonalny system zamówień<br />
              Wsparcie klienta: 24/7
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-4">Kontakt</h3>
            <div className="text-gray-300 space-y-2">
              <p>📞 +48 123 456 789</p>
              <p>✉️ zamowienia@zooleszcz.pl</p>
              <p>📍 ul. Przykładowa 123, 00-001 Warszawa</p>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Linki</h3>
            <div className="text-gray-300 space-y-2">
              <a href="#" className="block hover:text-white transition-colors">Polityka prywatności</a>
              <a href="#" className="block hover:text-white transition-colors">Regulamin</a>
              <a href="#" className="block hover:text-white transition-colors">Pomoc</a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
          <p>&copy; 2024 Zooleszcz Sp. z o.o. Wszelkie prawa zastrzeżone.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;