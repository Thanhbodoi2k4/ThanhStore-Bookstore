const mongoose = require('mongoose');
require('dotenv').config();
const Book = require('./models/books.model');

const featuredBooks = [
    'Rừng Na-uy',
    'Nghĩ Giàu Làm Giàu',
    'Đắc Nhân Tâm',
    'Dế Mèn Phiêu Lưu Ký',
    'Tôi Thấy Hoa Vàng Trên Cỏ Xanh',
    'Kim Tứ Đồ',
    'Harry Potter và Tên tù nhân ngục Azkaban',
    'Chúa Tể Những Chiếc Nhẫn: Hiệp Hội Bảo Vệ Nhẫn',
    'Mật Mã Da Vinci',
    'Số Đỏ',
    'Đời Ngắn Đừng Ngủ Dài',
    'Sống Mòn'
];

mongoose.connect(process.env.MONGODB_CONNECT_URI).then(async () => {
    console.log('Connected to MongoDB');
    
    // Reset all featured status first
    await Book.updateMany({}, { isFeatured: false });
    
    const books = await Book.find({ name: { $in: featuredBooks } });
    console.log(`Found ${books.length} books to feature`);
    
    for (let book of books) {
        book.isFeatured = true;
        await book.save();
        console.log('Updated:', book.name);
    }
    
    console.log('Done!');
    mongoose.disconnect();
}).catch(err => {
    console.error('Error:', err);
    process.exit(1);
});
