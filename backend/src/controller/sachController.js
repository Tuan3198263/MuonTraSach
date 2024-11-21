const Sach = require('../model/Sach');  // Model sách
const TheoDoiMuonSach = require('../model/TheoDoiMuonSach')
const cloudinary = require('../config/cloudinaryConfig');  // Cấu hình Cloudinary

// Logic thêm sách mới
exports.themSachMoi = async (req, res) => {
  const { MaSach, TenSach, DonGia, SoLuong, MaNXB, TacGia } = req.body;
  let biaSachUrl = '';  // Đảm bảo ảnh bìa sẽ được lưu dưới dạng URL nếu có

  // Kiểm tra xem sách đã tồn tại hay chưa
  const sachExist = await Sach.findOne({ MaSach });
  if (sachExist) {
    return res.status(400).json({ message: 'Sách với mã này đã tồn tại' });
  }

  // Kiểm tra nếu có ảnh bìa được gửi lên
  if (req.file) {
    try {
      // Upload ảnh lên Cloudinary từ buffer
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            resource_type: 'image',
            folder: 'sach_bia', // Tùy chỉnh thư mục trên Cloudinary
          },
          (error, result) => {
            if (error) {
              reject(error);
            }
            resolve(result);
          }
        ).end(req.file.buffer);  // Gửi buffer ảnh lên Cloudinary
      });

      // Lấy URL ảnh từ Cloudinary sau khi upload thành công
      biaSachUrl = result.secure_url;
    } catch (error) {
      return res.status(500).json({ message: 'Lỗi khi upload ảnh lên Cloudinary', error });
    }
  }

  // Tạo đối tượng sách mới
  const sach = new Sach({
    MaSach,
    TenSach,
    DonGia,
    SoLuong,
    MaNXB,
    TacGia,
    BiaSach: biaSachUrl || '',  // Nếu không có ảnh bìa thì để trống
  });

  try {
    // Lưu sách vào MongoDB
    await sach.save();
    res.status(201).json({ message: 'Sách đã được thêm thành công!', sach });
  } catch (error) {
    res.status(400).json({ message: 'Lỗi khi thêm sách', error });
  }
};



exports.suaSach = async (req, res) => {
  const { MaSach } = req.params;  // Lấy mã sách từ params
  const { TenSach, DonGia, SoLuong, TacGia, MaNXB } = req.body; // Lấy dữ liệu cần sửa

  let biaSachUrl = '';  // Đảm bảo ảnh bìa sẽ được lưu dưới dạng URL nếu có

  // Kiểm tra xem sách có tồn tại không
  const sach = await Sach.findOne({ MaSach });
  if (!sach) {
    return res.status(404).json({ message: 'Sách không tồn tại' });
  }

  // Kiểm tra nếu có ảnh bìa mới được gửi lên
  if (req.file) {
    try {
      // Upload ảnh lên Cloudinary từ buffer
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            resource_type: 'image',
            folder: 'sach_bia', // Tùy chỉnh thư mục trên Cloudinary
          },
          (error, result) => {
            if (error) {
              reject(error);
            }
            resolve(result);
          }
        ).end(req.file.buffer);  // Gửi buffer ảnh lên Cloudinary
      });

      // Lấy URL ảnh từ Cloudinary sau khi upload thành công
      biaSachUrl = result.secure_url;
    } catch (error) {
      return res.status(500).json({ message: 'Lỗi khi upload ảnh lên Cloudinary', error });
    }
  }

  // Cập nhật thông tin sách
  sach.TenSach = TenSach || sach.TenSach;
  sach.DonGia = DonGia || sach.DonGia;
  sach.SoLuong = SoLuong || sach.SoLuong;
  sach.TacGia = TacGia || sach.TacGia;
  sach.MaNXB = MaNXB || sach.MaNXB;
  sach.BiaSach = biaSachUrl || sach.BiaSach;  // Nếu không có ảnh bìa mới thì giữ nguyên ảnh cũ

  try {
    // Lưu lại thông tin sách đã sửa
    const updatedSach = await sach.save();  // Đảm bảo gọi save để lưu lại thay đổi
    res.status(200).json({ message: 'Sách đã được sửa thành công!', sach: updatedSach });
  } catch (error) {
    res.status(400).json({ message: 'Lỗi khi sửa sách', error });
  }
};



// Xóa sách bằng mã sách
exports.xoaSach = async (req, res) => {
  const { MaSach } = req.params;  // Lấy mã sách từ params

  try {
    // Kiểm tra xem sách có tồn tại không
    const sach = await Sach.findOne({ MaSach });
    if (!sach) {
      return res.status(404).json({ message: 'Sách không tồn tại' });
    }

    // Kiểm tra xem sách có đang được mượn không
    const theoDoiMuonSach = await TheoDoiMuonSach.findOne({ MaSach: sach._id });
    if (theoDoiMuonSach) {
      return res.status(400).json({ message: 'Sách đang được mượn, không thể xóa' });
    }

    // Xóa sách khỏi MongoDB
    await Sach.deleteOne({ _id: sach._id });  // Xóa sách dựa trên _id của sách
    res.status(200).json({ message: 'Sách đã được xóa thành công!' });
  } catch (error) {
    console.error('Error deleting book:', error);  // Log lỗi chi tiết
    res.status(500).json({ message: 'Lỗi khi xóa sách', error: error.message || error });
  }
};




// Lấy tất cả sách và thông tin nhà xuất bản
exports.layTatCaSach = async (req, res) => {
  try {
    // Tìm tất cả sách và populate trường MaNXB từ collection NXB
    const sachList = await Sach.find().populate('MaNXB', 'TenNXB'); // Lấy TenNXB từ NXB
    
    // Kiểm tra nếu không có sách nào
    if (sachList.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy sách nào' });
    }

    // Trả về danh sách sách
    res.status(200).json({
      message: 'Lấy danh sách sách thành công!',
      sachList
    });
  } catch (error) {
    console.error('Error fetching books:', error);  // Log lỗi chi tiết
    res.status(500).json({ message: 'Lỗi khi lấy danh sách sách', error: error.message || error });
  }
};

// Lấy thông tin một sách theo mã sách
exports.laySachTheoMa = async (req, res) => {
  const { MaSach } = req.params;  // Lấy mã sách từ params

  try {
    // Tìm sách theo MaSach và populate thông tin Nhà Xuất Bản (MaNXB)
    const sach = await Sach.findOne({ MaSach }).populate('MaNXB', 'TenNXB'); 

    // Kiểm tra nếu không tìm thấy sách
    if (!sach) {
      return res.status(404).json({ message: 'Không tìm thấy sách với mã này' });
    }

    // Trả về thông tin sách
    res.status(200).json({
      message: 'Lấy thông tin sách thành công!',
      sach
    });
  } catch (error) {
    console.error('Error fetching book:', error);  // Log lỗi chi tiết
    res.status(500).json({ message: 'Lỗi khi lấy thông tin sách', error: error.message || error });
  }
};