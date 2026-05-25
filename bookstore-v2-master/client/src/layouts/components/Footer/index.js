import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

import { IoPaperPlane, IoLogoFacebook, IoLogoYoutube, IoLogoInstagram } from "react-icons/io5";

import styles from "./Footer.module.css";
function Footer() {
  return (
    <footer className={styles.footer}>
      <Container>
        <div className={styles.footerMain}>
          <Row>
            <Col xl={3} xs={12}>
              <div className={styles.footerGroup}>
                <Link to='/'><h1 className={styles.bookstoreHighlight}>ThanhStore</h1></Link>
                <p>Nhà số 4, Ngõ 7, Đường 6, Thôn 6, Xã Hát Môn, Phúc Thọ, Hà Nội</p>
                <p>📧 thanhtore@gmail.com</p>
                <p>📞 0123 456 789</p>
              </div>
            </Col>
            <Col xl={6} xs={12}>
              <div className={styles.footerGroup}>
                  <Row>
                    <Col xl={4} xs={6}>
                      <div className={styles.footerBoxLink}>
                          <p className={styles.title}>SẢN PHẨM</p>
                          <Link to="/san-pham/the-loai/van-hoc">Văn học</Link>
                          <Link to="/san-pham/the-loai/tam-ly-ky-nang-song">Tâm lý - Kỹ năng sống</Link>
                          <Link to="/san-pham/the-loai/cong-nghe-thong-tin">Công nghệ thông tin</Link>
                          <Link to="/san-pham/the-loai/kinh-te">Kinh tế</Link>
                          <Link to="/san-pham/the-loai/sach-giao-khoa">Sách giáo khoa</Link>
                      </div>
                    </Col>
                    <Col xl={4} xs={4} className={styles.cateList}>
                      <div className={styles.footerBoxLink}>
                          <p className={styles.title}>DANH MỤC</p>
                          <Link to="/">Trang chủ</Link>
                          <Link to="/">Giới thiệu</Link>
                          <Link to="/lien-he">Liên hệ</Link>
                          <Link to="/">Danh mục sản phẩm</Link>
                      </div>
                    </Col>
                    <Col xl={4} xs={6}>
                      <div className={styles.footerBoxLink}>
                          <p className={styles.title}>CHÍNH SÁCH</p>
                          <Link to="/chinh-sach/doi-tra">Chính sách đổi trả</Link>
                          <Link to="/chinh-sach/van-chuyen">Chính sách vận chuyển</Link>
                          <Link to="/chinh-sach/bao-mat">Bảo mật thông tin</Link>
                      </div>
                    </Col>
                  </Row>
              </div>
            </Col>
            <Col xl={3} xs={12}>
              <div className={styles.footerGroup}>
                <p className={styles.title}>ĐĂNG KÝ NHẬN TIN</p>
                <p>Nhận thông tin sách mới và ưu đãi đặc biệt từ chúng tôi.</p>
                <div className={`form-group ${styles.formGroup}`}>
                  <input type="text" placeholder="Nhập email của bạn..." />
                  <button className={`bookstore-btn ${styles.subscribeBtn}`}><IoPaperPlane /></button>
                </div>
                <div className={styles.boxSocial}>
                  <button className={`bookstore-btn ${styles.bookstoreBtn}`}><IoLogoFacebook /></button>
                  <button className={`bookstore-btn ${styles.bookstoreBtn}`}><IoLogoYoutube /></button>
                  <button className={`bookstore-btn ${styles.bookstoreBtn}`}><IoLogoInstagram /></button>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </Container>
      <div className={styles.footerBottom}>
        <Container>
          <p>© 2026 ThanhStore. Được xây dựng bởi <strong>Nguyễn Đình Thanh</strong>.</p>
        </Container>
      </div>
    </footer>
  );
}

export default Footer;
