// src/controller/muonSachController.js
const TheoDoiMuonSach = require('../model/TheoDoiMuonSach');
const DocGia = require('../model/DocGia');
const Sach = require('../model/Sach');
const Notification = require('../model/Notification'); // Đảm bảo bạn đã import model Notification


exports.muonSach = async (req, res) => {
  try {
    const { MaDocGia, MaSach, ThoiHanMuon } = req.body;

    if (!MaDocGia || !MaSach || !ThoiHanMuon) {
      return res.status(400).json({ message: 'Thiếu thông tin mượn sách.' });
    }

    // Kiểm tra xem độc giả và sách có tồn tại hay không
    const docGia = await DocGia.findById(MaDocGia);
    const sach = await Sach.findById(MaSach);
    if (!docGia || !sach) {
      return res.status(404).json({ message: 'Không tìm thấy độc giả hoặc sách.' });
    }

    // Kiểm tra số lượng sách còn lại
    if (sach.SoLuong <= 0) {
      return res.status(400).json({ message: 'Sách đã hết.' });
    }

    // Kiểm tra sách đã được mượn bởi độc giả này chưa
    const sachDangMuon = await TheoDoiMuonSach.findOne({ MaDocGia, MaSach, TrangThai: 'Đang mượn' });
    if (sachDangMuon) {
      return res.status(400).json({ message: 'Sách đã được mượn.' });
    }

    // Tạo bản ghi mượn sách mới
    const ngayMuon = new Date();
    const ngayTra = new Date(ngayMuon);
    ngayTra.setDate(ngayTra.getDate() + ThoiHanMuon);

    const muonSach = new TheoDoiMuonSach({
      MaDocGia,
      MaSach,
      NgayMuon: ngayMuon,
      NgayTra: ngayTra,
      TrangThai: 'Đang mượn'
    });

    // Lưu bản ghi mượn sách và giảm số lượng sách
    await muonSach.save();
    sach.SoLuong -= 1;
    await sach.save();

    

    res.status(201).json({ message: 'Mượn sách thành công', data: muonSach });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};




exports.traSach = async (req, res) => {
  try {
    const { MaDocGia, MaSach } = req.body;

    // Kiểm tra bản ghi mượn sách
    const muonSach = await TheoDoiMuonSach.findOne({ MaDocGia, MaSach, TrangThai: 'Đang mượn' });
    if (!muonSach) {
      return res.status(404).json({ message: 'Không tìm thấy bản ghi mượn sách.' });
    }

    // Cập nhật trạng thái thành 'Đã trả' và thêm ngày trả hiện tại
    muonSach.TrangThai = 'Đã trả';
    muonSach.NgayTra = new Date();  // Cập nhật ngày trả là thời gian hiện tại
    await muonSach.save();

    // Cập nhật số lượng sách
    const sach = await Sach.findById(MaSach);
    if (sach) {
      sach.SoLuong += 1;
      await sach.save();
    }

     // Tạo thông báo cho người dùng khi trả sách thành công
    const notification = new Notification({
      docGiaId: MaDocGia,  // ID người trả sách
      message: `Chúng tôi đã nhận được sách của bạn: "${sach.TenSach}". Cảm ơn bạn!`,
      isRead: false,
      createdAt: new Date(),
    });

    // Lưu thông báo vào cơ sở dữ liệu
    await notification.save();

    res.status(200).json({ message: 'Trả sách thành công', data: muonSach });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

exports.xoaSach = async (req, res) => {
  try {
    const { MaDocGia, MaSach } = req.body;

    // Kiểm tra bản ghi mượn sách
    const muonSach = await TheoDoiMuonSach.findOne({ MaDocGia, MaSach });
    
    if (!muonSach) {
      return res.status(404).json({ message: 'Không tìm thấy bản ghi mượn sách.' });
    }

    // Kiểm tra trạng thái, chỉ xóa khi trạng thái là "Đã trả"
    if (muonSach.TrangThai !== 'Đã trả') {
      return res.status(400).json({ message: 'Không thể xóa khi sách chưa được trả.' });
    }

    // Xóa bản ghi mượn sách
    await TheoDoiMuonSach.deleteOne({ _id: muonSach._id });

    res.status(200).json({ message: 'Xóa bản ghi mượn sách thành công' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};


exports.layDanhSachTheoDoiMuonSach = async (req, res) => {
  try {
    // Lấy tất cả các bản ghi theo dõi mượn sách từ cơ sở dữ liệu
    const theoDoiMuonSach = await TheoDoiMuonSach.find().populate('MaDocGia MaSach');

    res.status(200).json({
      message: 'Lấy danh sách theo dõi mượn sách thành công',
      data: theoDoiMuonSach,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// lấy danh sách sách đang mươn của độc giả
exports.layDanhSachSachDaMuonCuaDocGia = async (req, res) => {
  try {
    const userId = req.user._id; // Lấy _id từ user trong middleware

    // Tìm các bản ghi mượn sách của độc giả với trạng thái "Đang mượn" dựa trên userId
    const sachDaMuon = await TheoDoiMuonSach.find({ MaDocGia: userId, TrangThai: 'Đang mượn' }).populate('MaSach');

    if (!sachDaMuon || sachDaMuon.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy sách đã mượn của độc giả này.' });
    }

    res.status(200).json({
      message: 'Lấy danh sách sách đã mượn của độc giả thành công',
      data: sachDaMuon,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

exports.muonSachNguoiDung = async (req, res) => {
  try {
    const { MaSach, ThoiHanMuon } = req.body;
    // Giải mã token để lấy MaDocGia
    const userId = req.user._id; // Lấy _id từ user trong middleware

    if (!MaSach || !ThoiHanMuon) {
      return res.status(400).json({ message: 'Thiếu thông tin mượn sách.' });
    }

    // Kiểm tra xem sách có tồn tại hay không
    const sach = await Sach.findById(MaSach);
    if (!sach) {
      return res.status(404).json({ message: 'Không tìm thấy sách.' });
    }

    // Kiểm tra số lượng sách còn lại
    if (sach.SoLuong <= 0) {
      return res.status(400).json({ message: 'Sách đã hết.' });
    }

    // Kiểm tra sách đã được mượn bởi độc giả này chưa
    const sachDangMuon = await TheoDoiMuonSach.findOne({ MaDocGia: userId, MaSach, TrangThai: 'Đang mượn' });
    if (sachDangMuon) {
      return res.status(400).json({ message: 'Sách đã được mượn.' });
    }

    // Tạo bản ghi mượn sách mới
    const ngayMuon = new Date();
    const ngayTra = new Date(ngayMuon);
    ngayTra.setDate(ngayTra.getDate() + ThoiHanMuon);

    const muonSach = new TheoDoiMuonSach({
      MaDocGia: userId,
      MaSach,
      NgayMuon: ngayMuon,
      NgayTra: ngayTra,
      TrangThai: 'Đang mượn'
    });

    // Lưu bản ghi mượn sách và giảm số lượng sách
    await muonSach.save();
    sach.SoLuong -= 1;
    await sach.save();

  // Tạo thông báo cho người dùng
    const notification = new Notification({
      docGiaId: userId,  // ID người mượn sách
      message: `Bạn đã mượn sách "${sach.TenSach}". Hạn trả là: ${ngayTra.toLocaleDateString()}.`,
      isRead: false,
      createdAt: new Date(),
    });

    // Lưu thông báo vào cơ sở dữ liệu
    await notification.save();

    res.status(201).json({ message: 'Mượn sách thành công', data: muonSach });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};


// src/controller/muonSachController.js

exports.kiemTraSachDaMuon = async (req, res) => {
  try {
    const { MaSach } = req.body;
    const userId = req.user._id; // Lấy _id từ user trong middleware

    if (!MaSach) {
      return res.status(400).json({ message: 'Thiếu thông tin mã sách.' });
    }

    // Kiểm tra xem người dùng đã mượn sách này chưa
    const sachDangMuon = await TheoDoiMuonSach.findOne({ MaDocGia: userId, MaSach, TrangThai: 'Đang mượn' });

    if (sachDangMuon) {
      // Nếu sách đang được mượn bởi người dùng, trả về kết quả để disable nút mượn sách
      return res.status(200).json({ message: 'Người dùng đã mượn sách này.', daMuon: true });
    }

    // Nếu người dùng chưa mượn sách
    return res.status(200).json({ message: 'Người dùng chưa mượn sách này.', daMuon: false });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};
