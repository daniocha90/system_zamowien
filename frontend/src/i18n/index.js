import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translation resources
const resources = {
  pl: {
    translation: {
      // Common
      'welcome': 'Witamy w systemie zamówień',
      'products': 'Produkty',
      'order': 'Zamówienie',
      'price': 'Cena',
      'quantity': 'Ilość',
      'total': 'Razem',
      'submit': 'Wyślij',
      'cancel': 'Anuluj',
      
      // Products
      'product.name': 'Nazwa produktu',
      'product.code': 'Kod EAN',
      'product.color': 'Kolor',
      'product.price.net': 'Cena netto',
      'product.price.gross': 'Cena brutto',
      'product.discount': 'Rabat',
      
      // Customer form
      'customer.company': 'Firma',
      'customer.name': 'Imię i nazwisko',
      'customer.address': 'Adres firmy',
      'customer.shipping': 'Adres dostawy',
      'customer.nip': 'NIP',
      'customer.nip.valid': 'NIP zweryfikowany',
      'customer.nip.invalid': 'NIP nieprawidłowy',
      
      // Order summary
      'summary.net': 'Wartość netto',
      'summary.vat': 'VAT',
      'summary.gross': 'Wartość brutto',
      'summary.discount': 'Rabat',
      
      // Admin
      'admin.login': 'Logowanie',
      'admin.dashboard': 'Panel administracyjny',
      'admin.products': 'Zarządzanie produktami',
      'admin.orders': 'Zamówienia',
      'admin.settings': 'Ustawienia'
    }
  },
  en: {
    translation: {
      // Common
      'welcome': 'Welcome to order system',
      'products': 'Products',
      'order': 'Order',
      'price': 'Price',
      'quantity': 'Quantity',
      'total': 'Total',
      'submit': 'Submit',
      'cancel': 'Cancel',
      
      // Products
      'product.name': 'Product name',
      'product.code': 'EAN code',
      'product.color': 'Color',
      'product.price.net': 'Net price',
      'product.price.gross': 'Gross price',
      'product.discount': 'Discount',
      
      // Customer form
      'customer.company': 'Company',
      'customer.name': 'Full name',
      'customer.address': 'Company address',
      'customer.shipping': 'Shipping address',
      'customer.nip': 'VAT Number',
      'customer.nip.valid': 'VAT Number verified',
      'customer.nip.invalid': 'Invalid VAT Number',
      
      // Order summary
      'summary.net': 'Net value',
      'summary.vat': 'VAT',
      'summary.gross': 'Gross value',
      'summary.discount': 'Discount',
      
      // Admin
      'admin.login': 'Login',
      'admin.dashboard': 'Admin dashboard',
      'admin.products': 'Product management',
      'admin.orders': 'Orders',
      'admin.settings': 'Settings'
    }
  },
  de: {
    translation: {
      // Common
      'welcome': 'Willkommen im Bestellsystem',
      'products': 'Produkte',
      'order': 'Bestellung',
      'price': 'Preis',
      'quantity': 'Menge',
      'total': 'Gesamt',
      'submit': 'Senden',
      'cancel': 'Abbrechen',
      
      // Products
      'product.name': 'Produktname',
      'product.code': 'EAN-Code',
      'product.color': 'Farbe',
      'product.price.net': 'Nettopreis',
      'product.price.gross': 'Bruttopreis',
      'product.discount': 'Rabatt',
      
      // Customer form
      'customer.company': 'Firma',
      'customer.name': 'Vor- und Nachname',
      'customer.address': 'Firmenadresse',
      'customer.shipping': 'Lieferadresse',
      'customer.nip': 'USt-IdNr.',
      'customer.nip.valid': 'USt-IdNr. verifiziert',
      'customer.nip.invalid': 'Ungültige USt-IdNr.',
      
      // Order summary
      'summary.net': 'Nettowert',
      'summary.vat': 'MwSt',
      'summary.gross': 'Bruttowert',
      'summary.discount': 'Rabatt',
      
      // Admin
      'admin.login': 'Anmeldung',
      'admin.dashboard': 'Admin-Bereich',
      'admin.products': 'Produktverwaltung',
      'admin.orders': 'Bestellungen',
      'admin.settings': 'Einstellungen'
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'pl',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    }
  });

export default i18n;