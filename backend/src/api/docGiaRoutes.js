// routes/docGiaRoutes.js
const express = require('express');
const router = express.Router();
const docGiaController = require('../controller/docGiaController');

// Đăng ký
router.post('/register', docGiaController.register);

// Đăng nhập
router.post('/login', docGiaController.login);



// Thêm độc giả mới (toàn bộ thông tin)
router.post('/themDocGia', docGiaController.themDocGia);

// Cập nhật thông tin độc giả từ phía admin
router.put('/edit/:MaDocGia', docGiaController.updateUserInfoByAdmin);  // Hoặc sử dụng PATCH

// API lấy danh sách độc giả
router.get('/getAllDocGia', docGiaController.getAllDocGia);

// Đường dẫn xóa độc giả
router.delete('/delete/:MaDocGia', docGiaController.deleteDocGia);

// API lấy thông tin độc giả theo MaDocGia
router.get('/thongtin/:MaDocGia', docGiaController.getDocGiaByMaDocGia);

// **Route mới** API lấy thông tin độc giả từ token
router.get('/thongtin', docGiaController.getUserInfoFromToken);


module.exports = router;
