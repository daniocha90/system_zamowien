// models/Product.js - Model produktu dla MySQL
class Product {
  constructor({
    id,
    name,
    description,
    ean,
    color,
    price_net,
    price_gross,
    vat_rate = 23.00,
    discount = 0,
    category,
    stock = 0,
    is_active = true,
    image = null,
    created_at,
    updated_at
  }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.ean = ean;
    this.color = color;
    this.price_net = price_net;
    this.price_gross = price_gross;
    this.vat_rate = vat_rate;
    this.discount = discount;
    this.category = category;
    this.stock = stock;
    this.is_active = is_active;
    this.image = image;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  // Statyczne metody do interakcji z bazą danych
  static async findAll(activeOnly = true) {
    const db = await import('../database/connection.js').then(module => module.getDB());
    const query = activeOnly 
      ? 'SELECT * FROM products WHERE is_active = TRUE'
      : 'SELECT * FROM products';
    
    const [rows] = await db.execute(query);
    return rows.map(row => new Product(row));
  }

  static async findById(id) {
    const db = await import('../database/connection.js').then(module => module.getDB());
    const [rows] = await db.execute(
      'SELECT * FROM products WHERE id = ? AND is_active = TRUE',
      [id]
    );
    return rows.length > 0 ? new Product(rows[0]) : null;
  }

  static async findByEAN(ean) {
    const db = await import('../database/connection.js').then(module => module.getDB());
    const [rows] = await db.execute(
      'SELECT * FROM products WHERE ean = ? AND is_active = TRUE',
      [ean]
    );
    return rows.length > 0 ? new Product(rows[0]) : null;
  }

  async save() {
    const db = await import('../database/connection.js').then(module => module.getDB());
    
    if (this.id) {
      // Update existing product
      const [result] = await db.execute(
        `UPDATE products SET 
         name = ?, description = ?, ean = ?, color = ?, price_net = ?, 
         price_gross = ?, vat_rate = ?, discount = ?, category = ?, 
         stock = ?, is_active = ?, image = ? 
         WHERE id = ?`,
        [
          this.name, this.description, this.ean, this.color,
          this.price_net, this.price_gross, this.vat_rate, this.discount,
          this.category, this.stock, this.is_active, this.image, this.id
        ]
      );
      return result;
    } else {
      // Insert new product
      const [result] = await db.execute(
        `INSERT INTO products 
         (name, description, ean, color, price_net, price_gross, vat_rate, discount, category, stock, is_active, image) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          this.name, this.description, this.ean, this.color,
          this.price_net, this.price_gross, this.vat_rate, this.discount,
          this.category, this.stock, this.is_active, this.image
        ]
      );
      this.id = result.insertId;
      return result;
    }
  }

  static async delete(id) {
    const db = await import('../database/connection.js').then(module => module.getDB());
    const [result] = await db.execute(
      'UPDATE products SET is_active = FALSE WHERE id = ?',
      [id]
    );
    return result;
  }
}

export default Product;
