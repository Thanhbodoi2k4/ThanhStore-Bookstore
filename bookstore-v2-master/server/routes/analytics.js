const express = require('express')
const router = express.Router()

const analyticsController = require('../controllers/analytics.controller')


router.get('/revenue/all', analyticsController.getTotalRevenue)
router.get('/revenue/week', analyticsController.getRevenueWeek)
router.get('/revenue/lifetime', analyticsController.getRevenueLifeTime)
router.get('/ordercount/lifetime', analyticsController.getOrderCountLifeTime)
router.get('/product/bestseller', analyticsController.getBestSeller)

router.get('/kpis', analyticsController.getKPIs)
router.get('/orders/status-distribution', analyticsController.getOrderStatusDistribution)
router.get('/revenue/by-genres', analyticsController.getRevenueByGenres)
router.get('/customers/top-spending', analyticsController.getTopSpendingCustomers)
router.get('/revenue/range', analyticsController.getRevenueAndOrdersRange)


module.exports = router;
