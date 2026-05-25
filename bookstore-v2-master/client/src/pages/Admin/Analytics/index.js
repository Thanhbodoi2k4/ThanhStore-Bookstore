import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import moment from "moment";
import * as XLSX from "xlsx";
import analyticApi from "../../../api/analyticApi";
import styles from "./AnalyticsPage.module.css";
import { useEffect, useState, useCallback } from "react";
import Loading from "../../../components/Loading";

import { 
  FaBook, 
  FaChartBar, 
  FaShoppingBag, 
  FaUsers, 
  FaBoxes, 
  FaDownload, 
  FaArrowUp, 
  FaArrowDown, 
  FaCalendarAlt,
  FaTrophy,
  FaUserShield
} from "react-icons/fa";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Chart default options for dark theme
const darkThemeDefaults = {
  plugins: {
    legend: {
      labels: {
        color: 'rgba(203, 213, 225, 0.8)',
        font: { family: "'Inter', sans-serif", size: 12 },
        padding: 16,
        usePointStyle: true,
      }
    }
  },
  scales: {
    x: {
      grid: { color: 'rgba(99, 102, 241, 0.05)', drawBorder: false },
      ticks: { color: 'rgba(148, 163, 184, 0.7)', font: { family: "'Inter', sans-serif", size: 11 } },
      border: { color: 'rgba(99, 102, 241, 0.1)' }
    },
    y: {
      grid: { color: 'rgba(99, 102, 241, 0.05)', drawBorder: false },
      ticks: { color: 'rgba(148, 163, 184, 0.7)', font: { family: "'Inter', sans-serif", size: 11 } },
      border: { color: 'rgba(99, 102, 241, 0.1)' }
    }
  }
};

