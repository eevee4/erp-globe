import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const sqlite = sqlite3.verbose();

const app = express();
const dbPath = resolve(__dirname, 'db.sqlite');
const db = new sqlite.Database(dbPath);

app.use(cors());
app.use(express.json());

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    productName TEXT,
    productType TEXT,
    dimensions TEXT,
    quantity INTEGER,
    date TEXT
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS conrods (
    id TEXT PRIMARY KEY,
    srNo INTEGER,
    name TEXT,
    dimensions TEXT,
    pin TEXT,
    ballBearing TEXT
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS production (
    id TEXT PRIMARY KEY,
    conrodId TEXT,
    quantity INTEGER,
    date TEXT
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS bills (
    id TEXT PRIMARY KEY,
    invoiceNo TEXT,
    productId TEXT,
    quantity INTEGER,
    amount REAL
  )`);
});

// Products endpoints
app.get('/api/products', (req, res) => {
  db.all('SELECT * FROM products', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    const products = rows.map(r => ({
      id: r.id,
      productName: r.productName,
      productType: r.productType,
      dimensions: JSON.parse(r.dimensions),
      quantity: r.quantity,
      date: r.date,
    }));
    res.json(products);
  });
});

app.post('/api/products', (req, res) => {
  const { productName, productType, dimensions, quantity, date } = req.body;
  const id = uuidv4();
  const stmt = db.prepare('INSERT INTO products (id, productName, productType, dimensions, quantity, date) VALUES (?, ?, ?, ?, ?, ?)');
  stmt.run(id, productName, productType, JSON.stringify(dimensions), quantity, date, err => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id, productName, productType, dimensions, quantity, date });
  });
});

app.patch('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;
  db.run('UPDATE products SET quantity = ? WHERE id = ?', [quantity, id], err => {
    if (err) return res.status(500).json({ error: err.message });
    db.get('SELECT * FROM products WHERE id = ?', [id], (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      const product = {
        id: row.id,
        productName: row.productName,
        productType: row.productType,
        dimensions: JSON.parse(row.dimensions),
        quantity: row.quantity,
        date: row.date,
      };
      res.json(product);
    });
  });
});

app.delete('/api/products/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM products WHERE id = ?', [id], err => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id });
  });
});

// Conrods endpoints
app.get('/api/conrods', (req, res) => {
  db.all('SELECT * FROM conrods', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    const conrods = rows.map(r => ({
      id: r.id,
      srNo: r.srNo,
      name: r.name,
      dimensions: JSON.parse(r.dimensions),
      pin: r.pin,
      ballBearing: r.ballBearing,
    }));
    res.json(conrods);
  });
});

app.post('/api/conrods', (req, res) => {
  const { name, dimensions, pin, ballBearing } = req.body;
  const id = uuidv4();
  db.get('SELECT COUNT(*) AS count FROM conrods', (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    const srNo = row.count + 1;
    const stmt = db.prepare('INSERT INTO conrods (id, srNo, name, dimensions, pin, ballBearing) VALUES (?, ?, ?, ?, ?, ?)');
    stmt.run(id, srNo, name, JSON.stringify(dimensions), pin, ballBearing, err => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id, srNo, name, dimensions, pin, ballBearing });
    });
  });
});

app.delete('/api/conrods/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM conrods WHERE id = ?', [id], err => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id });
  });
});

// Production endpoints
app.get('/api/production', (req, res) => {
  db.all('SELECT * FROM production', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    const production = rows.map(r => ({ id: r.id, conrodId: r.conrodId, quantity: r.quantity, date: r.date }));
    res.json(production);
  });
});

app.post('/api/production', (req, res) => {
  const { conrodId, quantity, date } = req.body;
  const id = uuidv4();
  const stmt = db.prepare('INSERT INTO production (id, conrodId, quantity, date) VALUES (?, ?, ?, ?)');
  stmt.run(id, conrodId, quantity, date, err => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id, conrodId, quantity, date });
  });
});

app.patch('/api/production/:id', (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;
  db.run('UPDATE production SET quantity = ? WHERE id = ?', [quantity, id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    db.get('SELECT * FROM production WHERE id = ?', [id], (err2, row) => {
      if (err2) return res.status(500).json({ error: err2.message });
      res.json({ id: row.id, conrodId: row.conrodId, quantity: row.quantity, date: row.date });
    });
  });
});

app.delete('/api/production/:id', (req, res) => {
  const { id } = req.params;
  // Note: As discussed, deleting production doesn't automatically revert raw materials
  // because the creation didn't deduct them. We just delete the record.
  db.run('DELETE FROM production WHERE id = ?', [id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ message: 'Production record not found' });
    res.json({ id });
  });
});

// Billing endpoints
app.get('/api/bills', (req, res) => {
  db.all('SELECT * FROM bills', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    const bills = rows.map(r => ({ id: r.id, invoiceNo: r.invoiceNo, productId: r.productId, quantity: r.quantity, amount: r.amount }));
    res.json(bills);
  });
});

app.post('/api/bills', (req, res) => {
  const { invoiceNo, productId, quantity, amount } = req.body;
  const id = uuidv4();
  const stmt = db.prepare('INSERT INTO bills (id, invoiceNo, productId, quantity, amount) VALUES (?, ?, ?, ?, ?)');
  stmt.run(id, invoiceNo, productId, quantity, amount, err => {
    if (err) return res.status(500).json({ error: err.message });
    // Deduct from production quantity
    db.run('UPDATE production SET quantity = quantity - ? WHERE id = ?', [quantity, productId], err2 => {
      if (err2) console.error(err2);
      res.json({ id, invoiceNo, productId, quantity, amount });
    });
  });
});

app.delete('/api/bills/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT productId, quantity FROM bills WHERE id = ?', [id], (err, bill) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!bill) return res.status(404).json({ message: 'Bill not found' });

    db.serialize(() => {
      db.run('DELETE FROM bills WHERE id = ?', [id], function(err) {
        if (err) {
          db.rollback();
          return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) { // Should not happen due to check above, but safety first
            db.rollback();
            return res.status(404).json({ message: 'Bill not found during delete' });
        }

        // Revert quantity in production table
        db.run('UPDATE production SET quantity = quantity + ? WHERE id = ?', [bill.quantity, bill.productId], function(err) {
          if (err) {
            db.rollback();
            return res.status(500).json({ error: err.message });
          }
          // Optionally check if production record was found (this.changes > 0)
          // Fetch the updated production record to return it
          db.get('SELECT * FROM production WHERE id = ?', [bill.productId], (err, updatedProd) => {
              if (err) {
                 db.rollback();
                 return res.status(500).json({ error: err.message });
              }
              const productionRecord = updatedProd ? {
                 id: updatedProd.id,
                 conrodId: updatedProd.conrodId,
                 quantity: updatedProd.quantity,
                 date: updatedProd.date
              } : null; // Production record might have been deleted elsewhere
              res.json({ deletedBillId: id, updatedProductionRecord: productionRecord });
          });
        });
      });
    });
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
