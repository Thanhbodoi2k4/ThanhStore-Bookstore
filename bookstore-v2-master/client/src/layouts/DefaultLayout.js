import { Outlet } from "react-router-dom"
import Header from "./components/Header"
import Footer from "./components/Footer"
import styles from "./Layout.module.css"
function DefaultLayout() {
    return (
        <div className={styles.defaultLayout}>
            <Header />
            <div className={styles.mainContent}>
                <Outlet />
            </div>
            <Footer />
        </div>
    )
}

export default DefaultLayout