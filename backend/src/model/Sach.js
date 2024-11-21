const mongoose = require('mongoose');
const NhaXuatBan = require('./NhaXuatBan');  // Import model NhaXuatBan

const sachSchema = new mongoose.Schema({
  MaSach: { type: String, required: true, unique: true },
  TenSach: { type: String, required: true },
  DonGia: { type: Number, required: true },
  SoLuong: { type: Number, required: true },
  MaNXB: { type: mongoose.Schema.Types.ObjectId, ref: 'NhaXuatBan', required: true }, // Tham chiếu đến NhaXuatBan
  TacGia: { type: String, required: true },
  BiaSach: { type: String, required: false }  // Trường BiaSach lưu trữ URL hoặc đường dẫn ảnh
});

module.exports = mongoose.model('Sach', sachSchema, 'Sach');
