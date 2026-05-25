import { useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { routes } from "./routes";
import logo from '../../../assets/images/logo.png'
import adminAvatar from '../../../assets/images/admin_avatar.png'
import SubMenu from "./SubMenu";

import authApi from "../../../api/authApi";
import { logout } from '../../../redux/actions/auth';
import { destroy } from "../../../redux/actions/cart"

import styles from "./AdminSideBar.module.css";

// Icons (using SVG inline for performance)
const LogoutIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
  </svg>
)

function AdminSideBar({ isOpen, onClose }) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { role, fullName, avatar } = useSelector((state) => state.auth)
  const sidebarRef = useRef(null)

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        const toggleBtn = document.querySelector('[class*="menuToggleBtn"]');
        if (toggleBtn && toggleBtn.contains(event.target)) {
          return;
        }
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleLogout = async () => {
    const resultLogout = await authApi.logout()
    console.log(resultLogout)
    dispatch(logout())
    dispatch(destroy())
    const token = localStorage.getItem('accessToken')
    if (token) {
      localStorage.removeItem('accessToken')
    }
    navigate({ pathname: '/' })
  }

  const getRoleLabel = (role) => {
    switch(role) {
      case 3: return 'ADMIN';
      case 2: return 'STAFF';
      default: return 'USER';
    }
  }

  return (
    <>
      {isOpen && <div className={styles.mobileBackdrop} onClick={onClose}></div>}
      <div ref={sidebarRef} className={`${styles.adminSideBar} ${isOpen ? styles.isOpen : ""}`}>
      {/* Logo */}
      <div className={styles.logo}>
        <Link to="/">
          <img src={logo} alt="ThanhStore Logo" />
          <span>ThanhStore</span>
        </Link>
      </div>

      {/* Admin Profile */}
      <div className={styles.adminProfile}>
        <div className={styles.adminAvatarWrapper}>
          <img
            className={styles.adminAvatar}
            src={avatar || adminAvatar}
            alt="Admin Avatar"
            onError={(e) => { e.target.src = adminAvatar }}
          />
          <span className={styles.adminOnlineIndicator}></span>
        </div>
        <div className={styles.adminInfo}>
          <p className={styles.adminName}>{fullName || 'Administrator'}</p>
          <span className={styles.adminRoleBadge}>{getRoleLabel(role)}</span>
        </div>
      </div>

      {/* Sidebar Content */}
      <div className={styles.sidebarContainer}>
        <div className={styles.sectionLabel}>Menu chính</div>
        <ul className={styles.navList}>
          {routes.map((item, index) => {
            if (item?.permissions.includes(role)) {
              return <SubMenu item={item} key={index} />;
            } else return null;
          })}
        </ul>

        {/* System Status */}
        <div className={styles.systemStatus}>
          <span className={styles.statusDot}></span>
          Hệ thống hoạt động bình thường
        </div>

        {/* Bottom Nav - Logout */}
        <ul className={styles.navListBottom}>
          <li className={styles.navItem}>
            <button className={styles.logoutBtn} onClick={handleLogout}>
              <LogoutIcon />
              <span>Đăng xuất</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
    </>
  );
}

export default AdminSideBar;