function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [kpiData, setKpiData] = useState(null);
  const [bestSellers, setBestSellers] = useState([]);
  const [topCustomers, setTopCustomers] = useState([]);
  const [revenueRangeData, setRevenueRangeData] = useState([]);

  // Filter States
  const [filterType, setFilterType] = useState("30days");
  const [customRange, setCustomRange] = useState({
    start: moment().subtract(30, "days").format("YYYY-MM-DD"),
    end: moment().format("YYYY-MM-DD"),
  });

  // Chart Data States
  const [rangeChartData, setRangeChartData] = useState({});
  const [genreChartData, setGenreChartData] = useState({});
  const [statusChartData, setStatusChartData] = useState({});
  const [bestSellerChartData, setBestSellerChartData] = useState({});

  // Fetch static/overview data (KPIs, categories, status, customers, bestsellers)
  const fetchOverviewData = async () => {
    try {
      const [resKpis, resStatus, resGenres, resBestSeller, resCustomers] = await Promise.all([
        analyticApi.getKPIs(),
        analyticApi.getOrderStatusDistribution(),
        analyticApi.getRevenueByGenres(),
        analyticApi.getBestSeller(),
        analyticApi.getTopSpendingCustomers()
      ]);

      if (resKpis?.data) setKpiData(resKpis.data);
      if (resStatus?.data) {
        setStatusChartData({
          labels: resStatus.data.map(item => item._id || "Không xác định"),
          datasets: [
            {
              data: resStatus.data.map(item => item.count),
              backgroundColor: [
                "rgba(99, 102, 241, 0.75)", // Indigo
                "rgba(6, 182, 212, 0.75)",  // Cyan
                "rgba(16, 185, 129, 0.75)", // Emerald
                "rgba(245, 158, 11, 0.75)", // Amber
                "rgba(239, 68, 68, 0.75)",  // Red
                "rgba(139, 92, 246, 0.75)", // Purple
              ],
              borderColor: [
                "rgba(99, 102, 241, 1)",
                "rgba(6, 182, 212, 1)",
                "rgba(16, 185, 129, 1)",
                "rgba(245, 158, 11, 1)",
                "rgba(239, 68, 68, 1)",
                "rgba(139, 92, 246, 1)",
              ],
              borderWidth: 2,
            }
          ]
        });
      }

      if (resGenres?.data) {
        // limit to top 5 genres for clean chart
        const topGenres = resGenres.data.slice(0, 5);
        setGenreChartData({
          labels: topGenres.map(item => item._id || "Thể loại khác"),
          datasets: [
            {
              label: "Doanh thu thể loại (VNĐ)",
              data: topGenres.map(item => item.revenue),
              backgroundColor: "rgba(139, 92, 246, 0.65)",
              borderColor: "rgba(139, 92, 246, 1)",
              borderWidth: 1,
              borderRadius: 6,
            }
          ]
        });
      }

      if (resBestSeller?.data) {
        setBestSellers(resBestSeller.data);
        setBestSellerChartData({
          labels: resBestSeller.data.map(item => item.product[0]?.name.substring(0, 20) + "..."),
          datasets: [
            {
              label: "Đã bán (Cuốn)",
              data: resBestSeller.data.map(item => item.count),
              backgroundColor: "rgba(16, 185, 129, 0.65)",
              borderColor: "rgba(16, 185, 129, 1)",
              borderWidth: 1,
              borderRadius: 6,
            }
          ]
        });
      }

      if (resCustomers?.data) setTopCustomers(resCustomers.data);

    } catch (error) {
      console.error("Error fetching overview analytics data", error);
    }
  };

  // Fetch range data for main chart based on filter dates
  const fetchRangeData = useCallback(async (start, end) => {
    try {
      const { data } = await analyticApi.getRevenueAndOrdersRange({ start, end });
      if (data) {
        setRevenueRangeData(data);
        
        // Format labels based on range (convert YYYY-MM-DD to DD/MM)
        const labels = data.map(item => moment(item._id).format("DD/MM"));
        const revenues = data.map(item => item.revenue);
        const orderCounts = data.map(item => item.orderCount);

        setRangeChartData({
          labels,
          datasets: [
            {
              type: "line",
              label: "Số đơn hàng",
              data: orderCounts,
              borderColor: "rgba(6, 182, 212, 1)",
              borderWidth: 2,
              pointBackgroundColor: "rgba(6, 182, 212, 1)",
              pointRadius: 3,
              fill: false,
              yAxisID: "y1",
            },
            {
              type: "bar",
              label: "Doanh thu (VNĐ)",
              data: revenues,
              backgroundColor: "rgba(99, 102, 241, 0.55)",
              borderColor: "rgba(99, 102, 241, 1)",
              borderWidth: 1,
              borderRadius: 6,
              yAxisID: "y",
            }
          ]
        });
      }
    } catch (error) {
      console.error("Error fetching range analytics data", error);
    }
  }, []);

  // Handle filter changes and calculate dates
  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      await fetchOverviewData();
      
      let start = moment().subtract(30, "days").format("YYYY-MM-DD");
      let end = moment().format("YYYY-MM-DD");

      if (filterType === "today") {
        start = moment().format("YYYY-MM-DD");
        end = moment().format("YYYY-MM-DD");
      } else if (filterType === "yesterday") {
        start = moment().subtract(1, "days").format("YYYY-MM-DD");
        end = moment().subtract(1, "days").format("YYYY-MM-DD");
      } else if (filterType === "7days") {
        start = moment().subtract(7, "days").format("YYYY-MM-DD");
        end = moment().format("YYYY-MM-DD");
      } else if (filterType === "thisMonth") {
        start = moment().startOf("month").format("YYYY-MM-DD");
        end = moment().format("YYYY-MM-DD");
      } else if (filterType === "thisYear") {
        start = moment().startOf("year").format("YYYY-MM-DD");
        end = moment().format("YYYY-MM-DD");
      } else if (filterType === "all") {
        start = moment().subtract(1, "years").format("YYYY-MM-DD");
        end = moment().format("YYYY-MM-DD");
      } else if (filterType === "custom") {
        start = customRange.start;
        end = customRange.end;
      }

      await fetchRangeData(start, end);
      setLoading(false);
    };

    loadAll();
  }, [filterType, customRange.start, customRange.end, fetchRangeData]);

  // Export functions
  const handleExportExcel = (type) => {
    let dataToExport = [];
    let fileName = "";
    let sheetName = "";

    if (type === "revenue") {
      fileName = `Bao_cao_doanh_thu_${filterType}_${moment().format("YYYYMMDD")}.xlsx`;
      sheetName = "Doanh Thu";
      dataToExport = revenueRangeData.map(item => ({
        "Ngày": moment(item._id).format("DD/MM/YYYY"),
        "Doanh thu (VNĐ)": item.revenue,
        "Số đơn hàng": item.orderCount
      }));
    } else if (type === "books") {
      fileName = `Top_sach_ban_chay_${moment().format("YYYYMMDD")}.xlsx`;
      sheetName = "Top Sách Bán Chạy";
      dataToExport = bestSellers.map((item, index) => ({
        "Hạng": index + 1,
        "Tên sách": item.product[0]?.name || "N/A",
        "Giá bán (VNĐ)": item.product[0]?.price || 0,
        "Số lượng bán (Cuốn)": item.count || 0,
        "Doanh thu ước tính (VNĐ)": (item.count || 0) * (item.product[0]?.price || 0)
      }));
    } else if (type === "customers") {
      fileName = `Top_khach_hang_VIP_${moment().format("YYYYMMDD")}.xlsx`;
      sheetName = "Khách Hàng VIP";
      dataToExport = topCustomers.map((item, index) => ({
        "Hạng": index + 1,
        "Họ tên": item.fullName,
        "Email": item.email,
        "Số đơn đã mua": item.orderCount || 0,
        "Tổng chi tiêu (VNĐ)": item.totalSpent || 0
      }));
    }

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    XLSX.writeFile(wb, fileName);
  };

  const formatPrice = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  const renderGrowth = (growth) => {
    if (growth === 0) return <span className={styles.growthNeutral}>0% so với tháng trước</span>;
    const isUp = growth > 0;
    return (
      <span className={isUp ? styles.growthUp : styles.growthDown}>
        {isUp ? <FaArrowUp /> : <FaArrowDown />} {Math.abs(growth).toFixed(1)}% so với tháng trước
      </span>
    );
  };

  return (
    <div className={styles.wrapperDashboard}>
      {/* Header */}
      <div className={styles.dashboardHeader}>
        <div>
          <h1 className={styles.dashboardTitle}>HỆ THỐNG BÁO CÁO THỐNG KÊ</h1>
          <p className={styles.dashboardSubtitle}>Báo cáo chi tiết hoạt động kinh doanh của Bookstore</p>
        </div>
        <div className={styles.exportGroup}>
          <button className={styles.btnExport} onClick={() => handleExportExcel("revenue")}>
            <FaDownload /> Xuất Báo Cáo Excel
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className={styles.filterBar}>
        <div className={styles.filterTypeGroup}>
          <button 
            className={`${styles.filterBtn} ${filterType === "today" ? styles.active : ""}`}
            onClick={() => setFilterType("today")}
          >
            Hôm nay
          </button>
          <button 
            className={`${styles.filterBtn} ${filterType === "yesterday" ? styles.active : ""}`}
            onClick={() => setFilterType("yesterday")}
          >
            Hôm qua
          </button>
          <button 
            className={`${styles.filterBtn} ${filterType === "7days" ? styles.active : ""}`}
            onClick={() => setFilterType("7days")}
          >
            7 ngày qua
          </button>
          <button 
            className={`${styles.filterBtn} ${filterType === "30days" ? styles.active : ""}`}
            onClick={() => setFilterType("30days")}
          >
            30 ngày qua
          </button>
          <button 
            className={`${styles.filterBtn} ${filterType === "thisMonth" ? styles.active : ""}`}
            onClick={() => setFilterType("thisMonth")}
          >
            Tháng này
          </button>
          <button 
            className={`${styles.filterBtn} ${filterType === "thisYear" ? styles.active : ""}`}
            onClick={() => setFilterType("thisYear")}
          >
            Năm nay
          </button>
          <button 
            className={`${styles.filterBtn} ${filterType === "all" ? styles.active : ""}`}
            onClick={() => setFilterType("all")}
          >
            Toàn thời gian
          </button>
          <button 
            className={`${styles.filterBtn} ${filterType === "custom" ? styles.active : ""}`}
            onClick={() => setFilterType("custom")}
          >
            Tùy chọn ngày
          </button>
        </div>

        {filterType === "custom" && (
          <div className={styles.datePickerGroup}>
            <div className={styles.dateField}>
              <label>Từ ngày</label>
              <input 
                type="date" 
                value={customRange.start}
                max={customRange.end}
                onChange={(e) => setCustomRange(prev => ({ ...prev, start: e.target.value }))}
              />
            </div>
            <div className={styles.dateField}>
              <label>Đến ngày</label>
              <input 
                type="date" 
                value={customRange.end}
                min={customRange.start}
                max={moment().format("YYYY-MM-DD")}
                onChange={(e) => setCustomRange(prev => ({ ...prev, end: e.target.value }))}
              />
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <div className={styles.loadingWrapper}>
          <Loading />
        </div>
      ) : (
        <>
          {/* KPI Row */}
          {kpiData && (
            <div className={styles.kpiGrid}>
              {/* Card 1 */}
              <div className={styles.kpiCard}>
                <div className={styles.kpiContent}>
                  <p className={styles.kpiLabel}>TỔNG DOANH THU</p>
                  <h3 className={styles.kpiValue}>{formatPrice(kpiData.revenue.total)}</h3>
                  <div className={styles.kpiSub}>
                    {renderGrowth(kpiData.revenue.growth)}
                  </div>
                </div>
                <div className={`${styles.kpiIconWrapper} ${styles.bgRevenue}`}>
                  <FaChartBar />
                </div>
              </div>

              {/* Card 2 */}
              <div className={styles.kpiCard}>
                <div className={styles.kpiContent}>
                  <p className={styles.kpiLabel}>TỔNG ĐƠN HÀNG</p>
                  <h3 className={styles.kpiValue}>{kpiData.orders.total.toLocaleString()} đơn</h3>
                  <div className={styles.kpiSub}>
                    {renderGrowth(kpiData.orders.growth)}
                  </div>
                </div>
                <div className={`${styles.kpiIconWrapper} ${styles.bgOrders}`}>
                  <FaShoppingBag />
                </div>
              </div>

              {/* Card 3 */}
              <div className={styles.kpiCard}>
                <div className={styles.kpiContent}>
                  <p className={styles.kpiLabel}>KHÁCH HÀNG THÂN THIẾT</p>
                  <h3 className={styles.kpiValue}>{kpiData.users.total.toLocaleString()} users</h3>
                  <div className={styles.kpiSub}>
                    {renderGrowth(kpiData.users.growth)}
                  </div>
                </div>
                <div className={`${styles.kpiIconWrapper} ${styles.bgUsers}`}>
                  <FaUsers />
                </div>
              </div>

              {/* Card 4 */}
              <div className={styles.kpiCard}>
                <div className={styles.kpiContent}>
                  <p className={styles.kpiLabel}>SÁCH ĐÃ BÁN RA</p>
                  <h3 className={styles.kpiValue}>{kpiData.booksSold.total.toLocaleString()} cuốn</h3>
                  <div className={styles.kpiSub}>
                    {renderGrowth(kpiData.booksSold.growth)}
                  </div>
                </div>
                <div className={`${styles.kpiIconWrapper} ${styles.bgBooksSold}`}>
                  <FaBook />
                </div>
              </div>

              {/* Card 5 */}
              <div className={styles.kpiCard}>
                <div className={styles.kpiContent}>
                  <p className={styles.kpiLabel}>SÁCH TỒN KHO</p>
                  <h3 className={styles.kpiValue}>{kpiData.stock.total.toLocaleString()} cuốn</h3>
                  <div className={styles.kpiSub}>
                    <span className={styles.growthNeutral}>Sẵn sàng cung cấp</span>
                  </div>
                </div>
                <div className={`${styles.kpiIconWrapper} ${styles.bgStock}`}>
                  <FaBoxes />
                </div>
              </div>
            </div>
          )}

          {/* Charts Row 1 */}
          <div className={styles.chartsRow}>
            {/* Revenue Trend Line & Bar Chart */}
            <div className={`${styles.chartCard} ${styles.doubleWidth}`}>
              <div className={styles.chartHeader}>
                <h2 className={styles.chartTitle}><FaCalendarAlt /> Doanh thu và Số đơn hàng theo thời gian</h2>
                <span className={styles.rangeInfo}>
                  {filterType === "custom" 
                    ? `Từ ${moment(customRange.start).format("DD/MM/YYYY")} - ${moment(customRange.end).format("DD/MM/YYYY")}`
                    : `Lọc theo: ${filterType}`}
                </span>
              </div>
              <div className={styles.chartBody}>
                {rangeChartData.datasets && (
                  <Line 
                    data={rangeChartData} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      interaction: {
                        mode: 'index',
                        intersect: false,
                      },
                      plugins: {
                        ...darkThemeDefaults.plugins,
                        tooltip: {
                          backgroundColor: 'rgba(15, 23, 42, 0.95)',
                          borderColor: 'rgba(99, 102, 241, 0.3)',
                          borderWidth: 1,
                          titleColor: '#c7d2fe',
                          bodyColor: '#e2e8f0',
                          padding: 12,
                          cornerRadius: 8,
                        }
                      },
                      scales: {
                        ...darkThemeDefaults.scales,
                        y: {
                          type: 'linear',
                          display: true,
                          position: 'left',
                          grid: { color: 'rgba(99, 102, 241, 0.05)', drawBorder: false },
                          ticks: { 
                            color: 'rgba(148, 163, 184, 0.7)', 
                            callback: (value) => value >= 1000000 ? `${(value/1000000).toFixed(1)}M` : value.toLocaleString() 
                          }
                        },
                        y1: {
                          type: 'linear',
                          display: true,
                          position: 'right',
                          grid: { drawOnChartArea: false },
                          ticks: { color: 'rgba(6, 182, 212, 0.7)' }
                        }
                      }
                    }}
                  />
                )}
              </div>
            </div>

            {/* Order Status Distribution Doughnut */}
            <div className={styles.chartCard}>
              <div className={styles.chartHeader}>
                <h2 className={styles.chartTitle}><FaShoppingBag /> Trạng thái đơn hàng</h2>
              </div>
              <div className={styles.chartBody}>
                {statusChartData.datasets ? (
                  <Doughnut 
                    data={statusChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: "bottom",
                          labels: {
                            color: 'rgba(203, 213, 225, 0.8)',
                            font: { family: "'Inter', sans-serif", size: 11 },
                            padding: 8,
                            usePointStyle: true,
                          }
                        },
                        tooltip: {
                          backgroundColor: 'rgba(15, 23, 42, 0.95)',
                          borderColor: 'rgba(99, 102, 241, 0.3)',
                          borderWidth: 1,
                          padding: 10,
                        }
                      },
                      cutout: "70%",
                    }}
                  />
                ) : (
                  <div className={styles.noData}>Không có dữ liệu đơn hàng</div>
                )}
              </div>
            </div>
          </div>

          {/* Charts Row 2 */}
          <div className={styles.chartsRow}>
            {/* Revenue By Genres Horizontal Bar */}
            <div className={styles.chartCard}>
              <div className={styles.chartHeader}>
                <h2 className={styles.chartTitle}><FaBook /> Doanh thu theo thể loại (Top 5)</h2>
              </div>
              <div className={styles.chartBody}>
                {genreChartData.datasets ? (
                  <Bar 
                    data={genreChartData}
                    options={{
                      indexAxis: 'y',
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { display: false },
                        tooltip: {
                          backgroundColor: 'rgba(15, 23, 42, 0.95)',
                          borderColor: 'rgba(99, 102, 241, 0.3)',
                          borderWidth: 1,
                        }
                      },
                      scales: darkThemeDefaults.scales
                    }}
                  />
                ) : (
                  <div className={styles.noData}>Không có dữ liệu thể loại</div>
                )}
              </div>
            </div>

            {/* Best Sellers Chart */}
            <div className={styles.chartCard}>
              <div className={styles.chartHeader}>
                <h2 className={styles.chartTitle}><FaTrophy /> Sách bán chạy nhất (Top 5)</h2>
              </div>
              <div className={styles.chartBody}>
                {bestSellerChartData.datasets ? (
                  <Bar 
                    data={bestSellerChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { display: false },
                        tooltip: {
                          backgroundColor: 'rgba(15, 23, 42, 0.95)',
                          borderColor: 'rgba(16, 185, 129, 0.3)',
                          borderWidth: 1,
                        }
                      },
                      scales: darkThemeDefaults.scales
                    }}
                  />
                ) : (
                  <div className={styles.noData}>Không có dữ liệu bán chạy</div>
                )}
              </div>
            </div>
          </div>

          {/* Details Tables Section */}
          <div className={styles.tablesContainer}>
            {/* Top Products Table */}
            <div className={styles.tableCard}>
              <div className={styles.tableHeader}>
                <h3><FaTrophy /> Top sách bán chạy nhất</h3>
                <button className={styles.btnMiniExport} onClick={() => handleExportExcel("books")}>
                  <FaDownload /> Xuất Excel
                </button>
              </div>
              <div className={styles.tableWrapper}>
                <table className={styles.analyticsTable}>
                  <thead>
                    <tr>
                      <th style={{ width: "60px" }}>Hạng</th>
                      <th>Hình ảnh</th>
                      <th>Tên sách</th>
                      <th>Đơn giá</th>
                      <th>Đã bán</th>
                      <th>Doanh thu ước tính</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bestSellers.length > 0 ? (
                      bestSellers.map((item, index) => {
                        const book = item.product[0];
                        if (!book) return null;
                        return (
                          <tr key={item._id}>
                            <td>
                              <span className={`${styles.badgeRank} ${styles[`rank${index+1}`] || ""}`}>
                                {index + 1}
                              </span>
                            </td>
                            <td>
                              <img src={book.imageUrl} alt={book.name} className={styles.bookImage} />
                            </td>
                            <td>
                              <div className={styles.bookName} title={book.name}>{book.name}</div>
                            </td>
                            <td>{formatPrice(book.price)}</td>
                            <td><strong className={styles.textHighlight}>{item.count} cuốn</strong></td>
                            <td><strong className={styles.textSuccess}>{formatPrice(item.count * book.price)}</strong></td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="6" className={styles.noDataText}>Chưa có dữ liệu sản phẩm</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Top Customers Table */}
            <div className={styles.tableCard}>
              <div className={styles.tableHeader}>
                <h3><FaUserShield /> Khách hàng chi tiêu nhiều nhất (VIP)</h3>
                <button className={styles.btnMiniExport} onClick={() => handleExportExcel("customers")}>
                  <FaDownload /> Xuất Excel
                </button>
              </div>
              <div className={styles.tableWrapper}>
                <table className={styles.analyticsTable}>
                  <thead>
                    <tr>
                      <th style={{ width: "60px" }}>Hạng</th>
                      <th>Khách hàng</th>
                      <th>Email</th>
                      <th>Số đơn hàng</th>
                      <th>Tổng chi tiêu</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topCustomers.length > 0 ? (
                      topCustomers.map((item, index) => (
                        <tr key={item._id || index}>
                          <td>
                            <span className={`${styles.badgeRank} ${styles[`rank${index+1}`] || ""}`}>
                              {index + 1}
                            </span>
                          </td>
                          <td>
                            <div className={styles.customerProfile}>
                              <img 
                                src={item.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(item.fullName)}`} 
                                alt={item.fullName} 
                                className={styles.customerAvatar} 
                              />
                              <strong>{item.fullName}</strong>
                            </div>
                          </td>
                          <td>{item.email}</td>
                          <td>{item.orderCount} đơn hàng</td>
                          <td><strong className={styles.textSuccess}>{formatPrice(item.totalSpent)}</strong></td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className={styles.noDataText}>Chưa có dữ liệu khách hàng VIP</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default AnalyticsPage;
