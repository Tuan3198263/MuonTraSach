// src/api/muonSachRoutes.js

const express = require('express');
const router = express.Router();
const muonSachController = require('../controller/muonSachController');
const authMiddleware = require('../middleware/authMiddleware');

// Route mượn sách
router.post('/muon', muonSachController.muonSach);

// Route trả sách
router.post('/tra', muonSachController.traSach);

//router xóa sách (trả rồi mới xóa đc)
router.delete('/xoa', muonSachController.xoaSach);


// Route lấy toàn bộ danh sách theo dõi mượn sách
router.get('/list', muonSachController.layDanhSachTheoDoiMuonSach);



router.get('/docGia/sach-da-muon', authMiddleware, muonSachController.layDanhSachSachDaMuonCuaDocGia);

// Route cho API mượn sách từ độc giả
router.post('/docGia/muon', authMiddleware, muonSachController.muonSachNguoiDung);


// Route kiểm tra xem người dùng đã mượn sách hay chưa
router.post('/docGia/kiem-tra-sach-da-muon',authMiddleware, muonSachController.kiemTraSachDaMuon);



module.exports = router;
