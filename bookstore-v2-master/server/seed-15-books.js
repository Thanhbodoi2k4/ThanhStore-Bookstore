const mongoose = require('mongoose');
const Book = require('./models/books.model');
const Author = require('./models/authors.model');
const Genre = require('./models/genres.model');
const Publisher = require('./models/publishers.model');

require('dotenv').config();

const MONGODB_CONNECT_URI = process.env.MONGODB_CONNECT_URI || 'mongodb://localhost:27017/bookstore';

const seed15BeautifulBooks = async () => {
  try {
    await mongoose.connect(MONGODB_CONNECT_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Create an Author
    let author = await Author.findOne({ name: 'Paulo Coelho' });
    if (!author) {
      author = await Author.create({ name: 'Paulo Coelho', year: 1947 });
    }

    // Create a Genre
    let genre = await Genre.findOne({ name: 'Nghệ Thuật - Triết Học' });
    if (!genre) {
      genre = await Genre.create({ name: 'Nghệ Thuật - Triết Học' });
    }

    // Create a Publisher
    let publisher = await Publisher.findOne({ name: 'Nhà xuất bản Nghệ Thuật' });
    if (!publisher) {
      publisher = await Publisher.create({ name: 'Nhà xuất bản Nghệ Thuật' });
    }

    const books = [
      {
        bookId: 'ART-001',
        name: 'Vũ Điệu Của Những Vì Sao',
        year: 2023,
        genre: [genre._id],
        author: [author._id],
        publisher: publisher._id,
        description: 'Nebula and constellations forming a dance. Một tác phẩm triết học trừu tượng về vũ trụ.',
        pages: 320,
        price: 150000,
        imageUrl: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=600&h=800&fit=crop'
      },
      {
        bookId: 'ART-002',
        name: 'Chữ Cái Chờ Đợi',
        year: 2022,
        genre: [genre._id],
        author: [author._id],
        publisher: publisher._id,
        description: 'Calligraphic letters intertwining. Sự gắn kết của ngôn ngữ qua thời gian.',
        pages: 280,
        price: 135000,
        imageUrl: 'https://images.unsplash.com/photo-1550592704-6c76defa9985?w=600&h=800&fit=crop'
      },
      {
        bookId: 'ART-003',
        name: 'Dòng Sông Ký Ức',
        year: 2021,
        genre: [genre._id],
        author: [author._id],
        publisher: publisher._id,
        description: 'Memory river in fine ink-wash style. Những ký ức trôi chảy theo dòng nước.',
        pages: 410,
        price: 180000,
        imageUrl: 'https://images.unsplash.com/photo-1437482078695-73f5ca6c96e2?w=600&h=800&fit=crop'
      },
      {
        bookId: 'ART-004',
        name: 'Hơi Thở Của Rừng',
        year: 2020,
        genre: [genre._id],
        author: [author._id],
        publisher: publisher._id,
        description: 'Detailed botanical patterns as forest spirits. Sự sống nảy mầm từ thiên nhiên.',
        pages: 350,
        price: 165000,
        imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&h=800&fit=crop'
      },
      {
        bookId: 'ART-005',
        name: 'Bản Giao Hưởng Của Bóng Đêm',
        year: 2023,
        genre: [genre._id],
        author: [author._id],
        publisher: publisher._id,
        description: 'Piano notes transforming into light creatures. Âm nhạc xua tan sự tĩnh lặng.',
        pages: 210,
        price: 120000,
        imageUrl: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=600&h=800&fit=crop'
      },
      {
        bookId: 'ART-006',
        name: 'Con Đường Tơ Lụa',
        year: 2019,
        genre: [genre._id],
        author: [author._id],
        publisher: publisher._id,
        description: 'Camels and old silks. Hành trình kết nối những nền văn minh.',
        pages: 500,
        price: 220000,
        imageUrl: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=600&h=800&fit=crop'
      },
      {
        bookId: 'ART-007',
        name: 'Giấc Mơ Của Người Thợ Gốm',
        year: 2021,
        genre: [genre._id],
        author: [author._id],
        publisher: publisher._id,
        description: 'Intricate pottery pattern becoming a story. Nghệ thuật nhào nặn từ đất sét.',
        pages: 260,
        price: 140000,
        imageUrl: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=600&h=800&fit=crop'
      },
      {
        bookId: 'ART-008',
        name: 'Vòng Tròn Của Thời Gian',
        year: 2022,
        genre: [genre._id],
        author: [author._id],
        publisher: publisher._id,
        description: 'Ancient gears as a philosophical time wheel. Sự luân hồi và vĩnh cửu.',
        pages: 380,
        price: 190000,
        imageUrl: 'https://images.unsplash.com/photo-1501139083538-0139583c060f?w=600&h=800&fit=crop'
      },
      {
        bookId: 'ART-009',
        name: 'Linh Hồn Của Những Hòn Đá',
        year: 2018,
        genre: [genre._id],
        author: [author._id],
        publisher: publisher._id,
        description: 'Stone sculptures with motifs. Sự sống trong những vật vô tri.',
        pages: 310,
        price: 155000,
        imageUrl: 'https://images.unsplash.com/photo-1525857597365-5f6af3660505?w=600&h=800&fit=crop'
      },
      {
        bookId: 'ART-010',
        name: 'Trái Tim Của Biển',
        year: 2020,
        genre: [genre._id],
        author: [author._id],
        publisher: publisher._id,
        description: 'Marine life with flowing abstract coral. Nhịp đập dưới lòng đại dương.',
        pages: 420,
        price: 210000,
        imageUrl: 'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?w=600&h=800&fit=crop'
      },
      {
        bookId: 'ART-011',
        name: 'Câu Chuyện Của Những Cánh Diều',
        year: 2021,
        genre: [genre._id],
        author: [author._id],
        publisher: publisher._id,
        description: 'Wind-blown kites with folk art. Ước mơ bay cao cùng những ngọn gió.',
        pages: 250,
        price: 130000,
        imageUrl: 'https://images.unsplash.com/photo-1534330207526-8e81f10ece37?w=600&h=800&fit=crop'
      },
      {
        bookId: 'ART-012',
        name: 'Bức Họa Của Gió',
        year: 2023,
        genre: [genre._id],
        author: [author._id],
        publisher: publisher._id,
        description: 'Painter\'s brushstrokes merging with wind. Những đường nét tự do và phóng khoáng.',
        pages: 340,
        price: 175000,
        imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&h=800&fit=crop'
      },
      {
        bookId: 'ART-013',
        name: 'Hành Trình Của Những Con Số',
        year: 2019,
        genre: [genre._id],
        author: [author._id],
        publisher: publisher._id,
        description: 'Geometric and number patterns as a puzzle. Sự chính xác của toán học.',
        pages: 460,
        price: 195000,
        imageUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&h=800&fit=crop'
      },
      {
        bookId: 'ART-014',
        name: 'Giọng Nói Của Phố Cổ',
        year: 2022,
        genre: [genre._id],
        author: [author._id],
        publisher: publisher._id,
        description: 'Ancient buildings and lanterns. Lịch sử thì thầm qua từng viên gạch.',
        pages: 390,
        price: 185000,
        imageUrl: 'https://images.unsplash.com/photo-1518623489648-a173ef7824f3?w=600&h=800&fit=crop'
      },
      {
        bookId: 'ART-015',
        name: 'Kho Báu Của Những Bức Thư',
        year: 2020,
        genre: [genre._id],
        author: [author._id],
        publisher: publisher._id,
        description: 'Letters transforming into historical events. Giá trị của những lời nhắn nhủ.',
        pages: 280,
        price: 145000,
        imageUrl: 'https://images.unsplash.com/photo-1575089332204-7cd1e0a2908f?w=600&h=800&fit=crop'
      }
    ];

    let count = 0;
    for (const book of books) {
      // Check if bookId already exists to avoid duplicate errors
      const existing = await Book.findOne({ bookId: book.bookId });
      if (!existing) {
        await Book.create(book);
        count++;
        console.log(`Đã thêm sách: ${book.name}`);
      } else {
        console.log(`Sách đã tồn tại: ${book.name}, đang bỏ qua...`);
      }
    }
    
    console.log(`\n🎉 Hoàn thành! Đã thêm thành công ${count} cuốn sách mới với hình ảnh chất lượng cao vào CSDL.`);

    process.exit(0);
  } catch (error) {
    console.error('Lỗi khi seed data:', error);
    process.exit(1);
  }
};

seed15BeautifulBooks();
