// src/index.js
const express = require('express');
require('dotenv').config();
const cors = require('cors');
const connectToDatabase = require('./db'); // Import function kết nối


// Khai báo biến cho các route
const nhaXuatBanRoutes = require('./api/nhaXuatBanRoutes');
const sachRoutes = require('./api/sachRoutes')
const nhanVienRoutes = require('./api/nhanVienRoutes');
const docGiaRoutes = require('./api/docGiaRoutes'); 
const muonSachRoutes = require('./api/muonSachRoutes');
const notificationRoutes = require('./api/notificationRoutes');


const app = express();
const PORT = 3000;


// connect dtb
connectToDatabase();

// Middleware
app.use(express.json());
// Cấu hình CORS
app.use(cors());


// Định tuyến API cho nhà xuất bản
app.use('/api/nhaXuatBan', nhaXuatBanRoutes);

// Định tuyến API cho sách
app.use('/api/sach', sachRoutes);  // Đảm bảo rằng route cho sách được sử dụng

// Sử dụng routes nhân viên
app.use('/api/nhanVien', nhanVienRoutes);

// Sử dụng các route cho DocGia
app.use('/api/docGia', docGiaRoutes);

// Định tuyến cho API mượn sách
app.use('/api/muon-sach', muonSachRoutes);

// Sử dụng route thông báo
app.use('/api/notifications', notificationRoutes);


// Khởi chạy server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
