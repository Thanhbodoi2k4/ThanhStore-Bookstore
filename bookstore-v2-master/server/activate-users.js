const mongoose = require('mongoose');
const User = require('./models/users.model');
mongoose.connect('mongodb://localhost:27017/bookstore').then(async () => {
  await User.updateOne({ email: 'test@gmail.com' }, { $set: { isActive: true, role: 1 } });
  await User.updateOne({ email: 'test4@gmail.com' }, { $set: { isActive: true, role: 1 } });
  console.log('Activated test users');
  process.exit(0);
});
