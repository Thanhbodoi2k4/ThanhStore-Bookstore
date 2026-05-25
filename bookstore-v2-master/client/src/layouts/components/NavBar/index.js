import { memo, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';

import { FaBars, FaTimes } from 'react-icons/fa';


import styles from './NavBar.module.css';

function NavBar() {
    const location = useLocation();
    const navigate = useNavigate();

    const scrollToSection = (sectionId) => {
        if (location.pathname !== '/') {
            // Navigate to home first, then scroll
            navigate('/');
            setTimeout(() => {
                const el = document.getElementById(sectionId);
                if (el) el.scrollIntoView({ behavior: 'smooth' });
            }, 300);
        } else {
            const el = document.getElementById(sectionId);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className={`navbar ${styles.navbar}`}>
            <div className={styles.navItem}>
                <NavLink to="/" className={({isActive}) => isActive ? `${styles.active}` : null}>Trang chủ</NavLink>
            </div>
            <div className={styles.navItem}>
                <NavLink to="/san-pham" className={({isActive}) => isActive ? `${styles.active}` : null}>Sản phẩm</NavLink>
            </div>
            <div className={styles.navItem}>
                <NavLink to="/khuyen-mai" className={({isActive}) => isActive ? `${styles.active}` : null}>Khuyến mãi</NavLink>
            </div>
            <div className={styles.navItem}>
                <button type="button" className={styles.navBtn} onClick={() => scrollToSection('about')}>Giới thiệu</button>
            </div>
            <div className={styles.navItem}>
                <button type="button" className={styles.navBtn} onClick={() => scrollToSection('contact')}>Liên hệ</button>
            </div>
        </div>
    )

}

export function NavBarMobile() {

    const [show, setShow] = useState(false)
    const location = useLocation();
    const navigate = useNavigate();

    const scrollToSection = (sectionId) => {
        setShow(false);
        if (location.pathname !== '/') {
            navigate('/');
            setTimeout(() => {
                const el = document.getElementById(sectionId);
                if (el) el.scrollIntoView({ behavior: 'smooth' });
            }, 300);
        } else {
            const el = document.getElementById(sectionId);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className={`navbar ${styles.navbarMobile}`}>
            <div className={styles.iconBar} onClick={() => setShow(!show)}>{show ? <FaTimes /> : <FaBars />}</div>
            <div className={`${styles.menu} ${show && styles.active}`} onClick={() => setShow(false)}>
                <div className={styles.navItem}>
                    <NavLink to="/" className={({isActive}) => isActive ? `${styles.active}` : null}>Trang chủ</NavLink>
                </div>
                <div className={styles.navItem}>
                    <NavLink to="/san-pham" className={({isActive}) => isActive ? `${styles.active}` : null}>Sản phẩm</NavLink>
                </div>
                <div className={styles.navItem}>
                    <NavLink to="/khuyen-mai" className={({isActive}) => isActive ? `${styles.active}` : null}>Khuyến mãi</NavLink>
                </div>
                <div className={styles.navItem}>
                    <button type="button" className={styles.navBtn} onClick={() => scrollToSection('about')}>Giới thiệu</button>
                </div>
                <div className={styles.navItem}>
                    <button type="button" className={styles.navBtn} onClick={() => scrollToSection('contact')}>Liên hệ</button>
                </div>
           </div>
        </div>
    )
}

export default memo(NavBar)