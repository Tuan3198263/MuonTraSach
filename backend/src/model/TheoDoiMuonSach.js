const mongoose = require('mongoose');

// Model for tracking borrowed books
const theoDoiMuonSachSchema = new mongoose.Schema({
  MaDocGia: { type: mongoose.Schema.Types.ObjectId, ref: 'DocGia', required: true },
  MaSach: { type: mongoose.Schema.Types.ObjectId, ref: 'Sach', required: true },
  NgayMuon: { type: Date, required: true },
  NgayTra: { type: Date, required: true },
  TrangThai: { type: String, enum: ['Đang mượn', 'Đã trả', 'Quá hạn'], default: 'Đang mượn' }  // Thêm trường trạng thái
});

// Chỉ mục duy nhất để đảm bảo mỗi MaDocGia, MaSach, NgayMuon là duy nhất
theoDoiMuonSachSchema.index({ MaDocGia: 1, MaSach: 1, NgayMuon: 1 }, { unique: true });

module.exports = mongoose.model('TheoDoiMuonSach', theoDoiMuonSachSchema, 'TheoDoiMuonSach');
