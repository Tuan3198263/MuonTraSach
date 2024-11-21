const express = require('express');
const router = express.Router();
const upload = require('../config/multerConfig'); // Import multer config đã cấu hình sẵn
const sachController = require('../controller/sachController');

// Định tuyến API cho việc thêm sách mới
router.post('/add', upload, sachController.themSachMoi);

// API sửa sách
router.put('/edit/:MaSach', upload, sachController.suaSach);

// API xóa sách
router.delete('/delete/:MaSach', sachController.xoaSach);

// Route lấy tất cả sách
router.get('/list', sachController.layTatCaSach);

// Thêm route để lấy thông tin sách theo mã sách
router.get('/thongtin/:MaSach', sachController.laySachTheoMa);


module.exports = router;
