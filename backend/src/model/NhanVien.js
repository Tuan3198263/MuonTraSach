const mongoose = require('mongoose');

const nhanVienSchema = new mongoose.Schema({
  MSNV: { type: String, required: true, unique: true },
  HoTenNv: { type: String, required: true },
  Password: { type: String, required: true },   // Bạn có thể mã hóa mật khẩu nếu cần
  ChucVu: { type: String, required: true },
  DiaChi: { type: String, required: true },
  Sdt: { type: String, required: true, unique: true }
});

module.exports = mongoose.model('NhanVien', nhanVienSchema, 'NhanVien');
