const mongoose = require('mongoose');
const uri = 'mongodb+srv://tuanb2113346:123@database.g9qtf.mongodb.net/Databse?retryWrites=true&w=majority'; // Thay 'your_database_name' thành tên database của bạn// Thay đổi 'your_database_name' thành tên database của bạn

async function connectToDatabase() {
    try {
        await mongoose.connect(uri);
        console.log('Connected to DataBase');
    } catch (err) {
        console.error('Could not connect to DataBase:', err);
        process.exit(1); // Dừng ứng dụng nếu không kết nối được
    }
}

// Gọi hàm kết nối trước khi khởi động server
module.exports = connectToDatabase;
