const mongoose = require('mongoose');
const Book = require('./models/books.model');
const Author = require('./models/authors.model');
const Genre = require('./models/genres.model');
const Publisher = require('./models/publishers.model');

require('dotenv').config();

const MONGODB_CONNECT_URI = 'mongodb://localhost:27017/bookstore';

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_CONNECT_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Clear existing data
    await Book.deleteMany({});
    await Author.deleteMany({});
    await Genre.deleteMany({});
    await Publisher.deleteMany({});
    console.log('Cleared existing data');

    // Create Authors
    const author1 = await Author.create({ name: 'J.K. Rowling', year: 1965 });
    const author2 = await Author.create({ name: 'George R.R. Martin', year: 1948 });
    const author3 = await Author.create({ name: 'J.R.R. Tolkien', year: 1892 });
    const author4 = await Author.create({ name: 'Paulo Coelho', year: 1947 });
    const author5 = await Author.create({ name: 'Robert Kiyosaki', year: 1947 });

    // Create Genres
    const genre1 = await Genre.create({ name: 'Kỳ ảo' });
    const genre2 = await Genre.create({ name: 'Tiểu thuyết' });
    const genre3 = await Genre.create({ name: 'Kỹ năng sống' });
    const genre4 = await Genre.create({ name: 'Kinh tế & Tài chính' });

    // Create Publishers
    const pub1 = await Publisher.create({ name: 'Nhà xuất bản Trẻ' });
    const pub2 = await Publisher.create({ name: 'Nhà xuất bản Kim Đồng' });
    const pub3 = await Publisher.create({ name: 'Nhà xuất bản Tổng hợp' });
    const pub4 = await Publisher.create({ name: 'Nhà xuất bản Văn Học' });

    // Create 10 Books
    const books = [
      {
        bookId: 'B001',
        name: 'Harry Potter và Hòn đá Phù thủy',
        year: 1997,
        genre: [genre1._id],
        author: [author1._id],
        publisher: pub1._id,
        description: 'Một cậu bé phát hiện ra mình là phù thủy và được theo học tại một ngôi trường phép thuật.',
        pages: 309,
        size: '15 x 23 cm',
        price: 250000,
        discount: 10,
        imageUrl: 'https://covers.openlibrary.org/b/isbn/9780590353427-L.jpg'
      },
      {
        bookId: 'B002',
        name: 'Trò Chơi Vương Quyền',
        year: 1996,
        genre: [genre1._id, genre2._id],
        author: [author2._id],
        publisher: pub2._id,
        description: 'Chín gia tộc quý tộc tranh giành quyền kiểm soát vùng đất Westeros.',
        pages: 694,
        size: '15 x 23 cm',
        price: 350000,
        discount: 15,
        imageUrl: 'https://covers.openlibrary.org/b/isbn/9780553103540-L.jpg'
      },
      {
        bookId: 'B003',
        name: 'Anh Chàng Hobbit',
        year: 1937,
        genre: [genre1._id],
        author: [author3._id],
        publisher: pub4._id,
        description: 'Một anh chàng hobbit dấn thân vào một cuộc phiêu lưu để giành lấy một phần kho báu của loài rồng.',
        pages: 310,
        size: '14 x 21 cm',
        price: 200000,
        discount: 5,
        imageUrl: 'https://covers.openlibrary.org/b/isbn/9780547928227-L.jpg'
      },
      {
        bookId: 'B004',
        name: 'Nhà Giả Kim',
        year: 1988,
        genre: [genre2._id, genre3._id],
        author: [author4._id],
        publisher: pub4._id,
        description: 'Cuộc hành trình của một cậu bé chăn cừu đi tìm kiếm kho báu thế gian.',
        pages: 208,
        size: '13 x 20 cm',
        price: 150000,
        discount: 0,
        imageUrl: 'https://covers.openlibrary.org/b/isbn/9780061122415-L.jpg'
      },
      {
        bookId: 'B005',
        name: 'Cha Giàu Cha Nghèo',
        year: 1997,
        genre: [genre3._id, genre4._id],
        author: [author5._id],
        publisher: pub1._id,
        description: 'Người giàu dạy con cái họ điều gì về tiền bạc mà người nghèo và giới trung lưu không làm!',
        pages: 336,
        size: '15 x 23 cm',
        price: 180000,
        discount: 20,
        imageUrl: 'https://covers.openlibrary.org/b/isbn/9781612680194-L.jpg'
      },
      {
        bookId: 'B006',
        name: 'Harry Potter và Phòng chứa Bí mật',
        year: 1998,
        genre: [genre1._id],
        author: [author1._id],
        publisher: pub1._id,
        description: 'Harry trở lại Hogwarts vào năm thứ hai, nhưng một căn phòng bí ẩn đã bị mở ra.',
        pages: 341,
        size: '15 x 23 cm',
        price: 260000,
        discount: 10,
        imageUrl: 'https://covers.openlibrary.org/b/isbn/9780439064873-L.jpg'
      },
      {
        bookId: 'B007',
        name: 'Trận Chiến Của Những Vị Vua',
        year: 1998,
        genre: [genre1._id, genre2._id],
        author: [author2._id],
        publisher: pub2._id,
        description: 'Bảy Vương quốc bị xé rách bởi cuộc nội chiến.',
        pages: 768,
        size: '15 x 23 cm',
        price: 360000,
        discount: 15,
        imageUrl: 'https://covers.openlibrary.org/b/isbn/9780553108033-L.jpg'
      },
      {
        bookId: 'B008',
        name: 'Chúa Tể Những Chiếc Nhẫn: Hiệp Hội Bảo Vệ Nhẫn',
        year: 1954,
        genre: [genre1._id],
        author: [author3._id],
        publisher: pub4._id,
        description: 'Một chàng hobbit trẻ tuổi được giao phó Chiếc Nhẫn Quyền Lực và phải đi phá hủy nó.',
        pages: 423,
        size: '14 x 21 cm',
        price: 220000,
        discount: 5,
        imageUrl: 'https://covers.openlibrary.org/b/isbn/9780547928210-L.jpg'
      },
      {
        bookId: 'B009',
        name: 'Harry Potter và Tên tù nhân ngục Azkaban',
        year: 1999,
        genre: [genre1._id],
        author: [author1._id],
        publisher: pub1._id,
        description: 'Harry biết được một kẻ phạm tội nguy hiểm đã trốn thoát khỏi Azkaban và đang tìm kiếm cậu.',
        pages: 435,
        size: '15 x 23 cm',
        price: 270000,
        discount: 10,
        imageUrl: 'https://covers.openlibrary.org/b/isbn/9780439136365-L.jpg'
      },
      {
        bookId: 'B010',
        name: 'Kim Tứ Đồ',
        year: 1998,
        genre: [genre3._id, genre4._id],
        author: [author5._id],
        publisher: pub1._id,
        description: 'Tiết lộ lý do tại sao một số người làm việc ít hơn, kiếm được nhiều tiền hơn, trả ít thuế hơn và học cách đạt được tự do tài chính.',
        pages: 352,
        size: '15 x 23 cm',
        price: 190000,
        discount: 20,
        imageUrl: 'https://covers.openlibrary.org/b/isbn/9781612680057-L.jpg'
      }
    ];

    for (const book of books) {
      await Book.create(book);
    }
    console.log('Successfully seeded 10 books in Vietnamese');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
