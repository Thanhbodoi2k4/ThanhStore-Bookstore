const mongoose = require('mongoose');
const Book = require('./models/books.model');

require('dotenv').config();

const MONGODB_CONNECT_URI = 'mongodb://localhost:27017/bookstore';

const imageMap = {
  'B024': '/images/books/cover_va_roi.png',
  'B018': '/images/books/cover_chi_pheo.png',
  'B017': '/images/books/cover_nhung_nguoi.png',
  'B015': '/images/books/cover_rung_na_uy.png',
  'B012': '/images/books/cover_de_men.png',
  'B014': '/images/books/cover_nghi_giau.png',
  'B013': 'https://covers.openlibrary.org/b/id/10521270-L.jpg',
  'B016': 'https://covers.openlibrary.org/b/id/12574100-L.jpg'
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

    console.log('All remaining book images updated!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

fixImages();
