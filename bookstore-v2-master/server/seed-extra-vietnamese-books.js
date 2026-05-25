const mongoose = require('mongoose');
const Book = require('./models/books.model');
const Genre = require('./models/genres.model');
const Author = require('./models/authors.model');
const Publisher = require('./models/publishers.model');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/bookstore';

const genreNames = {
  literature: 'Văn học',
  skills: 'Tâm lý - Kỹ năng sống',
  technology: 'Công nghệ thông tin',
  business: 'Kinh tế',
  children: 'Sách thiếu nhi'
};

const authorNames = [
  { name: 'Nguyễn Nhật Ánh', year: 1955 },
  { name: 'Phạm Lữ Ân', year: 1970 },
  { name: 'Nguyễn Hiến Lê', year: 1912 },
  { name: 'Nhiều tác giả', year: 2026 },
  { name: 'ThanhStore Biên soạn', year: 2026 }
];

const publisherNames = [
  { name: 'NXB Trẻ' },
  { name: 'NXB Kim Đồng' },
  { name: 'NXB Tổng hợp TP.HCM' },
  { name: 'NXB ThanhStore' }
];

async function ensureByName(Model, items) {
  const result = [];
  for (const item of items) {
    const doc = await Model.findOneAndUpdate(
      { name: item.name },
      { $setOnInsert: item },
      { new: true, upsert: true }
    );
    result.push(doc);
  }
  return result;
}

