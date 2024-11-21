const jwt = require('jsonwebtoken');
const NhanVien = require('../model/NhanVien');  // Model Nhân Viên
const generateMSNV = require('../utils/generateMSNV');  // Import hàm tạo mã số tự động

// Đăng ký nhân viên
exports.register = async (req, res) => {
  const { Sdt, Password, HoTenNv, ChucVu, DiaChi } = req.body;

  // Kiểm tra số điện thoại đã tồn tại chưa
  const existingNhanVien = await NhanVien.findOne({ Sdt });
  if (existingNhanVien) {
    return res.status(400).json({ message: 'Số điện thoại đã tồn tại' });
  }

  // Tạo MSNV tự động
  const MSNV = await generateMSNV();

  // Tạo đối tượng nhân viên mới
  const newNhanVien = new NhanVien({
    MSNV,
    Sdt,
    Password,  // Lưu mật khẩu trực tiếp mà không mã hóa
    HoTenNv,
    ChucVu,
    DiaChi
  });

  try {
    // Lưu nhân viên mới vào cơ sở dữ liệu
    await newNhanVien.save();
    res.status(201).json({ message: 'Đăng ký thành công', nhanVien: newNhanVien });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi đăng ký', error });
  }
};

// Đăng nhập nhân viên
exports.login = async (req, res) => {
  const { Sdt, Password } = req.body;

  // Kiểm tra xem nhân viên có tồn tại trong cơ sở dữ liệu không
  const nhanVien = await NhanVien.findOne({ Sdt });
  if (!nhanVien) {
    return res.status(400).json({ message: 'Số điện thoại không đúng' });
  }

  // Kiểm tra mật khẩu (so sánh trực tiếp với mật khẩu lưu trong cơ sở dữ liệu)
  if (Password !== nhanVien.Password) {
    return res.status(400).json({ message: 'Mật khẩu không đúng' });
  }

  // Tạo JWT token
  const token = jwt.sign({ MSNV: nhanVien.MSNV }, process.env.JWT_SECRET, { expiresIn: '1h' });

  // Lấy thông tin nhân viên để trả về cùng với token
  const { Password: _, ...userInfo } = nhanVien.toObject(); // Không gửi mật khẩu trong thông tin nhân viên

  // Log token ra console để kiểm tra
  console.log('Đăng nhập thành công! Token:', token);
  res.status(200).json({ message: 'Đăng nhập thành công', token, user: userInfo }); // Trả về thông tin nhân viên (trừ mật khẩu)
};


// Lấy thông tin nhân viên theo _id từ token
exports.getNhanVienById = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]; // Lấy token từ header Authorization

  if (!token) {
    return res.status(401).json({ message: 'Token không hợp lệ hoặc không có' });
  }

  try {
    // Giải mã token để lấy thông tin MSNV (hoặc _id)
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Sử dụng secret_key giống như lúc tạo token

    // Tìm nhân viên theo MSNV (hoặc _id)
    const nhanVien = await NhanVien.findOne({ MSNV: decoded.MSNV });  // Hoặc sử dụng decoded._id nếu bạn lưu _id trong token

    if (!nhanVien) {
      return res.status(404).json({ message: 'Không tìm thấy nhân viên' });
    }

    // Xóa trường Password trước khi trả về dữ liệu
    const { Password, ...userInfo } = nhanVien.toObject(); // Loại bỏ Password khỏi thông tin trả về

    res.status(200).json({ message: 'Lấy thông tin thành công', nhanVien: userInfo });
  } catch (error) {
    console.error('Lỗi khi lấy thông tin nhân viên:', error);
    res.status(500).json({ message: 'Lỗi máy chủ', error });
  }
};