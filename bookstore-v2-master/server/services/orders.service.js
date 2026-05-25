const Order = require('../models/orders.model')

const orderService = {
    getAll: async({query, page, limit, sort}) => {
        const skip = (page - 1) * limit

        return await Promise.all([
            Order.countDocuments(query), 
            Order.find(query).skip(skip).limit(limit).sort(sort)])

    },
    getById: async(id) => {
        return await Order.findById(id).populate("user voucher").populate("products.product").populate("tracking.user", "fullName")
    },
    create: async({ userId, products, delivery, voucherId, cost, method, paymentId }) => {
        const newOrder = new Order({
            user: userId, 
            products,
            delivery, 
            voucher: voucherId, 
            cost, 
            method, 
            paymentId
        })
        return await newOrder.save()
    },
    updatePaymentStatusByPaymentId: async(paymentId, { paymentStatus, method }) => {
        return await Order.findOneAndUpdate({ paymentId: paymentId },  { paymentStatus, method }, {new: true})
    },
    updateStatus: async(id, { orderStatus, paymentStatus }) => {
        return await Order.findByIdAndUpdate(id, {
            orderStatus,
            paymentStatus
        }, {new: true})
       
    },
    updatePaymentId: async(orderId, { paymentId }) => {
        return await Order.findByIdAndUpdate(orderId,  { paymentId }, {new: true})
    },
    addTracking: async (orderId, { status, time, userId }) =>{
        return await Order.findByIdAndUpdate(orderId, {
            $push: {
                tracking: { status, time, user: userId }
            }
        }, { new: true })
    },
    // Thong ke
    getTotalRevenue: async() => {
        return await Order.aggregate([
            {
                $project: {
                    createdAt: 1,
                    totalCost: { $subtract: ["$cost.total", "$cost.shippingFee"] }
                }
            },
            {
                $group: {
                    _id: null,
                    revenue: { $sum: "$totalCost" },
                },
               
            },
        ])
    },
    getRevenueWeek: async(query) => {
        const { start, end } = query
        return await Order.aggregate([
            {
                $project: {
                    createdAt: 1,
                    totalCost: { $subtract: ["$cost.total", "$cost.shippingFee"] }
                }
            },
            {
                $match: {
                    createdAt: {
                        $gte: new Date(start),
                        $lte: new Date(end),
                    },
                },
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    revenue: { $sum: "$totalCost" },
                },
            },
            { $sort: { _id: 1 } },
        ])
    },
    getRevenueLifeTime: async() => {
        return await Order.aggregate([
            {
                $project: {
                    createdAt: 1,
                    totalCost: { $subtract: ["$cost.total", "$cost.shippingFee"] }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    revenue: { $sum: "$totalCost" },
                },
            },
            { $sort: { _id: 1 } },
        ])
    },
    getOrderCountLifeTime: async() => {
        return await Order.aggregate([
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    total: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ])
       
    },
    getBestSeller: async() => {
        return await Order.aggregate([
            { $unwind: "$products" },
            {
                $group: {
                    _id: "$products.product", 
                    count: { $sum: "$products.quantity" }
                }
            },
            {
                $lookup: {
                    from: "books", 
                    localField: "_id",
                    foreignField: "_id",
                    as: "product",
                },
            },
            { $sort: { count: -1 } },
            { $limit: 5 },
            
        ])
    },
    getKPIs: async () => {
        const now = new Date()
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999)

        // Doanh thu
        const allRevenueArr = await Order.aggregate([
            {
                $project: {
                    totalCost: { $subtract: ["$cost.total", "$cost.shippingFee"] }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$totalCost" }
                }
            }
        ])
        const totalRevenue = allRevenueArr[0]?.total || 0

        const revenueThisMonthArr = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: startOfMonth }
                }
            },
            {
                $project: {
                    totalCost: { $subtract: ["$cost.total", "$cost.shippingFee"] }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$totalCost" }
                }
            }
        ])
        const revenueThisMonth = revenueThisMonthArr[0]?.total || 0

        const revenueLastMonthArr = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth }
                }
            },
            {
                $project: {
                    totalCost: { $subtract: ["$cost.total", "$cost.shippingFee"] }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$totalCost" }
                }
            }
        ])
        const revenueLastMonth = revenueLastMonthArr[0]?.total || 0

        // Đơn hàng
        const totalOrders = await Order.countDocuments()
        const ordersThisMonth = await Order.countDocuments({ createdAt: { $gte: startOfMonth } })
        const ordersLastMonth = await Order.countDocuments({ createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } })

        // Khách hàng
        const User = require('../models/users.model')
        const totalUsers = await User.countDocuments({ role: 1 })
        const usersThisMonth = await User.countDocuments({ role: 1, createdAt: { $gte: startOfMonth } })
        const usersLastMonth = await User.countDocuments({ role: 1, createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } })

        // Sách đã bán
        const allBooksSoldArr = await Order.aggregate([
            { $unwind: "$products" },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$products.quantity" }
                }
            }
        ])
        const totalBooksSold = allBooksSoldArr[0]?.total || 0

        const booksSoldThisMonthArr = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: startOfMonth }
                }
            },
            { $unwind: "$products" },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$products.quantity" }
                }
            }
        ])
        const booksSoldThisMonth = booksSoldThisMonthArr[0]?.total || 0

        const booksSoldLastMonthArr = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth }
                }
            },
            { $unwind: "$products" },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$products.quantity" }
                }
            }
        ])
        const booksSoldLastMonth = booksSoldLastMonthArr[0]?.total || 0

        // Tồn kho
        const Book = require('../models/books.model')
        const booksInStockArr = await Book.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: "$stock" }
                }
            }
        ])
        const totalBooksInStock = booksInStockArr[0]?.total || 0

        return {
            revenue: {
                total: totalRevenue,
                thisMonth: revenueThisMonth,
                lastMonth: revenueLastMonth,
                growth: revenueLastMonth > 0 ? ((revenueThisMonth - revenueLastMonth) / revenueLastMonth) * 100 : 0
            },
            orders: {
                total: totalOrders,
                thisMonth: ordersThisMonth,
                lastMonth: ordersLastMonth,
                growth: ordersLastMonth > 0 ? ((ordersThisMonth - ordersLastMonth) / ordersLastMonth) * 100 : 0
            },
            users: {
                total: totalUsers,
                thisMonth: usersThisMonth,
                lastMonth: usersLastMonth,
                growth: usersLastMonth > 0 ? ((usersThisMonth - usersLastMonth) / usersLastMonth) * 100 : 0
            },
            booksSold: {
                total: totalBooksSold,
                thisMonth: booksSoldThisMonth,
                lastMonth: booksSoldLastMonth,
                growth: booksSoldLastMonth > 0 ? ((booksSoldThisMonth - booksSoldLastMonth) / booksSoldLastMonth) * 100 : 0
            },
            stock: {
                total: totalBooksInStock
            }
        }
    },
    getOrderStatusDistribution: async () => {
        return await Order.aggregate([
            {
                $group: {
                    _id: "$orderStatus.text",
                    code: { $first: "$orderStatus.code" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { code: 1 } }
        ])
    },
    getRevenueByGenres: async () => {
        return await Order.aggregate([
            { $unwind: "$products" },
            {
                $lookup: {
                    from: "books",
                    localField: "products.product",
                    foreignField: "_id",
                    as: "bookInfo"
                }
            },
            { $unwind: "$bookInfo" },
            { $unwind: "$bookInfo.genre" },
            {
                $lookup: {
                    from: "genres",
                    localField: "bookInfo.genre",
                    foreignField: "_id",
                    as: "genreInfo"
                }
            },
            { $unwind: "$genreInfo" },
            {
                $group: {
                    _id: "$genreInfo.name",
                    revenue: { $sum: { $multiply: ["$products.quantity", "$products.price"] } },
                    count: { $sum: "$products.quantity" }
                }
            },
            { $sort: { revenue: -1 } }
        ])
    },
    getTopSpendingCustomers: async () => {
        return await Order.aggregate([
            {
                $group: {
                    _id: "$user",
                    totalSpent: { $sum: { $subtract: ["$cost.total", "$cost.shippingFee"] } },
                    orderCount: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "userInfo"
                }
            },
            { $unwind: "$userInfo" },
            {
                $project: {
                    _id: 1,
                    fullName: "$userInfo.fullName",
                    email: "$userInfo.email",
                    avatar: "$userInfo.avatar.url",
                    totalSpent: 1,
                    orderCount: 1
                }
            },
            { $sort: { totalSpent: -1 } },
            { $limit: 5 }
        ])
    },
    getRevenueAndOrdersRange: async (start, end) => {
        return await Order.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: new Date(start),
                        $lte: new Date(end)
                    }
                }
            },
            {
                $project: {
                    createdAt: 1,
                    totalCost: { $subtract: ["$cost.total", "$cost.shippingFee"] }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    revenue: { $sum: "$totalCost" },
                    orderCount: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ])
    },
}

module.exports = orderService
