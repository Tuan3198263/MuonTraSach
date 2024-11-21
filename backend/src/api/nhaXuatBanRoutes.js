// src/api/nhaXuatBanRoutes.js
const express = require('express');
const router = express.Router();
const nhaXuatBanController = require('../controller/nhaXuatBanController');

// Route để thêm nhà xuất bản
router.post('/add', nhaXuatBanController.addNhaXuatBan);

// Route để sửa nhà xuất bản
router.put('/edit', nhaXuatBanController.updateNhaXuatBan);

// Route để xóa nhà xuất bản
router.delete('/delete/:MaNXB', nhaXuatBanController.deleteNhaXuatBan);


// Route lấy danh sách nhà xuất bản
router.get('/list', nhaXuatBanController.getAllNhaXuatBan);

module.exports = router;