async function seedExtraBooks() {
  try {
    await mongoose.connect(MONGO_URI);

    const genres = await ensureByName(
      Genre,
      Object.values(genreNames).map((name) => ({ name }))
    );
    const authors = await ensureByName(Author, authorNames);
    const publishers = await ensureByName(Publisher, publisherNames);

    const genreMap = Object.fromEntries(genres.map((genre) => [genre.name, genre._id]));
    const authorMap = Object.fromEntries(authors.map((author) => [author.name, author._id]));
    const publisherMap = Object.fromEntries(publishers.map((publisher) => [publisher.name, publisher._id]));

    const books = [
      {
        bookId: 'VN031',
        name: 'Mùa Hạ Trong Khu Vườn Cũ',
        genre: [genreMap[genreNames.literature]],
        author: [authorMap['Nguyễn Nhật Ánh']],
        publisher: publisherMap['NXB Trẻ'],
        price: 96000,
        pages: 228,
        year: 2026,
        size: '14 x 20.5 cm',
        description: 'Một câu chuyện trong trẻo về tình bạn, những ngày hè nhiều nắng và ký ức tuổi thơ luôn còn lại trong tim.',
        imageUrl: '/images/books/cover_mua_ha_vuon_cu.svg'
      },
      {
        bookId: 'VN032',
        name: 'Những Lá Thư Gửi Tương Lai',
        genre: [genreMap[genreNames.skills]],
        author: [authorMap['Phạm Lữ Ân']],
        publisher: publisherMap['NXB Tổng hợp TP.HCM'],
        price: 118000,
        pages: 256,
        year: 2026,
        size: '14.5 x 20.5 cm',
        description: 'Những bài viết nhẹ nhàng giúp người trẻ lắng nghe bản thân, chọn điều quan trọng và đi qua áp lực trưởng thành.',
        imageUrl: '/images/books/cover_la_thu_tuong_lai.svg'
      },
      {
        bookId: 'VN033',
        name: 'Tư Duy Sâu Trong Thời Đại Nhanh',
        genre: [genreMap[genreNames.skills]],
        author: [authorMap['Nguyễn Hiến Lê']],
        publisher: publisherMap['NXB Tổng hợp TP.HCM'],
        price: 132000,
        pages: 304,
        year: 2026,
        size: '15 x 21 cm',
        description: 'Cuốn sách về rèn luyện sự tập trung, đọc sâu, ghi chép và xây dựng thói quen học tập bền vững mỗi ngày.',
        imageUrl: '/images/books/cover_tu_duy_sau.svg'
      },
      {
        bookId: 'VN034',
        name: 'Lập Trình Web Từ Con Số 0',
        genre: [genreMap[genreNames.technology]],
        author: [authorMap['ThanhStore Biên soạn']],
        publisher: publisherMap['NXB ThanhStore'],
        price: 185000,
        pages: 420,
        year: 2026,
        size: '16 x 24 cm',
        description: 'Lộ trình học HTML, CSS, JavaScript và React qua ví dụ thực tế, phù hợp cho người mới bắt đầu.',
        imageUrl: '/images/books/cover_lap_trinh_web.svg'
      },
      {
        bookId: 'VN035',
        name: 'Dữ Liệu Kể Chuyện',
        genre: [genreMap[genreNames.technology]],
        author: [authorMap['Nhiều tác giả']],
        publisher: publisherMap['NXB ThanhStore'],
        price: 168000,
        pages: 336,
        year: 2026,
        size: '16 x 23 cm',
        description: 'Hướng dẫn biến dữ liệu khô khan thành biểu đồ, dashboard và câu chuyện kinh doanh dễ hiểu.',
        imageUrl: '/images/books/cover_du_lieu_ke_chuyen.svg'
      },
      {
        bookId: 'VN036',
        name: 'Quán Nhỏ Ven Sông',
        genre: [genreMap[genreNames.literature]],
        author: [authorMap['Nhiều tác giả']],
        publisher: publisherMap['NXB Trẻ'],
        price: 89000,
        pages: 214,
        year: 2026,
        size: '13 x 20 cm',
        description: 'Tập truyện ngắn ấm áp về làng quê, gia đình và những cuộc gặp bình dị bên một dòng sông yên ả.',
        imageUrl: '/images/books/cover_quan_nho_ven_song.svg'
      },
      {
        bookId: 'VN037',
        name: 'Em Bé Và Bầu Trời Sao',
        genre: [genreMap[genreNames.children]],
        author: [authorMap['ThanhStore Biên soạn']],
        publisher: publisherMap['NXB Kim Đồng'],
        price: 72000,
        pages: 96,
        year: 2026,
        size: '18 x 24 cm',
        description: 'Sách thiếu nhi minh họa rực rỡ, đưa các em khám phá bầu trời, hành tinh và những câu hỏi khoa học đầu đời.',
        imageUrl: '/images/books/cover_be_va_sao.svg'
      },
      {
        bookId: 'VN038',
        name: 'Bản Đồ Tài Chính Cá Nhân',
        genre: [genreMap[genreNames.business]],
        author: [authorMap['Nhiều tác giả']],
        publisher: publisherMap['NXB Tổng hợp TP.HCM'],
        price: 149000,
        pages: 288,
        year: 2026,
        size: '15 x 21 cm',
        description: 'Cẩm nang lập ngân sách, tiết kiệm, đầu tư cơ bản và quản lý rủi ro tài chính cho gia đình trẻ.',
        imageUrl: '/images/books/cover_ban_do_tai_chinh.svg'
      },
      {
        bookId: 'VN039',
        name: 'Marketing Cho Cửa Hàng Nhỏ',
        genre: [genreMap[genreNames.business]],
        author: [authorMap['ThanhStore Biên soạn']],
        publisher: publisherMap['NXB ThanhStore'],
        price: 159000,
        pages: 310,
        year: 2026,
        size: '15.5 x 22 cm',
        description: 'Những chiến lược bán hàng, nội dung, chăm sóc khách và quảng cáo phù hợp cho cửa hàng nhỏ tại Việt Nam.',
        imageUrl: '/images/books/cover_marketing_cua_hang.svg'
      },
      {
        bookId: 'VN040',
        name: 'Sổ Tay Sống Xanh Mỗi Ngày',
        genre: [genreMap[genreNames.skills]],
        author: [authorMap['Nhiều tác giả']],
        publisher: publisherMap['NXB ThanhStore'],
        price: 99000,
        pages: 180,
        year: 2026,
        size: '14 x 20 cm',
        description: 'Gợi ý thực tế để giảm rác thải, mua sắm thông minh, chăm sóc nhà cửa và sống xanh hơn từng chút một.',
        imageUrl: '/images/books/cover_song_xanh.svg'
      }
    ];

    for (const book of books) {
      const existingBook = await Book.findOne({ bookId: book.bookId });
      if (existingBook) {
        Object.assign(existingBook, book);
        if (!existingBook.slug) {
          existingBook.slug = undefined;
        }
        await existingBook.save();
      } else {
        await new Book(book).save();
      }
    }

    console.log('Seeded 10 Vietnamese books with local covers.');
  } catch (error) {
    console.error('Error seeding extra Vietnamese books:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seedExtraBooks();
