import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, '../frontend')));

// Proste API dla szybkiego startu
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'System zamówień działa!',
        database: 'MySQL',
        timestamp: new Date().toISOString()
    });
});

app.get('/api/products', (req, res) => {
    // Przykładowe produkty
    const products = [
        {
            id: 1,
            name: 'Laptop Gaming Pro',
            price: 4305.00,
            priceNet: 3500.00,
            vat: 23,
            discount: 10,
            color: 'Czarny',
            ean: '5901234567890',
            category: 'Elektronika',
            stock: 15
        },
        {
            id: 2,
            name: 'Smartphone Premium',
            price: 3075.00,
            priceNet: 2500.00,
            vat: 23,
            discount: 5,
            color: 'Srebrny',
            ean: '5901234567891',
            category: 'Elektronika',
            stock: 25
        }
    ];
    res.json(products);
});

// Frontend SPA
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.listen(PORT, () => {
    console.log('=========================================');
    console.log('🚀 System Zamówień uruchomiony!');
    console.log('📍 Port:', PORT);
    console.log('🗄️  Baza: MySQL');
    console.log('🌐 URL: https://zooleszcz.pl/zamowienia');
    console.log('=========================================');
});