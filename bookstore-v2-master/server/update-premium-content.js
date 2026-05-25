const mongoose = require('mongoose');
const Book = require('./models/books.model');
const Genre = require('./models/genres.model');
const Author = require('./models/authors.model');
const Publisher = require('./models/publishers.model');
require('dotenv').config();

const MONGO_URI = process.env.MONGODB_CONNECT_URI || 'mongodb://localhost:27017/bookstore';

async function updateContent() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // 1. Ensure Genre exists
    let mangaGenre = await Genre.findOne({ name: 'Truyện tranh (Manga)' });
    if (!mangaGenre) {
      mangaGenre = await Genre.create({ name: 'Truyện tranh (Manga)' });
    }

    // 2. Ensure Publisher exists
    let kimDong = await Publisher.findOne({ name: 'NXB Kim Đồng' });
    if (!kimDong) {
      kimDong = await Publisher.create({ name: 'NXB Kim Đồng' });
    }

    // 3. Ensure Authors exist
    const mangaAuthorsData = [
      { name: 'Eiichiro Oda' },
      { name: 'Masashi Kishimoto' },
      { name: 'Akira Toriyama' },
      { name: 'Koyoharu Gotouge' },
      { name: 'Gege Akutami' },
      { name: 'Tatsuya Endo' },
      { name: 'Hajime Isayama' },
      { name: 'Kohei Horikoshi' },
      { name: 'Tatsuki Fujimoto' },
      { name: 'Fujiko F. Fujio' }
    ];

    const authorsMap = {};
    for (const a of mangaAuthorsData) {
      let author = await Author.findOne({ name: a.name });
      if (!author) {
        author = await Author.create(a);
      }
      authorsMap[a.name] = author._id;
    }

    // 4. Update existing books with broken images
    const updates = [
      { name: 'Kho Báu Của Những Bức Thư', imageUrl: '/images/books/kho_bau.png' },
      { name: 'Giọng Nói Của Phố Cổ', imageUrl: '/images/books/giong_noi.png' },
      { name: 'Hành Trình Của Những Con Số', imageUrl: '/images/books/hanh_trinh.png' },
      { name: 'Bức Họa Của Gió', imageUrl: '/images/books/buc_hoa.png' },
      { name: 'Câu Chuyện Của Những Cánh Diều', imageUrl: '/images/books/cau_chuyen.png' },
      { name: 'Trái Tim Của Biển', imageUrl: '/images/books/trai_tim.png' },
      { name: 'Linh Hồn Của Những Hòn Đá', imageUrl: '/images/books/linh_hon.png' },
      { name: 'Đắc Nhân Tâm', imageUrl: 'https://firstnews.vn/upload/products/original/-1726814978.jpg' },
      { name: 'Số Đỏ', imageUrl: 'https://salt.tikicdn.com/cache/750x750/ts/product/88/94/43/86b9c04df00462fd3806e7d59a059f09.jpg' }
    ];

    for (const up of updates) {
      await Book.findOneAndUpdate({ name: up.name }, { imageUrl: up.imageUrl });
      console.log(`Updated image for: ${up.name}`);
    }

    // 5. Add 10 new premium manga series
    const newManga = [
      {
        bookId: 'MG001',
        name: 'One Piece - Đảo Hải Tặc',
        genre: [mangaGenre._id],
        author: [authorsMap['Eiichiro Oda']],
        publisher: kimDong._id,
        price: 25000,
        description: 'Hành trình của Monkey D. Luffy và băng hải tặc Mũ Rơm đi tìm kho báu huyền thoại One Piece.',
        imageUrl: '/images/books/one_piece.png',
        isFeatured: true
      },
      {
        bookId: 'MG002',
        name: 'Naruto - Phép Thuật Nhẫn Giả',
        genre: [mangaGenre._id],
        author: [authorsMap['Masashi Kishimoto']],
        publisher: kimDong._id,
        price: 22000,
        description: 'Câu chuyện về Naruto Uzumaki, một ninja trẻ tuổi luôn khao khát được thừa nhận và trở thành Hokage.',
        imageUrl: '/images/books/naruto.png',
        isFeatured: true
      },
      {
        bookId: 'MG003',
        name: '7 Viên Ngọc Rồng (Dragon Ball)',
        genre: [mangaGenre._id],
        author: [authorsMap['Akira Toriyama']],
        publisher: kimDong._id,
        price: 20000,
        description: 'Cuộc phiêu lưu của Son Goku từ khi còn nhỏ đến khi trở thành chiến binh mạnh nhất vũ trụ.',
        imageUrl: '/images/books/dragon_ball.png',
        isFeatured: true
      },
      {
        bookId: 'MG004',
        name: 'Thanh Gươm Diệt Quỷ (Demon Slayer)',
        genre: [mangaGenre._id],
        author: [authorsMap['Koyoharu Gotouge']],
        publisher: kimDong._id,
        price: 28000,
        description: 'Hành trình diệt quỷ và tìm cách biến em gái trở lại thành người của Tanjiro Kamado.',
        imageUrl: '/images/books/demon_slayer.png',
        isFeatured: true
      },
      {
        bookId: 'MG005',
        name: 'Chú Thuật Hồi Chiến (Jujutsu Kaisen)',
        genre: [mangaGenre._id],
        author: [authorsMap['Gege Akutami']],
        publisher: kimDong._id,
        price: 30000,
        description: 'Yuji Itadori dấn thân vào thế giới của các chú thuật sư sau khi nuốt phải ngón tay của Sukuna.',
        imageUrl: '/images/books/jujutsu_kaisen.png',
        isFeatured: true
      },
      {
        bookId: 'MG006',
        name: 'Gia Đình Điệp Viên (Spy x Family)',
        genre: [mangaGenre._id],
        author: [authorsMap['Tatsuya Endo']],
        publisher: kimDong._id,
        price: 35000,
        description: 'Một điệp viên, một sát thủ và một cô bé có khả năng đọc tâm trí cùng tạo nên một gia đình giả.',
        imageUrl: '/images/books/spy_x_family.png',
        isFeatured: true
      },
      {
        bookId: 'MG007',
        name: 'Đại Chiến Titan (Attack on Titan)',
        genre: [mangaGenre._id],
        author: [authorsMap['Hajime Isayama']],
        publisher: kimDong._id,
        price: 32000,
        description: 'Cuộc chiến sinh tồn của nhân loại chống lại những sinh vật khổng lồ ăn thịt người gọi là Titan.',
        imageUrl: '/images/books/attack_on_titan.png',
        isFeatured: true
      },
      {
        bookId: 'MG008',
        name: 'Học Viện Anh Hùng (My Hero Academia)',
        genre: [mangaGenre._id],
        author: [authorsMap['Kohei Horikoshi']],
        publisher: kimDong._id,
        price: 26000,
        description: 'Trong một thế giới nơi hầu hết mọi người đều có siêu năng lực, Izuku Midoriya nỗ lực trở thành anh hùng.',
        imageUrl: '/images/books/my_hero_academia.png',
        isFeatured: true
      },
      {
        bookId: 'MG009',
        name: 'Thợ Săn Quỷ (Chainsaw Man)',
        genre: [mangaGenre._id],
        author: [authorsMap['Tatsuki Fujimoto']],
        publisher: kimDong._id,
        price: 33000,
        description: 'Denji, một thanh niên nghèo khổ, hợp thể với con quỷ cưa của mình để trở thành Chainsaw Man.',
        imageUrl: '/images/books/chainsaw_man.png',
        isFeatured: true
      },
      {
        bookId: 'MG010',
        name: 'Doraemon - Chú Mèo Máy Đến Từ Tương Lai',
        genre: [mangaGenre._id],
        author: [authorsMap['Fujiko F. Fujio']],
        publisher: kimDong._id,
        price: 18000,
        description: 'Những câu chuyện thú vị và ý nghĩa về tình bạn giữa chú mèo máy Doraemon và cậu bé Nobita.',
        imageUrl: '/images/books/doraemon.png',
        isFeatured: true
      }
    ];

    for (const b of newManga) {
      const existing = await Book.findOne({ bookId: b.bookId });
      if (!existing) {
        await Book.create(b);
        console.log(`Added new manga: ${b.name}`);
      } else {
        await Book.findOneAndUpdate({ bookId: b.bookId }, b);
        console.log(`Updated manga: ${b.name}`);
      }
    }

    console.log('Database updated successfully with premium content!');
    await mongoose.disconnect();
  } catch (err) {
    console.error('Error updating database:', err);
  }
}

updateContent();
