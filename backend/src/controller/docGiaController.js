// controller/docGiaController.js
const jwt = require('jsonwebtoken');
const DocGia = require('../model/DocGia'); // Import model DocGia
const TheoDoiMuonSach = require('../model/TheoDoiMuonSach');  // Import model TheoDoiMuonSach
const generateMDG = require('../utils/generateMDG'); // Đảm bảo đường dẫn đúng với vị trí file generateMDG.js

// Đăng ký độc giả
exports.register = async (req, res) => {
  const { Ho, Ten, Sdt, Password, NgaySinh, GioiTinh, DiaChi } = req.body;

  // Kiểm tra xem số điện thoại đã tồn tại chưa
  const existingDocGia = await DocGia.findOne({ Sdt });
  if (existingDocGia) {
    return res.status(400).json({ message: 'Số điện thoại đã tồn tại' });
  }

  // Tạo mã độc giả tự động
  const MaDocGia = await generateMDG(); // Lấy mã độc giả từ hàm generateMDG

  // Tạo một đối tượng độc giả mới
  const docGia = new DocGia({
    MaDocGia,
    Ho,
    Ten,
    Sdt,
    Password, // Lưu mật khẩu không mã hóa
    NgaySinh,
    GioiTinh,
    DiaChi
  });

  try {
    // Lưu độc giả vào cơ sở dữ liệu
    await docGia.save();
    res.status(201).json({ message: 'Đăng ký thành công', docGia });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi đăng ký', error });
  }
};



