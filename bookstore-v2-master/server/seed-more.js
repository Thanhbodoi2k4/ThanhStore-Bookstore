const mongoose = require('mongoose');
const Book = require('./models/books.model');
const Author = require('./models/authors.model');
const Genre = require('./models/genres.model');
const Publisher = require('./models/publishers.model');

require('dotenv').config();

const MONGODB_CONNECT_URI = 'mongodb://localhost:27017/bookstore';

const seedMoreBooks = async () => {
  try {
    await mongoose.connect(MONGODB_CONNECT_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Create additional Authors
    const authorNguyenNhatAnh = await Author.create({ name: 'Nguyễn Nhật Ánh', year: 1955 });
    const authorToDoi = await Author.create({ name: 'Tô Hoài', year: 1920 });
    const authorNamCao = await Author.create({ name: 'Nam Cao', year: 1915 });
    const authorDaleCarnegie = await Author.create({ name: 'Dale Carnegie', year: 1888 });
    const authorNapoleonHill = await Author.create({ name: 'Napoleon Hill', year: 1883 });
    const authorHaruki = await Author.create({ name: 'Haruki Murakami', year: 1949 });
    const authorSaintExupery = await Author.create({ name: 'Antoine de Saint-Exupéry', year: 1900 });
    const authorVictor = await Author.create({ name: 'Victor Hugo', year: 1802 });
    const authorThuanVu = await Author.create({ name: 'Thuận Vũ', year: 1980 });
    const authorStephenHawking = await Author.create({ name: 'Stephen Hawking', year: 1942 });
    const authorRobinSharma = await Author.create({ name: 'Robin Sharma', year: 1964 });
    const authorMarkManson = await Author.create({ name: 'Mark Manson', year: 1984 });
    const authorDanBrown = await Author.create({ name: 'Dan Brown', year: 1964 });
    const authorAgatha = await Author.create({ name: 'Agatha Christie', year: 1890 });
    const authorYuvalHarari = await Author.create({ name: 'Yuval Noah Harari', year: 1976 });

    // Create additional Genres
    const genreVanHocVN = await Genre.create({ name: 'Văn học Việt Nam' });
    const genreTamLy = await Genre.create({ name: 'Tâm lý - Tư duy' });
    const genreKhoaHoc = await Genre.create({ name: 'Khoa học' });
    const genreTrinh = await Genre.create({ name: 'Trinh thám' });
    const genreLichSu = await Genre.create({ name: 'Lịch sử' });
    const genreThieuNhi = await Genre.create({ name: 'Thiếu nhi' });
    const genreVanHocNN = await Genre.create({ name: 'Văn học nước ngoài' });

    // Get existing genres
    const genreKyAo = await Genre.findOne({ name: 'Kỳ ảo' });
    const genreTieuThuyet = await Genre.findOne({ name: 'Tiểu thuyết' });
    const genreKyNang = await Genre.findOne({ name: 'Kỹ năng sống' });

    // Create additional Publishers
    const pubNXBTre = await Publisher.findOne({ name: 'Nhà xuất bản Trẻ' });
    const pubNXBKimDong = await Publisher.findOne({ name: 'Nhà xuất bản Kim Đồng' });
    const pubNXBVanHoc = await Publisher.findOne({ name: 'Nhà xuất bản Văn Học' });
    const pubNXBTongHop = await Publisher.findOne({ name: 'Nhà xuất bản Tổng hợp' });
    const pubNXBHoiNhaVan = await Publisher.create({ name: 'Nhà xuất bản Hội Nhà Văn' });
    const pubNXBDanTri = await Publisher.create({ name: 'Nhà xuất bản Dân Trí' });
    const pubNXBTheGioi = await Publisher.create({ name: 'Nhà xuất bản Thế Giới' });
    const pubNXBGiaoDuc = await Publisher.create({ name: 'Nhà xuất bản Giáo Dục' });
    const pubNXBLaoDong = await Publisher.create({ name: 'Nhà xuất bản Lao Động' });

    // 20 New Books with Vietnamese covers
    const books = [
      {
        bookId: 'B011',
        name: 'Tôi Thấy Hoa Vàng Trên Cỏ Xanh',
        year: 2010,
        genre: [genreVanHocVN._id],
        author: [authorNguyenNhatAnh._id],
        publisher: pubNXBTre._id,
        description: 'Cuốn truyện kể về tuổi thơ hồn nhiên, trong trẻo nơi miền quê Việt Nam với tình bạn, tình anh em và những kỷ niệm khó quên. Một tác phẩm đậm chất thơ của Nguyễn Nhật Ánh.',
        pages: 378,
        size: '13 x 20 cm',
        price: 125000,
        discount: 15,
        imageUrl: 'https://salt.tikicdn.com/cache/280x280/ts/product/3d/53/68/56cc5c32b5e55f479f4b64df0cee1c38.jpg'
      },
      {
        bookId: 'B012',
        name: 'Dế Mèn Phiêu Lưu Ký',
        year: 1941,
        genre: [genreThieuNhi._id, genreVanHocVN._id],
        author: [authorToDoi._id],
        publisher: pubNXBKimDong._id,
        description: 'Cuộc phiêu lưu đầy thú vị của chú Dế Mèn qua thế giới loài vật. Tác phẩm kinh điển của văn học thiếu nhi Việt Nam, đã được dịch ra nhiều thứ tiếng.',
        pages: 180,
        size: '14 x 20 cm',
        price: 75000,
        discount: 10,
        imageUrl: 'https://salt.tikicdn.com/cache/280x280/ts/product/44/c6/45/24d5a06045de83e2cee078c823e9f72a.jpg'
      },
      {
        bookId: 'B013',
        name: 'Đắc Nhân Tâm',
        year: 1936,
        genre: [genreTamLy._id, genreKyNang._id],
        author: [authorDaleCarnegie._id],
        publisher: pubNXBTre._id,
        description: 'Cuốn sách nổi tiếng nhất thế giới về nghệ thuật giao tiếp và ứng xử. Đã bán hơn 30 triệu bản toàn cầu và được dịch sang hàng chục ngôn ngữ.',
        pages: 320,
        size: '14 x 20 cm',
        price: 108000,
        discount: 20,
        imageUrl: 'https://salt.tikicdn.com/cache/280x280/ts/product/df/7d/da/cc48567c0e088f2b28783922df5c42ad.jpg'
      },
      {
        bookId: 'B014',
        name: 'Nghĩ Giàu Làm Giàu',
        year: 1937,
        genre: [genreTamLy._id, genreKyNang._id],
        author: [authorNapoleonHill._id],
        publisher: pubNXBTongHop._id,
        description: 'Cuốn sách kinh điển về tư duy làm giàu, tổng kết từ nghiên cứu hơn 500 triệu phú và tỷ phú Mỹ. Bí quyết thành công mà ai cũng cần biết.',
        pages: 456,
        size: '14 x 20 cm',
        price: 135000,
        discount: 10,
        imageUrl: 'https://salt.tikicdn.com/cache/280x280/ts/product/34/ba/1a/8580b5aa4f5a285e04e5d33016b7d3a7.jpg'
      },
      {
        bookId: 'B015',
        name: 'Rừng Na-uy',
        year: 1987,
        genre: [genreVanHocNN._id, genreTieuThuyet._id],
        author: [authorHaruki._id],
        publisher: pubNXBHoiNhaVan._id,
        description: 'Tác phẩm nổi tiếng nhất của Haruki Murakami, kể về tình yêu, mất mát và sự trưởng thành. Một câu chuyện đẹp buồn đầy ám ảnh.',
        pages: 480,
        size: '13 x 20 cm',
        price: 145000,
        discount: 5,
        imageUrl: 'https://salt.tikicdn.com/cache/280x280/ts/product/db/f1/a3/1bab2f48f79e1368c69bfb9b44ea7ced.jpg'
      },
      {
        bookId: 'B016',
        name: 'Hoàng Tử Bé',
        year: 1943,
        genre: [genreThieuNhi._id, genreVanHocNN._id],
        author: [authorSaintExupery._id],
        publisher: pubNXBKimDong._id,
        description: 'Tác phẩm văn học kinh điển nhất mọi thời đại, câu chuyện về tình bạn giữa Hoàng Tử Bé với hoa hồng, con cáo và phi công. Triết lý sâu sắc về cuộc sống.',
        pages: 128,
        size: '14 x 20 cm',
        price: 85000,
        discount: 0,
        imageUrl: 'https://salt.tikicdn.com/cache/280x280/ts/product/2b/9b/41/7ea87bb079a6e689ec8a59cc66a1d3b8.jpg'
      },
      {
        bookId: 'B017',
        name: 'Những Người Khốn Khổ',
        year: 1862,
        genre: [genreVanHocNN._id, genreTieuThuyet._id],
        author: [authorVictor._id],
        publisher: pubNXBVanHoc._id,
        description: 'Kiệt tác văn học Pháp thế kỷ 19 về số phận con người trong xã hội bất công. Câu chuyện của Jean Valjean từ tù nhân thành người tốt.',
        pages: 1520,
        size: '15 x 23 cm',
        price: 289000,
        discount: 15,
        imageUrl: 'https://salt.tikicdn.com/cache/280x280/ts/product/f7/48/46/e2c941b32b533c2074b05e12a3a5e674.jpg'
      },
      {
        bookId: 'B018',
        name: 'Chí Phèo',
        year: 1941,
        genre: [genreVanHocVN._id],
        author: [authorNamCao._id],
        publisher: pubNXBVanHoc._id,
        description: 'Truyện ngắn kinh điển của văn học Việt Nam, kể về bi kịch của người nông dân bị xã hội đẩy vào bước đường cùng. Tác phẩm để đời của nhà văn Nam Cao.',
        pages: 96,
        size: '13 x 19 cm',
        price: 45000,
        discount: 0,
        imageUrl: 'https://salt.tikicdn.com/cache/280x280/ts/product/bb/88/5a/4fb55b00bb3b90e5086c596d65c1a826.jpg'
      },
      {
        bookId: 'B019',
        name: 'Lược Sử Thời Gian',
        year: 1988,
        genre: [genreKhoaHoc._id],
        author: [authorStephenHawking._id],
        publisher: pubNXBTre._id,
        description: 'Cuốn sách khoa học phổ thông nổi tiếng nhất thế giới, giải thích vũ trụ từ Big Bang đến lỗ đen một cách dễ hiểu. Hơn 10 triệu bản đã được bán ra.',
        pages: 256,
        size: '14 x 20 cm',
        price: 118000,
        discount: 10,
        imageUrl: 'https://salt.tikicdn.com/cache/280x280/ts/product/a2/b2/42/41de5ff1f3cb38d59fd6e7cdba tried.jpg'
      },
      {
        bookId: 'B020',
        name: 'Nhà Lãnh Đạo Không Chức Danh',
        year: 2010,
        genre: [genreTamLy._id, genreKyNang._id],
        author: [authorRobinSharma._id],
        publisher: pubNXBTre._id,
        description: 'Robin Sharma chia sẻ triết lý về lãnh đạo: bất kỳ ai cũng có thể trở thành nhà lãnh đạo xuất sắc trong công việc và cuộc sống.',
        pages: 304,
        size: '14 x 20 cm',
        price: 119000,
        discount: 12,
        imageUrl: 'https://salt.tikicdn.com/cache/280x280/ts/product/2f/1a/b0/c0c8a9b79e153a42b6e504e3c45bcbbf.jpg'
      },
      {
        bookId: 'B021',
        name: 'Mắt Biếc',
        year: 1990,
        genre: [genreVanHocVN._id, genreTieuThuyet._id],
        author: [authorNguyenNhatAnh._id],
        publisher: pubNXBTre._id,
        description: 'Câu chuyện tình yêu đơn phương đẹp nhất của Nguyễn Nhật Ánh. Tình yêu thuần khiết từ thuở ấu thơ đến khi trưởng thành, một tác phẩm đã được chuyển thể thành phim.',
        pages: 250,
        size: '13 x 20 cm',
        price: 110000,
        discount: 15,
        imageUrl: 'https://salt.tikicdn.com/cache/280x280/ts/product/f8/59/3f/2b0fd25043d48595c5fa86f724cd0a00.jpg'
      },
      {
        bookId: 'B022',
        name: 'Nghệ Thuật Tinh Tế Của Việc Đếch Quan Tâm',
        year: 2016,
        genre: [genreTamLy._id, genreKyNang._id],
        author: [authorMarkManson._id],
        publisher: pubNXBTre._id,
        description: 'Cuốn sách phát triển bản thân thực tế, thẳng thắn, giúp bạn biết cách lựa chọn những gì thực sự quan trọng trong cuộc sống và bỏ qua phần còn lại.',
        pages: 245,
        size: '14 x 20 cm',
        price: 99000,
        discount: 20,
        imageUrl: 'https://salt.tikicdn.com/cache/280x280/ts/product/e4/67/39/cb8e3d93bd1b5b40f0f3ee78e48e1ee2.jpg'
      },
      {
        bookId: 'B023',
        name: 'Mật Mã Da Vinci',
        year: 2003,
        genre: [genreTrinh._id, genreTieuThuyet._id],
        author: [authorDanBrown._id],
        publisher: pubNXBVanHoc._id,
        description: 'Tiểu thuyết trinh thám bán chạy nhất thế giới, kết hợp giải mã bí ẩn tôn giáo, lịch sử và nghệ thuật. Đã bán hơn 80 triệu bản.',
        pages: 592,
        size: '14 x 20 cm',
        price: 175000,
        discount: 10,
        imageUrl: 'https://salt.tikicdn.com/cache/280x280/ts/product/d3/07/a3/b39e3b1e3498c39e8b1c56a9de78e0a5.jpg'
      },
      {
        bookId: 'B024',
        name: 'Và Rồi Chẳng Còn Ai',
        year: 1939,
        genre: [genreTrinh._id, genreVanHocNN._id],
        author: [authorAgatha._id],
        publisher: pubNXBTre._id,
        description: 'Cuốn tiểu thuyết trinh thám bán chạy nhất mọi thời đại. Mười người xa lạ bị mời đến một hòn đảo hẻo lánh, rồi lần lượt bị giết theo bài thơ đồng dao.',
        pages: 272,
        size: '13 x 20 cm',
        price: 98000,
        discount: 5,
        imageUrl: 'https://salt.tikicdn.com/cache/280x280/ts/product/b0/bb/d8/43e3516ca69ef6aee4a4e4a5c6b7b2cf.jpg'
      },
      {
        bookId: 'B025',
        name: 'Sapiens: Lược Sử Loài Người',
        year: 2011,
        genre: [genreLichSu._id, genreKhoaHoc._id],
        author: [authorYuvalHarari._id],
        publisher: pubNXBTheGioi._id,
        description: 'Cuốn sách đình đám nhất thế kỷ 21 về lịch sử nhân loại, từ thời kỳ đồ đá đến kỷ nguyên số. Bill Gates và Mark Zuckerberg đều khuyến nghị đọc.',
        pages: 553,
        size: '15 x 23 cm',
        price: 299000,
        discount: 12,
        imageUrl: 'https://salt.tikicdn.com/cache/280x280/ts/product/9b/43/a7/3e0c66cbb265e68d0b0df02ddb tried.jpg'
      },
      {
        bookId: 'B026',
        name: 'Cho Tôi Xin Một Vé Đi Tuổi Thơ',
        year: 2008,
        genre: [genreVanHocVN._id, genreThieuNhi._id],
        author: [authorNguyenNhatAnh._id],
        publisher: pubNXBTre._id,
        description: 'Tác phẩm bán chạy nhất của Nguyễn Nhật Ánh, kể lại tuổi thơ trong veo với những trò chơi, mơ mộng và kỷ niệm ngọt ngào. Đã bán hơn 400.000 bản.',
        pages: 216,
        size: '13 x 20 cm',
        price: 89000,
        discount: 10,
        imageUrl: 'https://salt.tikicdn.com/cache/280x280/ts/product/48/3e/73/1e8c3ca2e6648965bf961e1a89a6de3c.jpg'
      },
      {
        bookId: 'B027',
        name: 'Tuổi Trẻ Đáng Giá Bao Nhiêu',
        year: 2016,
        genre: [genreTamLy._id, genreKyNang._id],
        author: [authorThuanVu._id],
        publisher: pubNXBHoiNhaVan._id,
        description: 'Cuốn sách dành cho giới trẻ Việt Nam, chia sẻ về hành trình trưởng thành, lựa chọn nghề nghiệp và sống có mục đích. Bestseller nhiều năm liền tại Việt Nam.',
        pages: 286,
        size: '13 x 20 cm',
        price: 78000,
        discount: 15,
        imageUrl: 'https://salt.tikicdn.com/cache/280x280/ts/product/72/5c/29/d07a97b2412e289a7e7e2ba9bda2b9fa.jpg'
      },
      {
        bookId: 'B028',
        name: 'Kafka Bên Bờ Biển',
        year: 2002,
        genre: [genreVanHocNN._id, genreTieuThuyet._id],
        author: [authorHaruki._id],
        publisher: pubNXBHoiNhaVan._id,
        description: 'Tiểu thuyết siêu thực của Murakami, câu chuyện song song về cậu bé 15 tuổi bỏ nhà đi và ông già biết nói chuyện với mèo. Kỳ ảo và triết lý sâu sắc.',
        pages: 620,
        size: '14 x 20 cm',
        price: 165000,
        discount: 8,
        imageUrl: 'https://salt.tikicdn.com/cache/280x280/ts/product/38/5d/8e/89f8fbe7cfb8acb0fb29d78d2389b1af.jpg'
      },
      {
        bookId: 'B029',
        name: 'Sống Mòn',
        year: 1944,
        genre: [genreVanHocVN._id, genreTieuThuyet._id],
        author: [authorNamCao._id],
        publisher: pubNXBVanHoc._id,
        description: 'Tiểu thuyết hiện thực xuất sắc nhất của Nam Cao, kể về cuộc sống bế tắc của người trí thức tiểu tư sản trước Cách mạng tháng Tám.',
        pages: 320,
        size: '13 x 20 cm',
        price: 89000,
        discount: 0,
        imageUrl: 'https://salt.tikicdn.com/cache/280x280/ts/product/6c/72/69/3e8dfd33e96782e16f8b0d0cf3835fe0.jpg'
      },
      {
        bookId: 'B030',
        name: 'Đời Ngắn Đừng Ngủ Dài',
        year: 2010,
        genre: [genreTamLy._id, genreKyNang._id],
        author: [authorRobinSharma._id],
        publisher: pubNXBTre._id,
        description: 'Bài học cuộc sống thiết thực từ Robin Sharma, giúp bạn tận dụng từng phút giây, sống có ý nghĩa và đạt được những điều phi thường trong cuộc đời.',
        pages: 256,
        size: '13 x 20 cm',
        price: 95000,
        discount: 18,
        imageUrl: 'https://salt.tikicdn.com/cache/280x280/ts/product/a2/10/90/2a1c30af59dbba9bfe24e5a3b1c2f1be.jpg'
      }
    ];

    for (const book of books) {
      await Book.create(book);
    }
    console.log('Successfully added 20 more Vietnamese books!');
    console.log('Total books should now be 30.');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedMoreBooks();
