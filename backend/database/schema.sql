-- Baza danych dla systemu zamówień
CREATE DATABASE IF NOT EXISTS zamowienia_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE zamowienia_db;

-- Tabela produktów
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    ean VARCHAR(20) UNIQUE,
    color VARCHAR(50),
    price_net DECIMAL(10,2),
    price_gross DECIMAL(10,2),
    vat_rate DECIMAL(5,2) DEFAULT 23.00,
    discount DECIMAL(5,2) DEFAULT 0,
    category VARCHAR(100),
    stock INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela zamówień
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_number VARCHAR(20) UNIQUE,
    company_name VARCHAR(255) NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    shipping_address TEXT NOT NULL,
    nip VARCHAR(20),
    nip_valid BOOLEAN DEFAULT FALSE,
    nip_checked_at TIMESTAMP NULL,
    status ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    total_net DECIMAL(10,2),
    total_vat DECIMAL(10,2),
    total_gross DECIMAL(10,2),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela pozycji zamówienia
CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    product_id INT,
    quantity INT NOT NULL,
    unit_price_net DECIMAL(10,2),
    unit_price_gross DECIMAL(10,2),
    discount DECIMAL(5,2) DEFAULT 0,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
);

-- Tabela administratorów
CREATE TABLE admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    role ENUM('admin', 'moderator') DEFAULT 'admin',
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Przykładowe dane
INSERT INTO products (name, description, ean, color, price_net, price_gross, vat_rate, discount, category, stock) VALUES
('Laptop Gaming Pro', 'Wydajny laptop do gier i pracy', '5901234567890', 'Czarny', 3500.00, 4305.00, 23.00, 10.00, 'Elektronika', 15),
('Smartphone Premium', 'Flagowy smartfon z najlepszym aparatem', '5901234567891', 'Srebrny', 2500.00, 3075.00, 23.00, 5.00, 'Elektronika', 25),
('Monitor 4K 27"', 'Monitor 4K do profesjonalnej pracy', '5901234567892', 'Czarny', 1200.00, 1476.00, 23.00, 15.00, 'Elektronika', 10);

INSERT INTO admins (email, password_hash, name, role) VALUES 
('admin@zooleszcz.pl', '$2a$10$8K1p/a0dRTlC7.8a.ROZ5.ZB.8p8pN7a8p8p8p8p8p8p8p8p8p8p8p', 'Administrator', 'admin');