const mongoose = require('mongoose');
const Book = require('./models/books.model');

require('dotenv').config();

const MONGODB_CONNECT_URI = 'mongodb://localhost:27017/bookstore';

const imageMap = {
  'B030': '/images/books/cover_doi_ngan.png',
  'B021': '/images/books/cover_mat_biec.png',
  'B029': '/images/books/cover_song_mon.png',
  'B027': '/images/books/cover_tuoi_tre.png',
  'B026': '/images/books/cover_cho_toi_xin.png',
  'B028': '/images/books/cover_kafka.png',
  'B019': '/images/books/cover_luoc_su.png',
  'B020': '/images/books/cover_nha_lanh_dao.png',
  'B011': '/images/books/cover_hoa_vang.png',
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
