const express = require('express');
const Notification = require('../model/Notification');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware'); // Middleware xác thực token

// Lấy danh sách thông báo của người dùng dựa trên token
router.get('/', authMiddleware, async (req, res) => {
  try {
    const docGiaId = req.user._id;  // Lấy docGiaId từ decoded token

    // Kiểm tra người dùng có tồn tại không
    const notifications = await Notification.find({ docGiaId }).sort({ createdAt: -1 }); // Sắp xếp theo thời gian tạo (mới nhất trước)

    // Trả về danh sách thông báo
    return res.status(200).json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});



// API gửi thông báo tới docGia
router.post('/send', async (req, res) => {
  try {
    const { message, docGiaId } = req.body;  // Lấy thông tin message và docGiaId từ body

    // Kiểm tra nếu thiếu thông tin
    if (!message || !docGiaId) {
      return res.status(400).json({ message: 'Message and docGiaId are required' });
    }

    // Tạo mới một thông báo
    const notification = new Notification({
      docGiaId,  // docGiaId lấy từ request body
      message, // message lấy từ request body
      isRead: false,  // Mặc định là chưa đọc
      createdAt: new Date(),  // Thời gian tạo thông báo
    });

    // Lưu thông báo vào cơ sở dữ liệu
    await notification.save();

    // Trả về thông báo thành công
    return res.status(201).json({
      message: 'Notification sent successfully!',
      notification, // Trả về thông báo vừa tạo
    });

  } catch (error) {
    console.error('Error sending notification:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
