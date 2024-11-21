// src/controller/nhaXuatBanController.js
const mongoose = require('mongoose');
const NhaXuatBan = require('../model/NhaXuatBan');
const Sach = require('../model/Sach');


// Thêm nhà xuất bản mới
exports.addNhaXuatBan = async (req, res) => {
  const { MaNXB, TenNXB, DiaChi } = req.body;

  try {
    // Kiểm tra xem nhà xuất bản đã tồn tại chưa
    const existingNhaXuatBan = await NhaXuatBan.findOne({ MaNXB });
    if (existingNhaXuatBan) {
      return res.status(400).json({ message: 'Nhà xuất bản đã tồn tại với mã này' });
    }

    // Tạo nhà xuất bản mới
    const newNhaXuatBan = new NhaXuatBan({ MaNXB, TenNXB, DiaChi });
    await newNhaXuatBan.save();
    res.status(201).json({ message: 'Nhà xuất bản đã được thêm thành công', data: newNhaXuatBan });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi hệ thống', error: err.message });
  }
};

// Sửa thông tin nhà xuất bản
exports.updateNhaXuatBan = async (req, res) => {
  const { MaNXB, TenNXB, DiaChi } = req.body;

  try {
    // Tìm nhà xuất bản bằng mã
    const nhaXuatBan = await NhaXuatBan.findOne({ MaNXB });
    if (!nhaXuatBan) {
      return res.status(404).json({ message: 'Nhà xuất bản không tồn tại' });
    }

    // Cập nhật thông tin
    nhaXuatBan.TenNXB = TenNXB || nhaXuatBan.TenNXB;
    nhaXuatBan.DiaChi = DiaChi || nhaXuatBan.DiaChi;

    await nhaXuatBan.save();
    res.status(200).json({ message: 'Thông tin nhà xuất bản đã được cập nhật', data: nhaXuatBan });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi hệ thống', error: err.message });
  }
};






exports.deleteNhaXuatBan = async (req, res) => {
  const { MaNXB } = req.params;

  try {
    // Tìm nhà xuất bản bằng MaNXB
    const nhaXuatBan = await NhaXuatBan.findOne({ MaNXB });
    if (!nhaXuatBan) {
      return res.status(404).json({ message: 'Nhà xuất bản không tồn tại' });
    }

    // Lấy _id của nhà xuất bản vừa tìm được
    const publisherId = nhaXuatBan._id;

    // Kiểm tra trong collection 'Sach' xem có sách nào tham chiếu tới MaNXB không
    const sachCount = await Sach.countDocuments({ MaNXB: publisherId });
    if (sachCount > 0) {
      return res.status(400).json({ message: 'Không thể xóa nhà xuất bản vì có sách liên quan' });
    }

    // Nếu không có sách nào liên quan, xóa nhà xuất bản
    await NhaXuatBan.findByIdAndDelete(publisherId);

    res.status(200).json({ message: 'Nhà xuất bản đã được xóa thành công' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi hệ thống', error: err.message });
  }
};



// Lấy danh sách nhà xuất bản
exports.getAllNhaXuatBan = async (req, res) => {
  try {
    // Lấy tất cả nhà xuất bản từ cơ sở dữ liệu
    const nhaXuatBanList = await NhaXuatBan.find();

    // Kiểm tra nếu không có nhà xuất bản nào
    if (nhaXuatBanList.length === 0) {
      return res.status(404).json({ message: 'Không có nhà xuất bản nào' });
    }

    // Trả về danh sách nhà xuất bản
    res.status(200).json({ message: 'Danh sách nhà xuất bản', data: nhaXuatBanList });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi hệ thống', error: err.message });
  }
};