// Đăng nhập độc giả
exports.login = async (req, res) => {
  const { Sdt, Password } = req.body;

  try {
    // Kiểm tra xem số điện thoại có tồn tại không
    const docGia = await DocGia.findOne({ Sdt });
    if (!docGia) {
      return res.status(400).json({ message: 'Số điện thoại không tồn tại' });
    }

    // Kiểm tra mật khẩu
    if (Password !== docGia.Password) { // Không mã hóa mật khẩu nữa, so sánh trực tiếp
      return res.status(400).json({ message: 'Mật khẩu không đúng' });
    }

    // Tạo token (JWT)
    // Tạo token khi đăng nhập thành công
    const token = jwt.sign({ _id: docGia._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Chuẩn bị dữ liệu thông tin độc giả để trả về
    const userInfo = {
      _id: docGia._id,      // Thêm trường _id của độc giả
      MaDocGia: docGia.MaDocGia,
      Ho: docGia.Ho,
      Ten: docGia.Ten,
      Sdt: docGia.Sdt,
    };

    // Log thông tin độc giả và token vào console
    console.log('Đăng nhập thành công! Thông tin độc giả:', userInfo);
    console.log('Token:', token);

    // Trả về thông tin đăng nhập và token
    res.status(200).json({ message: 'Đăng nhập thành công', token, userInfo });
  } catch (error) {
    console.error('Lỗi trong quá trình đăng nhập:', error);
    res.status(500).json({ message: 'Lỗi máy chủ' });
  }
};





// API thêm độc giả (toàn bộ thông tin)
exports.themDocGia = async (req, res) => {
  const { Ho, Ten, Sdt, Password, NgaySinh, GioiTinh, DiaChi } = req.body;

  // Kiểm tra xem số điện thoại đã tồn tại chưa
  const existingDocGia = await DocGia.findOne({ Sdt });
  if (existingDocGia) {
    return res.status(400).json({ message: 'Số điện thoại đã tồn tại' });
  }

  // Tạo mã độc giả tự động
  const MaDocGia = await generateMDG(); // Lấy mã độc giả từ hàm generateMDG

  // Tạo một đối tượng độc giả mới
  const docGia = new DocGia({
    MaDocGia,
    Ho,
    Ten,
    Sdt,
    Password, // Lưu mật khẩu không mã hóa
    NgaySinh,
    GioiTinh,
    DiaChi
  });

  try {
    // Lưu độc giả vào cơ sở dữ liệu
    await docGia.save();
    res.status(201).json({ message: 'Thêm độc giả thành công', docGia });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi thêm độc giả', error });
  }
};

// API cập nhật thông tin độc giả từ phía admin
exports.updateUserInfoByAdmin = async (req, res) => {
  const { MaDocGia } = req.params; // Lấy MaDocGia từ params

  try {
    // Tìm độc giả theo MaDocGia
    const docGia = await DocGia.findOne({ MaDocGia });
    if (!docGia) {
      return res.status(404).json({ message: 'Không tìm thấy độc giả' });
    }

    // Các thông tin cho phép cập nhật
    const { Ho, Ten, Sdt, Password, GioiTinh, DiaChi } = req.body;

    // Cập nhật thông tin độc giả (trừ MaDocGia và _id)
    docGia.Ho = Ho || docGia.Ho;
    docGia.Ten = Ten || docGia.Ten;
    docGia.Sdt = Sdt || docGia.Sdt;
    docGia.Password = Password || docGia.Password;
    docGia.GioiTinh = GioiTinh || docGia.GioiTinh;
    docGia.DiaChi = DiaChi || docGia.DiaChi;

    // Lưu cập nhật vào cơ sở dữ liệu
    await docGia.save();
    res.status(200).json({ message: 'Cập nhật thông tin thành công', docGia });
  } catch (error) {
    console.error('Lỗi khi cập nhật thông tin:', error);
    res.status(500).json({ message: 'Lỗi máy chủ' });
  }
};

// API lấy danh sách tất cả độc giả
exports.getAllDocGia = async (req, res) => {
  try {
    // Truy vấn tất cả độc giả trong cơ sở dữ liệu
    const docGias = await DocGia.find();

    // Kiểm tra nếu không có độc giả nào
    if (docGias.length === 0) {
      return res.status(404).json({ message: 'Không có độc giả nào' });
    }

    // Trả về danh sách độc giả
    res.status(200).json({ message: 'Danh sách độc giả', docGias });
  } catch (error) {
    console.error('Lỗi khi lấy danh sách độc giả:', error);
    res.status(500).json({ message: 'Lỗi máy chủ' });
  }
};


// API xóa độc giả
exports.deleteDocGia = async (req, res) => {
  const { MaDocGia } = req.params; // Lấy MaDocGia từ params

  try {
    // Tìm _id của độc giả dựa trên MaDocGia
    const docGia = await DocGia.findOne({ MaDocGia });

    if (!docGia) {
      return res.status(404).json({ message: 'Không tìm thấy độc giả' });
    }

    // Kiểm tra xem độc giả có đang mượn sách nào không bằng _id
    const borrowedBooks = await TheoDoiMuonSach.findOne({ MaDocGia: docGia._id });

    if (borrowedBooks) {
      // Nếu có sách đang mượn, không cho phép xóa
      return res.status(400).json({ message: 'Độc giả đang mượn sách, không thể xóa.' });
    }

    // Nếu không có sách mượn, tiến hành xóa độc giả
    const deletedDocGia = await DocGia.findOneAndDelete({ MaDocGia });

    // Kiểm tra xem có tìm thấy độc giả không
    if (!deletedDocGia) {
      return res.status(404).json({ message: 'Không tìm thấy độc giả để xóa' });
    }

    // Trả về thông báo thành công và thông tin độc giả đã bị xóa
    res.status(200).json({ message: 'Xóa độc giả thành công', deletedDocGia });
  } catch (error) {
    console.error('Lỗi khi xóa độc giả:', error);
    res.status(500).json({ message: 'Lỗi máy chủ' });
  }
};


// API lấy thông tin độc giả theo MaDocGia
exports.getDocGiaByMaDocGia = async (req, res) => {
  const { MaDocGia } = req.params; // Lấy MaDocGia từ params

  try {
    // Tìm độc giả theo MaDocGia
    const docGia = await DocGia.findOne({ MaDocGia });
    
    // Nếu không tìm thấy độc giả, trả về lỗi
    if (!docGia) {
      return res.status(404).json({ message: 'Không tìm thấy độc giả với mã này' });
    }

    // Trả về thông tin độc giả
    res.status(200).json({ message: 'Thông tin độc giả', docGia });
  } catch (error) {
    console.error('Lỗi khi lấy thông tin độc giả:', error);
    res.status(500).json({ message: 'Lỗi máy chủ' });
  }
};

// API lấy thông tin độc giả từ token
exports.getUserInfoFromToken = async (req, res) => {
  // Lấy token từ header Authorization
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Token không tồn tại' });
  }

  try {
    // Giải mã token để lấy MaDocGia
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const _id = decoded._id; // Lấy MaDocGia từ decoded token

    
    // Tìm độc giả theo MaDocGia
    const docGia = await DocGia.findOne({ _id });
    if (!docGia) {
      return res.status(404).json({ message: 'Không tìm thấy độc giả' });
    }

    // Chuẩn bị thông tin độc giả để trả về
    const userInfo = {
      MaDocGia: docGia.MaDocGia,
      Ho: docGia.Ho,
      Ten: docGia.Ten,
      NgaySing: docGia.NgaySinh,
      GioiTinh: docGia.GioiTinh,
      DiaChi: docGia.DiaChi,
      Password: docGia.Password,
      Sdt: docGia.Sdt,
    };

    // Trả về thông tin độc giả
    res.status(200).json({ message: 'Thông tin độc giả', userInfo });
  } catch (error) {
    console.error('Lỗi khi lấy thông tin độc giả từ token:', error);
    res.status(500).json({ message: 'Lỗi máy chủ' });
  }
};

