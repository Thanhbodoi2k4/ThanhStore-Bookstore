const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema = new Schema({
    email: {
        type: String,
        lowercase: true
    },
    service: { type: String }, // Google, Facebook
    serviceId: { type: String }, //userId Google || Facebook
    password: { type: String },
    fullName: {
        type: String,
        required: true
    },
    // Nam: 0, Nữ 1
    gender: { type: Number, default: 0 },
    birthday: { type: String },
    phoneNumber: { type: String },
    avatar: { 
        url: { 
            type: String, 
            default: function() {
                const zodiacs = ["Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi"];
                const randomZodiac = zodiacs[Math.floor(Math.random() * zodiacs.length)];
                // Sử dụng DiceBear để tạo ra 1 avatar dễ thương dựa trên tên con giáp làm mã seed (tạm thời)
                // Bạn có thể thay link này bằng 1 mảng chứa 12 link ảnh thực tế của bạn trên Cloudinary
                return `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(randomZodiac)}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffdfbf,ffd5dc`;
            }
        },
        publicId: { 
            type: String, 
            default: 'default_zodiac_avatar' 
        }
     },
    address: [{
        address: { type: String },
        provinceId: { type: Number, required: true },
        districtId: { type: Number, required: true },
        wardId: { type: String, required: true },
        isDefault: { type: Boolean, default: false}
    }],
    cart: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', require: true },
        quantity: { type: Number, default: 1 },
    }],
    role: { type: Number, default: 0 },
    status: { type: Number, default: 0 }
  
}, {
    timestamps: true
})

userSchema.index({email: 1, serviceId: -1})

module.exports = mongoose.model('User', userSchema)