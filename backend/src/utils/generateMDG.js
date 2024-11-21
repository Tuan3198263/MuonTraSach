const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
  collectionName: { type: String, required: true },
  currentCount: { type: Number, default: 0 }
});

// Kiểm tra nếu model 'Counter' đã tồn tại
const Counter = mongoose.models.Counter || mongoose.model('Counter', counterSchema);

// Hàm lấy mã số tự động
async function generateMDG() {
  const counter = await Counter.findOneAndUpdate(
    { collectionName: 'DocGia' },
    { $inc: { currentCount: 1 } },
    { new: true, upsert: true }
  );
  return `DG${counter.currentCount.toString().padStart(3, '0')}`; // VD: DG0001
}

module.exports = generateMDG;
