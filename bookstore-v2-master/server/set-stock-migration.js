require('dotenv').config();
const mongoose = require('mongoose');
const Book = require('./models/books.model');

mongoose.connect(process.env.MONGODB_CONNECT_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(async () => {
    console.log("Connected to MongoDB!");
    try {
        const result = await Book.updateMany({ stock: { $exists: false } }, { $set: { stock: 100 } });
        console.log(`Updated ${result.modifiedCount} books with default stock 100.`);

        const result2 = await Book.updateMany({ stock: 0 }, { $set: { stock: 100 } });
        console.log(`Updated ${result2.modifiedCount} books with 0 stock to 100.`);
    } catch (err) {
        console.error(err);
    } finally {
        mongoose.connection.close();
    }
}).catch(err => console.log(err));
