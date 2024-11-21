const express = require('express');
const router = express.Router();
const nhanVienController = require('../controller/nhanVienController');

// API Đăng ký nhân viên
router.post('/register', nhanVienController.register);

// API Đăng nhập nhân viên
router.post('/login', nhanVienController.login);

// Route lấy hồ sơ nhân viên theo _id
router.get('/ho-so-nhan-vien', nhanVienController.getNhanVienById);

module.exports = router;
