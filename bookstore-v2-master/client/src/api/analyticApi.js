import axiosClient from "./axiosClient"

const analyticApi = {
    getTotalRevenue: () => {
        const url = `analytics/revenue/all`
        return axiosClient.get(url)
    },
    getRevenueWeek: ({start, end}) => {
        const url = `analytics/revenue/week`
        return axiosClient.get(url, { params: {start, end}})
    },
    getRevenueLifeTime: () => {
        const url = `analytics/revenue/lifetime`
        return axiosClient.get(url)
    },
    getOrderCountLifeTime: () => {
        const url = `analytics/ordercount/lifetime`
        return axiosClient.get(url)
    },
    getBestSeller: () => {
        const url = `analytics/product/bestseller`
        return axiosClient.get(url)
    },
    getKPIs: () => {
        const url = `analytics/kpis`
        return axiosClient.get(url)
    },
    getOrderStatusDistribution: () => {
        const url = `analytics/orders/status-distribution`
        return axiosClient.get(url)
    },
    getRevenueByGenres: () => {
        const url = `analytics/revenue/by-genres`
        return axiosClient.get(url)
    },
    getTopSpendingCustomers: () => {
        const url = `analytics/customers/top-spending`
        return axiosClient.get(url)
    },
    getRevenueAndOrdersRange: ({ start, end }) => {
        const url = `analytics/revenue/range`
        return axiosClient.get(url, { params: { start, end } })
    },
}

export default analyticApi