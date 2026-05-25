import { useState } from "react";
import { Outlet } from "react-router-dom";
import './admin-global.css';
import { useSelector } from "react-redux";
import AdminSideBar from "./components/SideBar/AdminSideBar";
import styles from "./Layout.module.css"
import adminStyles from "./AdminLayout.module.css"
import adminAvatar from "../assets/images/admin_avatar.png"

function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { fullName, avatar, role } = useSelector((state) => state.auth)

  const getRoleLabel = (role) => {
    switch(role) {
      case 3: return 'Administrator';
      case 2: return 'Staff';
      default: return 'User';
    }
  }

  const getCurrentTime = () => {
    return new Date().toLocaleString('vi-VN', { 
      weekday: 'short', 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit', 
      minute: '2-digit'
    });
  }

  return (
    <>
      <AdminSideBar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className={styles.contentWrapperAdmin}>
        {/* Top Bar */}
        <header className={adminStyles.adminTopBar}>
          <div className={adminStyles.topBarLeft}>
            {/* Hamburger Button for mobile */}
            <button className={adminStyles.menuToggleBtn} onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
            <div className={adminStyles.breadcrumbIcon}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
                <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
              </svg>
            </div>
            <span className={adminStyles.topBarTitle}>Quản trị hệ thống</span>
          </div>

          <div className={adminStyles.topBarRight}>
            {/* Live Clock */}
            <div className={adminStyles.topBarClock}>
              <span className={adminStyles.clockDot}></span>
              <span id="adminClock">{getCurrentTime()}</span>
            </div>

            {/* Divider */}
            <div className={adminStyles.topBarDivider}></div>

            {/* Admin Info */}
            <div className={adminStyles.topBarUser}>
              <div className={adminStyles.topBarUserInfo}>
                <span className={adminStyles.topBarUserName}>{fullName || 'Administrator'}</span>
                <span className={adminStyles.topBarUserRole}>{getRoleLabel(role)}</span>
              </div>
              <img
                src={avatar || adminAvatar}
                alt="Admin"
                className={adminStyles.topBarAvatar}
                onError={(e) => { e.target.src = adminAvatar }}
              />
            </div>
          </div>
        </header>

        {/* Content */}
        <main className={adminStyles.adminMain}>
          <Outlet />
        </main>
      </div>
    </>
  );
}

export default AdminLayout;
