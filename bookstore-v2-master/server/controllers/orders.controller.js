const crypto = require('crypto') 
const axios = require('axios')

const orderService = require('../services/orders.service')
const voucherService = require('../services/vouchers.service')

const { paymentStatusEnum, methodEnum, orderStatusEnum } = require('../utils/enum')
const { orderSuccess } = require('../utils/sendMail')

function sortObject(obj) {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj){
        if (obj.hasOwnProperty(key)) {
        str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}

const orderController = {
    getAll: async(req, res) => {
        try {
            const page = req.query.page ? parseInt(req.query.page) : 1
            const limit = req.query.limit ? parseInt(req.query.limit) : 2
            const sort = req.query.sort ? req.query.sort : { createdAt: -1 }
            const userId = req.query.userId

            let query = {}
            if (userId) query.user = { $in : userId}

            const [count, data] = await orderService.getAll({query, page, limit, sort})
            const totalPage = Math.ceil(count / limit)

            res.status(200).json({
                message: 'success',
                error: 0,
                data,
                count,
                pagination: {
                    page,
                    limit,
                    totalPage,
                }
            })
        } catch (error) {
            res.status(500).json({
                message: `Có lỗi xảy ra! ${error.message}`,
                error: 1,
            })
        }
    },
    getById: async(req, res) => {
        try {
            const { id } = req.params
            const data = await orderService.getById(id)
            if (data) {
                res.status(200).json({
                    message: 'success',
                    error: 0,
                    data
                })
            } else {
                res.status(404).json({
                    message: 'Không tìm thấy đơn hàng!',
                    error: 1,
                    data
                })
            }
        } catch (error) {
            res.status(500).json({
                message: `Có lỗi xảy ra! ${error.message}`,
                error: 1,
            })
        }
    },
    getPayUrlMoMo: async (req, res) => {
        try {
            const { amount, paymentId } = req.body

            const host = req.get('origin')
            const link = `${host}/thanhtoan/momo/callback`

            const partnerCode = process.env.MOMO_PARTNER_CODE || "MOMO";
            const accessKey = process.env.MOMO_ACCESS_KEY;
            const secretkey = process.env.MOMO_SECRET_KEY;
            const requestId = paymentId;
            const orderId = requestId;
            const orderInfo = "Thanh toán mua hàng tại BookStore";
            const redirectUrl = link;
            const ipnUrl = "https://callback.url/notify";
            const requestType = "captureWallet"
            const extraData = "";

            const rawSignature = "accessKey="+accessKey+"&amount=" + amount+"&extraData=" + extraData+"&ipnUrl=" + ipnUrl+"&orderId=" + orderId+"&orderInfo=" + orderInfo+"&partnerCode=" + partnerCode +"&redirectUrl=" + redirectUrl+"&requestId=" + requestId+"&requestType=" + requestType
           
            const signature = crypto.createHmac('sha256', secretkey).update(rawSignature).digest('hex');
            const requestBody = JSON.stringify({
                partnerCode : partnerCode,
                accessKey : accessKey,
                requestId : requestId,
                amount : amount,
                orderId : orderId,
                orderInfo : orderInfo,
                redirectUrl : redirectUrl,
                ipnUrl : ipnUrl,
                extraData : extraData,
                requestType : requestType,
                signature : signature,
                lang: 'en'
            });
          
            axios.post('https://test-payment.momo.vn/v2/gateway/api/create', requestBody, {
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            .then(({data}) =>  res.status(200).json({ message: "Ok", payUrl: data.payUrl }))
            .catch (err => res.status(500).json({ message: err.message }))
            
        } catch (error) {
            console.log(error)
            res.status(500).json({
                error: 1,
                message: error.message
            })
        }
    },
    verifyMoMo: async (req, res) => {
        try {
            const { paymentId } = req.body

            const partnerCode = process.env.MOMO_PARTNER_CODE || "MOMO";
            const accessKey = process.env.MOMO_ACCESS_KEY;
            const secretkey = process.env.MOMO_SECRET_KEY;

            const rawSignature = "accessKey=" + accessKey + "&orderId=" + paymentId + "&partnerCode=" + partnerCode + "&requestId=" + paymentId
            const signature = crypto.createHmac('sha256', secretkey).update(rawSignature).digest('hex');
           
            const requestBody = JSON.stringify({
                partnerCode : "MOMO",
                requestId : paymentId,
                orderId : paymentId,
                signature : signature,
                lang: 'en'
            });

            axios.post('https://test-payment.momo.vn/v2/gateway/api/query', requestBody, {
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            .then(async ({data}) =>  {
                const { resultCode } = data
                if (resultCode === 0) {
                        await orderService.updatePaymentStatusByPaymentId(paymentId, { paymentStatus: paymentStatusEnum?.Paid, method: methodEnum?.momo })
                        return  res.status(200).json({ message: "Ok" })
                }
                await orderService.updatePaymentStatusByPaymentId(paymentId, { paymentStatus: paymentStatusEnum?.Failed, method: methodEnum?.momo })
                res.status(200).json({ message: "Thanh toán lỗi!" })
            })
            .catch (async (err) => {
                // await orderService.updatePaymentStatusByPaymentId(paymentId, { paymentStatus: paymentStatusEnum?.Failed, method: methodEnum?.momo?.code })
                // res.status(500).json({ error: err.message })
            })
            
        } catch (error) {
            console.log(error)
            res.status(500).json({
                message: `Có lỗi xảy ra! ${error.message}`,
                error: 1,
            })
        }
    },
    getPayUrlVNPay: async (req, res) => {
        try {
            const { amount, paymentId } = req.body;
            
            const date = new Date();
            const pad = (n) => (n < 10 ? '0' + n : n);
            const createDate = date.getFullYear().toString() + pad(date.getMonth() + 1) + pad(date.getDate()) + pad(date.getHours()) + pad(date.getMinutes()) + pad(date.getSeconds());
            
            const ipAddr = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress || '127.0.0.1';
            
            const tmnCode = process.env.VNPAY_TMN_CODE;
            const secretKey = process.env.VNPAY_SECRET_KEY;
            let vnpUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
            const returnUrl = `${req.get('origin')}/thanhtoan/vnpay/callback`;
            const orderId = paymentId;
            const bankCode = '';
            
            const locale = 'vn';
            const currCode = 'VND';
            let vnp_Params = {};
            vnp_Params['vnp_Version'] = '2.1.0';
            vnp_Params['vnp_Command'] = 'pay';
            vnp_Params['vnp_TmnCode'] = tmnCode;
            vnp_Params['vnp_Locale'] = locale;
            vnp_Params['vnp_CurrCode'] = currCode;
            vnp_Params['vnp_TxnRef'] = orderId;
            vnp_Params['vnp_OrderInfo'] = 'Thanh toan don hang ' + orderId;
            vnp_Params['vnp_OrderType'] = 'other';
            vnp_Params['vnp_Amount'] = amount * 100;
            vnp_Params['vnp_ReturnUrl'] = returnUrl;
            vnp_Params['vnp_IpAddr'] = ipAddr;
            vnp_Params['vnp_CreateDate'] = createDate;
            if(bankCode !== null && bankCode !== ''){
                vnp_Params['vnp_BankCode'] = bankCode;
            }

            vnp_Params = sortObject(vnp_Params);

            const signData = Object.keys(vnp_Params).map(key => key + '=' + vnp_Params[key]).join('&');
            const hmac = crypto.createHmac("sha512", secretKey);
            const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex"); 
            vnp_Params['vnp_SecureHash'] = signed;
            vnpUrl += '?' + Object.keys(vnp_Params).map(key => key + '=' + vnp_Params[key]).join('&');

            res.status(200).json({ message: "Ok", payUrl: vnpUrl });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 1, message: error.message });
        }
    },
    verifyVNPay: async (req, res) => {
        try {
            let vnp_Params = req.body;
            let secureHash = vnp_Params['vnp_SecureHash'];

            delete vnp_Params['vnp_SecureHash'];
            delete vnp_Params['vnp_SecureHashType'];

            vnp_Params = sortObject(vnp_Params);

            const secretKey = process.env.VNPAY_SECRET_KEY;
            const signData = Object.keys(vnp_Params).map(key => key + '=' + vnp_Params[key]).join('&');
            const hmac = crypto.createHmac("sha512", secretKey);
            const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");     

            if(secureHash === signed){
                const paymentId = vnp_Params['vnp_TxnRef'];
                const rspCode = vnp_Params['vnp_ResponseCode'];
                if (rspCode === '00') {
                    await orderService.updatePaymentStatusByPaymentId(paymentId, { paymentStatus: paymentStatusEnum?.Paid, method: methodEnum?.vnpay });
                    return res.status(200).json({ message: "Ok", code: '00' });
                } else {
                    await orderService.updatePaymentStatusByPaymentId(paymentId, { paymentStatus: paymentStatusEnum?.Failed, method: methodEnum?.vnpay });
                    return res.status(200).json({ message: "Giao dịch thất bại", code: rspCode });
                }
            } else{
                res.status(200).json({ message: "Checksum failed", code: '97' });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: `Có lỗi xảy ra! ${error.message}`, error: 1 });
        }
    },
    create: async(req, res) => {
        try {
            const { userId, products, delivery, voucherId, cost, method, paymentId } = req.body
            if (products.length <= 0) return res.status(400).json({error: 1, message: "Giỏ hàng rỗng. Không thể thực hiện!!"}) 

            // Kiểm tra tồn kho trước khi tạo đơn hàng
            const Book = require('../models/books.model')
            const outOfStock = []
            for (const item of products) {
                const book = await Book.findById(item.product)
                if (!book) {
                    outOfStock.push({ name: item.name || 'Sản phẩm không tồn tại', requested: item.quantity, available: 0 })
                } else if (book.stock < item.quantity) {
                    outOfStock.push({ name: book.name, requested: item.quantity, available: book.stock })
                }
            }
            if (outOfStock.length > 0) {
                const messages = outOfStock.map(item => `"${item.name}" chỉ còn ${item.available} cuốn`).join(', ')
                return res.status(400).json({
                    error: 1,
                    message: `Không đủ số lượng tồn kho: ${messages}`,
                    outOfStock
                })
            }

            const voucher = await voucherService.getById(voucherId)
            if (voucher) {
                const { minimum, start, end } = voucher
                const now = new Date()
                if (cost?.subTotal < minimum) {
                    return res.status(400).json({
                        message: `Đơn hàng không thỏa giá trị đơn hàng cần tối thiểu`,
                        error: 1,
                    })
                  }
                if (!(now >= new Date(start) && now <= new Date(end))) {
                    return res.status(400).json({
                        message: `Thời gian không phù hợp!`,
                        error: 1,
                    })
                }
            }
           
            const data = await orderService.create({
                userId, products, delivery, voucherId, cost, method, paymentId
            })

            // Trừ tồn kho sau khi tạo đơn hàng thành công
            if (data) {
                for (const item of products) {
                    await Book.findByIdAndUpdate(item.product, {
                        $inc: { stock: -item.quantity }
                    })
                }
                await orderSuccess({ clientURL: req.get('origin'), delivery, products, method, cost })
            }

            return res.status(201).json({
                message: 'success',
                error: 0,
                data
            })
        } catch (error) {
            console.log(error)
            res.status(500).json({
                message: `Có lỗi xảy ra! ${error.message}`,
                error: 1,
            })
        }
    },
    updatePaymentId: async(req, res) => {
        try {
            const { id } = req.params
            const { paymentId } = req.body
            const data = await orderService.updatePaymentId(id, { paymentId })
            res.status(200).json({
                message: 'success',
                error: 0,
                data
            })
        } catch (error) {
            res.status(500).json({
                message: `Có lỗi xảy ra! ${error.message}`,
                error: 1,
            })
        }
    },
    updateOrderStatus: async(req, res) => {
        try {
            const { id } = req.params
            const { orderStatusCode } = req.body
            const { user: { userId } } = req
            const order = await orderService.getById(id)

            const { method, paymentStatus, orderStatus: { code: oldCode } } = order

            if (method?.code !== methodEnum?.cash?.code && paymentStatus?.code !== paymentStatusEnum?.Paid?.code) {
                return res.status(400).json({error: 1, message: "Khách hàng chưa thanh toán! Không thể thực hiện!"})
            }

            const orderStatus = (Object.entries(orderStatusEnum).find(([a, b]) => +b.code === +orderStatusCode))?.[1]

            if (!orderStatus) return res.status(400).json({error: 1, message: "Trạng thái không hợp lệ!"})
                
            const { code } = orderStatus

            if (code <= oldCode) {
                return res.status(400).json({error: 1, message: "Trạng thái không hợp lệ!"})
            }

            let newPaymentStatus = { ...paymentStatus }

            if (method?.code === methodEnum?.cash?.code && code === orderStatusEnum?.delivered?.code) {
                newPaymentStatus = paymentStatusEnum?.Paid
            }

            const data = await orderService.updateStatus(id, {
                orderStatus, paymentStatus: newPaymentStatus
            })
            if (data) {
                await orderService.addTracking(id, { status: orderStatus?.text, time: new Date(), userId })
            }
            res.status(200).json({
                message: 'success',
                error: 0,
                data: data
            })
        } catch (error) {
            res.status(500).json({
                message: `Có lỗi xảy ra! ${error.message}`,
                error: 1,
            })
        }
    },
}

module.exports = orderController
