/**
 * Script tạo/cập nhật tài khoản Admin
 * Chạy: node create-admin.js
 */
const mongoose = require('mongoose');
const bcrypt   = require('bcrypt');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/bookstore';

const userSchema = new mongoose.Schema({
  email:      { type: String, lowercase: true },
  password:   { type: String },
  fullName:   { type: String, required: true },
  role:       { type: Number, default: 0 },   // 1 = admin
  status:     { type: Number, default: 1 },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

async function main() {
  await mongoose.connect(MONGO_URI);
  console.log('✅ Đã kết nối MongoDB:', MONGO_URI);

  const email    = 'admin';          // tài khoản đăng nhập
  const password = 'admin123';       // mật khẩu
  const fullName = 'Admin ThanhStore';

  const hash = await bcrypt.hash(password, 10);

  // roleEnum: Customer=0, Staff=2, Admin=3
  // status: 0=chờ kích hoạt/bị khóa, 1=active
  const existing = await User.findOne({ email: email, serviceId: { $exists: false } });

  if (existing) {
    existing.password = hash;
    existing.role     = 3;   // Admin
    existing.status   = 1;   // active
    existing.fullName = fullName;
    await existing.save();
    console.log(`✅ Đã cập nhật tài khoản admin: email="${email}" | password="${password}" | role=3`);
  } else {
    await User.create({ email, password: hash, fullName, role: 3, status: 1 });
    console.log(`✅ Đã tạo tài khoản admin mới: email="${email}" | password="${password}" | role=3`);
  }

  await mongoose.disconnect();
  console.log('🔌 Đã ngắt kết nối MongoDB. Xong!');
}

main().catch(err => {
  console.error('❌ Lỗi:', err.message);
  process.exit(1);
});
