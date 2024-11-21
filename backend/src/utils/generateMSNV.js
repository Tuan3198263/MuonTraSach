const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
  collectionName: { type: String, required: true },
  currentCount: { type: Number, default: 0 }
});

const Counter = mongoose.model('Counter', counterSchema);

// Hàm lấy mã số tự động
async function generateMSNV() {
  const counter = await Counter.findOneAndUpdate(
    { collectionName: 'NhanVien' },
    { $inc: { currentCount: 1 } },
    { new: true, upsert: true }
  );
  return `NV${counter.currentCount.toString().padStart(3, '0')}`; // VD: NV001
}

module.exports = generateMSNV;
