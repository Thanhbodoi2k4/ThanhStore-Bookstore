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
            // Đã cập nhật link ảnh từ kho dqp9nm103 của bạn
            default: 'https://res.cloudinary.com/dqp9nm103/image/upload/v1772793585/d3f5f4abfaae685b9cb7be801388b4c1_xatx84.jpg' 
        },
        publicId: { 
            type: String, 
            // Thêm publicId mặc định để đồng bộ với link ảnh trên
            default: 'd3f5f4abfaae685b9cb7be801388b4c1_xatx84' 
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