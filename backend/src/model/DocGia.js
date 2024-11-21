const mongoose = require('mongoose');

const docGiaSchema = new mongoose.Schema({
  MaDocGia: { type: String, required: true, unique: true },
  Ho: { type: String, required: true },
  Ten: { type: String, required: true },
  NgaySinh: { type: Date, required: false },
  GioiTinh: { type: String, required: false },
  DiaChi: { type: String, required: false },
  Sdt: { type: String, required: true },
  Password: { type: String, required: true } // Thêm trường mật khẩu
});


module.exports = mongoose.model('DocGia', docGiaSchema, 'DocGia');
