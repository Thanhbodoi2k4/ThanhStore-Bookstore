const mongoose = require('mongoose');
const Book = require('./models/books.model');
const Genre = require('./models/genres.model');
const Author = require('./models/authors.model');
const Publisher = require('./models/publishers.model');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/bookstore';

const genresData = [
  { name: 'Văn học' },
  { name: 'Tâm lý - Kỹ năng sống' },
  { name: 'Công nghệ thông tin' },
  { name: 'Kinh tế' },
  { name: 'Sách giáo khoa' }
];

const authorsData = [
  { name: 'Vũ Trọng Phụng', year: 1912 },
  { name: 'Nguyễn Du', year: 1765 },
  { name: 'Dale Carnegie', year: 1888 },
  { name: 'Robert C. Martin', year: 1952 },
  { name: 'Nhiều tác giả', year: 2024 }
];

const publishersData = [
  { name: 'NXB Hội Nhà Văn' },
  { name: 'NXB Trẻ' },
  { name: 'NXB Tổng hợp TP.HCM' },
  { name: 'NXB Giáo Dục' }
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data (optional, but good for clean seed)
    // await Genre.deleteMany({});
    // await Book.deleteMany({});
    // await Author.deleteMany({});
    // await Publisher.deleteMany({});

    // Create Genres
    const genres = [];
    for (const g of genresData) {
      let genre = await Genre.findOne({ name: g.name });
      if (!genre) {
        genre = await Genre.create(g);
      }
      genres.push(genre);
    }
    console.log('Genres seeded');

    // Create Authors
    const authors = [];
    for (const a of authorsData) {
      let author = await Author.findOne({ name: a.name });
      if (!author) {
        author = await Author.create(a);
      }
      authors.push(author);
    }
    console.log('Authors seeded');

    // Create Publishers
    const publishers = [];
    for (const p of publishersData) {
      let publisher = await Publisher.findOne({ name: p.name });
      if (!publisher) {
        publisher = await Publisher.create(p);
      }
      publishers.push(publisher);
    }
    console.log('Publishers seeded');

    const booksData = [
      // Văn học
      {
        bookId: 'VH001',
        name: 'Số Đỏ',
        genre: [genres[0]._id],
        author: [authors[0]._id],
        publisher: publishers[0]._id,
        price: 85000,
        description: 'Tác phẩm văn học hiện thực xuất sắc của Vũ Trọng Phụng, châm biếm xã hội Việt Nam thời Pháp thuộc.',
        imageUrl: '/images/books/van_hoc.png'
      },
      {
        bookId: 'VH002',
        name: 'Truyện Kiều',
        genre: [genres[0]._id],
        author: [authors[1]._id],
        publisher: publishers[0]._id,
        price: 120000,
        description: 'Kiệt tác văn học của đại thi hào Nguyễn Du, biểu tượng của nền văn học Việt Nam.',
        imageUrl: '/images/books/van_hoc.png'
      },
      {
        bookId: 'VH003',
        name: 'Bỉ Vỏ',
        genre: [genres[0]._id],
        author: [authors[4]._id],
        publisher: publishers[0]._id,
        price: 75000,
        description: 'Tiểu thuyết hiện thực của Nguyên Hồng về thân phận những con người nghèo khổ dưới đáy xã hội.',
        imageUrl: '/images/books/van_hoc.png'
      },
      // Tâm lý - Kỹ năng sống
      {
        bookId: 'TL001',
        name: 'Đắc Nhân Tâm',
        genre: [genres[1]._id],
        author: [authors[2]._id],
        publisher: publishers[1]._id,
        price: 95000,
        description: 'Cuốn sách nghệ thuật ứng xử nổi tiếng nhất thế giới, giúp bạn kết nối và thành công.',
        imageUrl: '/images/books/tam_ly.png'
      },
      {
        bookId: 'TL002',
        name: 'Quẳng Gánh Lo Đi Và Vui Sống',
        genre: [genres[1]._id],
        author: [authors[2]._id],
        publisher: publishers[1]._id,
        price: 88000,
        description: 'Hướng dẫn cách vượt qua lo lắng để tận hưởng cuộc sống trọn vẹn hơn mỗi ngày.',
        imageUrl: '/images/books/tam_ly.png'
      },
      {
        bookId: 'TL003',
        name: 'Nhà Giả Kim',
        genre: [genres[1]._id],
        author: [authors[4]._id],
        publisher: publishers[1]._id,
        price: 79000,
        description: 'Câu chuyện hành trình đi tìm giấc mơ, thức tỉnh tâm hồn và sứ mệnh cuộc đời.',
        imageUrl: '/images/books/tam_ly.png'
      },
      // Công nghệ thông tin
      {
        bookId: 'IT001',
        name: 'Lập trình Javascript cơ bản',
        genre: [genres[2]._id],
        author: [authors[4]._id],
        publisher: publishers[2]._id,
        price: 150000,
        description: 'Hướng dẫn lập trình Javascript chi tiết cho người mới bắt đầu, từ cơ bản đến nâng cao.',
        imageUrl: '/images/books/it.png'
      },
      {
        bookId: 'IT002',
        name: 'Clean Code',
        genre: [genres[2]._id],
        author: [authors[3]._id],
        publisher: publishers[2]._id,
        price: 250000,
        description: 'Cuốn cẩm nang về kỹ năng viết mã sạch, dễ hiểu và dễ bảo trì cho các lập trình viên chuyên nghiệp.',
        imageUrl: '/images/books/it.png'
      },
      {
        bookId: 'IT003',
        name: 'Hành trình trở thành Developer',
        genre: [genres[2]._id],
        author: [authors[4]._id],
        publisher: publishers[2]._id,
        price: 120000,
        description: 'Chia sẻ kinh nghiệm thực tế về lộ trình phát triển sự nghiệp trong ngành công nghệ.',
        imageUrl: '/images/books/it.png'
      },
      // Kinh tế
      {
        bookId: 'KT001',
        name: 'Kinh tế học cơ bản',
        genre: [genres[3]._id],
        author: [authors[4]._id],
        publisher: publishers[2]._id,
        price: 180000,
        description: 'Nền tảng kiến thức quan trọng về kinh tế vi mô và vĩ mô dành cho mọi người.',
        imageUrl: '/images/books/kinh_te.png'
      },
      {
        bookId: 'KT002',
        name: 'Chiến lược kinh doanh',
        genre: [genres[3]._id],
        author: [authors[4]._id],
        publisher: publishers[2]._id,
        price: 210000,
        description: 'Những chiến lược và mô hình kinh doanh giúp doanh nghiệp phát triển bền vững.',
        imageUrl: '/images/books/kinh_te.png'
      },
      {
        bookId: 'KT003',
        name: 'Người giàu nhất thành Babylon',
        genre: [genres[3]._id],
        author: [authors[4]._id],
        publisher: publishers[1]._id,
        price: 68000,
        description: 'Những bí quyết làm giàu và quản lý tài chính cá nhân hiệu quả từ thời cổ đại.',
        imageUrl: '/images/books/kinh_te.png'
      },
      // Sách giáo khoa
      {
        bookId: 'SGK001',
        name: 'Toán lớp 1',
        genre: [genres[4]._id],
        author: [authors[4]._id],
        publisher: publishers[3]._id,
        price: 25000,
        description: 'Sách giáo khoa Toán lớp 1 theo chương trình đổi mới của Bộ Giáo dục và Đào tạo.',
        imageUrl: '/images/books/giao_khoa.png'
      },
      {
        bookId: 'SGK002',
        name: 'Tiếng Việt lớp 1',
        genre: [genres[4]._id],
        author: [authors[4]._id],
        publisher: publishers[3]._id,
        price: 28000,
        description: 'Sách giáo khoa Tiếng Việt giúp trẻ làm quen với bảng chữ cái và kỹ năng đọc cơ bản.',
        imageUrl: '/images/books/giao_khoa.png'
      },
      {
        bookId: 'SGK003',
        name: 'Tự nhiên và Xã hội lớp 1',
        genre: [genres[4]._id],
        author: [authors[4]._id],
        publisher: publishers[3]._id,
        price: 22000,
        description: 'Khám phá thế giới xung quanh qua những bài học sinh động và thực tế.',
        imageUrl: '/images/books/giao_khoa.png'
      }
    ];

    for (const b of booksData) {
      const existing = await Book.findOne({ bookId: b.bookId });
      if (!existing) {
        await Book.create(b);
      }
    }
    console.log('Books seeded successfully');

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (err) {
    console.error('Error seeding data:', err);
  }
}

seed();
