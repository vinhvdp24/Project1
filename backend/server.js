const express = require('express');
const sqlite = require('sqlite');
const sqlite3 = require('sqlite3');
const path = require('path');

const app = express();
// Render sẽ cung cấp PORT thông qua biến môi trường, nếu không có thì dùng 8000 (Local)
const PORT = process.env.PORT || 8000; 
const DB_PATH = path.join(__dirname, 'database.sqlite');

// Middleware để cho phép CORS (quan trọng để Frontend có thể gọi API)
app.use((req, res, next) => {
    // Cho phép tất cả các domain truy cập (cho mục đích phát triển đơn giản)
    res.header('Access-Control-Allow-Origin', '*'); 
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

let db;

/**
 * Hàm khởi tạo và kết nối database
 */
async function setupDatabase() {
    // Mở kết nối database
    db = await sqlite.open({
        filename: DB_PATH,
        driver: sqlite3.Database
    });
    
    // Tạo bảng nếu chưa tồn tại
    await db.exec(`
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            price REAL
        );
    `);
    
    // Chèn dữ liệu mẫu (sử dụng INSERT OR IGNORE để tránh chèn trùng khi server khởi động lại)
    await db.exec(`
        INSERT OR IGNORE INTO products (id, name, price) VALUES 
        (1, 'Laptop Core i5', 1200.00),
        (2, 'Điện thoại thông minh X', 850.50),
        (3, 'Bàn phím cơ Z', 75.99);
    `);
    
    console.log('Database initialized and ready. Data inserted.');
}

// Endpoint để lấy danh sách sản phẩm
app.get('/api/products', async (req, res) => {
    try {
        const products = await db.all('SELECT * FROM products');
        res.json({ products: products });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Failed to retrieve products' });
    }
});

// Endpoint đơn giản cho mục đích kiểm tra sức khỏe server (health check)
app.get('/', (req, res) => {
    res.send('Backend API is running.');
});

// Khởi động server sau khi setup database thành công
setupDatabase().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
        console.log(`Access API endpoint at http://localhost:${PORT}/api/products`);
    });
}).catch(err => {
    console.error("Failed to initialize database and start server:", err);
});