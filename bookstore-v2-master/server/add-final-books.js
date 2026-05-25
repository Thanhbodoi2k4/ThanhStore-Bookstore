const mongoose = require('mongoose');
const Book = require('./models/books.model');
const Genre = require('./models/genres.model');
const Author = require('./models/authors.model');
const Publisher = require('./models/publishers.model');
require('dotenv').config();

const MONGO_URI = process.env.MONGODB_CONNECT_URI || 'mongodb://localhost:27017/bookstore';

async function addFinalBooks() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    const mangaGenre = await Genre.findOne({ name: 'Truyện tranh (Manga)' });
    const kimDong = await Publisher.findOne({ name: 'NXB Kim Đồng' });

    const authorsData = [
      { name: 'Tsugumi Ohba' },
      { name: 'Yuki Tabata' }
    ];

    const authorsMap = {};
    for (const a of authorsData) {
      let author = await Author.findOne({ name: a.name });
      if (!author) {
        author = await Author.create(a);
      }
      authorsMap[a.name] = author._id;
    }

    const finalBooks = [
      {
        bookId: 'MG011',
        name: 'Quyển Sổ Thiên Mệnh (Death Note)',
        genre: [mangaGenre._id],
        author: [authorsMap['Tsugumi Ohba']],
        publisher: kimDong._id,
        price: 35000,
        description: 'Cuộc chiến cân não giữa thám tử lừng danh L và cậu sinh viên thiên tài Light Yagami - người sở hữu quyển sổ có thể tước đoạt mạng sống bất kỳ ai.',
        imageUrl: '/images/books/death_note.png',
        isFeatured: true
      },
      {
        bookId: 'MG012',
        name: 'Thế Giới Phép Thuật (Black Clover)',
        genre: [mangaGenre._id],
        author: [authorsMap['Yuki Tabata']],
        publisher: kimDong._id,
        price: 28000,
        description: 'Trong một thế giới mà mọi người đều có phép thuật, Asta - cậu bé duy nhất không có ma lực - nỗ lực trở thành Ma pháp vương.',
        imageUrl: 'https://cdn1.fahasa.com/media/catalog/product/b/l/black-clover-tap-1.jpg',
        isFeatured: true
      }
    ];

    for (const b of finalBooks) {
      const existing = await Book.findOne({ bookId: b.bookId });
      if (!existing) {
        await Book.create(b);
        console.log(`Added: ${b.name}`);
      } else {
        await Book.findOneAndUpdate({ bookId: b.bookId }, b);
        console.log(`Updated: ${b.name}`);
      }
    }

    console.log('Successfully added final 2 books for perfect alignment!');
    await mongoose.disconnect();
  } catch (err) {
    console.error('Error:', err);
  }
}

addFinalBooks();
