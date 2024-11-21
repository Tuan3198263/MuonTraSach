const multer = require('multer');
const path = require('path');

const storage = multer.memoryStorage(); // Lưu file trực tiếp trong bộ nhớ


// Cấu hình Multer để chỉ chấp nhận file ảnh và giới hạn kích thước
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Giới hạn kích thước file tối đa (5MB)
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image')) {
      return cb(new Error('Chỉ chấp nhận file ảnh'));
    }
    cb(null, true); // Cho phép file ảnh
  }
}).single('BiaSach'); // Tên trường trong form-data là 'BiaSach'


module.exports = upload;
