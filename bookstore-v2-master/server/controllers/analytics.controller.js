const orderService = require('../services/orders.service')

const analyticsController = {
    getTotalRevenue: async(req, res) => {
        try {
            const data = await orderService.getTotalRevenue()
            res.status(200).json({
                message: 'success',
                error: 0,
                data,
            })
        } catch (error) {
            res.status(500).json({
                message: `Có lỗi xảy ra! ${error.message}`,
                error: 1,
            })
        }
    },
    getRevenueWeek: async(req, res) => {
        try {
            const data = await orderService.getRevenueWeek(req.query)
            res.status(200).json({
                message: 'success',
                error: 0,
                data,
            })
        } catch (error) {
            res.status(500).json({
                message: `Có lỗi xảy ra! ${error.message}`,
                error: 1,
            })
        }
    },
    getRevenueLifeTime: async(req, res) => {
        try {
            const data = await orderService.getRevenueLifeTime()
            res.status(200).json({
                message: 'success',
                error: 0,
                data,
            })
        } catch (error) {
            res.status(500).json({
                message: `Có lỗi xảy ra! ${error.message}`,
                error: 1,
            })
        }
    },
    getOrderCountLifeTime: async(req, res) => {
        try {
            const data = await orderService.getOrderCountLifeTime()
            res.status(200).json({
                message: 'success',
                error: 0,
                data,
            })
        } catch (error) {
            res.status(500).json({
                message: `Có lỗi xảy ra! ${error.message}`,
                error: 1,
            })
        }
    },
    getBestSeller: async(req, res) => {
        try {
            const data = await orderService.getBestSeller()
            res.status(200).json({
                message: 'success',
                error: 0,
                data,
            })
        } catch (error) {
            res.status(500).json({
                message: `Có lỗi xảy ra! ${error.message}`,
                error: 1,
            })
        }
    },
    getKPIs: async(req, res) => {
        try {
            const data = await orderService.getKPIs()
            res.status(200).json({
                message: 'success',
                error: 0,
                data,
            })
        } catch (error) {
            res.status(500).json({
                message: `Có lỗi xảy ra! ${error.message}`,
                error: 1,
            })
        }
    },
    getOrderStatusDistribution: async(req, res) => {
        try {
            const data = await orderService.getOrderStatusDistribution()
            res.status(200).json({
                message: 'success',
                error: 0,
                data,
            })
        } catch (error) {
            res.status(500).json({
                message: `Có lỗi xảy ra! ${error.message}`,
                error: 1,
            })
        }
    },
    getRevenueByGenres: async(req, res) => {
        try {
            const data = await orderService.getRevenueByGenres()
            res.status(200).json({
                message: 'success',
                error: 0,
                data,
            })
        } catch (error) {
            res.status(500).json({
                message: `Có lỗi xảy ra! ${error.message}`,
                error: 1,
            })
        }
    },
    getTopSpendingCustomers: async(req, res) => {
        try {
            const data = await orderService.getTopSpendingCustomers()
            res.status(200).json({
                message: 'success',
                error: 0,
                data,
            })
        } catch (error) {
            res.status(500).json({
                message: `Có lỗi xảy ra! ${error.message}`,
                error: 1,
            })
        }
    },
    getRevenueAndOrdersRange: async(req, res) => {
        try {
            const { start, end } = req.query
            if (!start || !end) {
                return res.status(400).json({
                    message: "Vui lòng cung cấp start và end date",
                    error: 1
                })
            }
            const data = await orderService.getRevenueAndOrdersRange(start, end)
            res.status(200).json({
                message: 'success',
                error: 0,
                data,
            })
        } catch (error) {
            res.status(500).json({
                message: `Có lỗi xảy ra! ${error.message}`,
                error: 1,
            })
        }
    },
}

module.exports = analyticsController
