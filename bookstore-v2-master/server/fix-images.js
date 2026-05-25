const mongoose = require('mongoose');
const Book = require('./models/books.model');

require('dotenv').config();

const MONGODB_CONNECT_URI = 'mongodb://localhost:27017/bookstore';

const imageMap = {
  'B011': 'https://m.media-amazon.com/images/I/81aY1lxk+9L._SY466_.jpg', // Tôi Thấy Hoa Vàng Trên Cỏ Xanh
  'B012': 'https://m.media-amazon.com/images/I/51Uj7L3C0XL._SY466_.jpg', // Dế Mèn Phiêu Lưu Ký
  'B013': 'https://m.media-amazon.com/images/I/71vK0WVQ4rL._SY466_.jpg', // Đắc Nhân Tâm 
  'B014': 'https://m.media-amazon.com/images/I/71UypkUjStL._SY466_.jpg', // Nghĩ Giàu Làm Giàu
  'B015': 'https://m.media-amazon.com/images/I/81Ow5CjBXfL._SY466_.jpg', // Rừng Na-uy
  'B016': 'https://m.media-amazon.com/images/I/81fXBeYYxpL._SY466_.jpg', // Hoàng Tử Bé
  'B017': 'https://m.media-amazon.com/images/I/A1aDb5B5TtL._SY466_.jpg', // Những Người Khốn Khổ
  'B018': 'https://m.media-amazon.com/images/I/61JDtQ6K4wL._SY466_.jpg', // Chí Phèo
  'B019': 'https://m.media-amazon.com/images/I/81pPzAKbm3L._SY466_.jpg', // Lược Sử Thời Gian
  'B020': 'https://m.media-amazon.com/images/I/71sBLlY0elL._SY466_.jpg', // Nhà Lãnh Đạo Không Chức Danh
  'B021': 'https://m.media-amazon.com/images/I/61zyCqpiA8L._SY466_.jpg', // Mắt Biếc
  'B022': 'https://m.media-amazon.com/images/I/71QKQ9mwV7L._SY466_.jpg', // Nghệ Thuật Tinh Tế
  'B023': 'https://m.media-amazon.com/images/I/815WORuYMML._SY466_.jpg', // Mật Mã Da Vinci
  'B024': 'https://m.media-amazon.com/images/I/81B0hMkenqL._SY466_.jpg', // Và Rồi Chẳng Còn Ai
  'B025': 'https://m.media-amazon.com/images/I/713jIoMO3UL._SY466_.jpg', // Sapiens
  'B026': 'https://m.media-amazon.com/images/I/81dGoA9V+GL._SY466_.jpg', // Cho Tôi Xin Một Vé Đi Tuổi Thơ
  'B027': 'https://m.media-amazon.com/images/I/41M3-2Z+EEL._SY466_.jpg', // Tuổi Trẻ Đáng Giá Bao Nhiêu
  'B028': 'https://m.media-amazon.com/images/I/91bYsX41DVL._SY466_.jpg', // Kafka Bên Bờ Biển
  'B029': 'https://m.media-amazon.com/images/I/71tKBHbiURL._SY466_.jpg', // Sống Mòn
  'B030': 'https://m.media-amazon.com/images/I/71sBLlY0elL._SY466_.jpg', // Đời Ngắn Đừng Ngủ Dài
};

const fixImages = async () => {
  try {
    await mongoose.connect(MONGODB_CONNECT_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    for (const [bookId, imageUrl] of Object.entries(imageMap)) {
      const result = await Book.updateOne(
        { bookId },
        { $set: { imageUrl } }
      );
      if (result.modifiedCount > 0) {
        console.log(`Updated image for ${bookId}`);
      } else {
        console.log(`Book ${bookId} not found or already updated`);
      }
    }

    console.log('All book images updated!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

fixImages();
