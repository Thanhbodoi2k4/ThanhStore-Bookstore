import { Container, Row, Col } from "react-bootstrap";
import BookItem from "../../components/Shop/BookItem";
import HeroBanner from "../../components/HeroBanner";
import DigitalClock from "../../components/DigitalClock";
import GoddessCanvas from "../../components/GoddessCanvas";
import bookApi from "../../api/bookApi";
import { useEffect, useState, useRef } from "react";
import styles from './Home.module.css'
import Loading from "../../components/Loading"
import { Link } from "react-router-dom";
import { 
  IoBookOutline, IoHeartOutline, IoRocketOutline, 
  IoLocationOutline, IoCallOutline, IoMailOutline, 
  IoTimeOutline, IoShieldCheckmarkOutline, IoStarOutline,
  IoLeafOutline, IoGiftOutline, IoDiamondOutline,
  IoStar, IoStarHalf
} from "react-icons/io5";

function Home() {
  const [books, setBooks] = useState([])
  const [featuredBooks, setFeaturedBooks] = useState([])
  const [visibleSections, setVisibleSections] = useState({})
  const sectionRefs = useRef({})

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [booksRes, featuredRes] = await Promise.all([
          bookApi.getAll({page: 1, limit: 25}),
          bookApi.getAll({query: { isFeatured: true }, limit: 12})
        ])
        setBooks(booksRes.data)
        setFeaturedBooks(featuredRes.data)
      } catch (error) {
        console.log(error)
      }
    }
    fetchData()
  }, [])

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setVisibleSections(prev => ({ ...prev, [entry.target.id]: true }))
          }
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    )

    const sections = document.querySelectorAll('[data-animate]')
    sections.forEach(section => observer.observe(section))

    return () => observer.disconnect()
  }, [])
  
  return (
    <div className={styles.pageWrapper}>
      {/* Hero Banner */}
      <HeroBanner />

      {/* Features Strip */}
      <section className={styles.featuresStrip}>
        <Container fluid className={styles.productsContainer}>
          <div className={styles.featuresGrid}>
            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>
                <IoRocketOutline />
              </div>
              <div>
                <h4>Giao hàng siêu tốc</h4>
                <p>Miễn phí từ 300K</p>
              </div>
            </div>
            <div className={styles.featureDivider}></div>
            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>
                <IoShieldCheckmarkOutline />
              </div>
              <div>
                <h4>Cam kết chính hãng</h4>
                <p>100% bản quyền</p>
              </div>
            </div>
            <div className={styles.featureDivider}></div>
            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>
                <IoGiftOutline />
              </div>
              <div>
                <h4>Quà tặng hấp dẫn</h4>
                <p>Bookmark & bọc sách miễn phí</p>
              </div>
            </div>
            <div className={styles.featureDivider}></div>
            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>
                <IoHeartOutline />
              </div>
              <div>
                <h4>Đổi trả dễ dàng</h4>
                <p>Trong vòng 7 ngày</p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ====== Luxury Clock Banner ====== */}
      <div className={styles.clockBanner}>
        <div className={styles.clockBannerInner}>
          {/* Decorative floating orbs */}
          <div className={styles.orb} style={{top: '20%', left: '5%', width: '80px', height: '80px', animationDelay: '0s'}}></div>
          <div className={styles.orb} style={{top: '60%', left: '2%', width: '50px', height: '50px', animationDelay: '1.2s'}}></div>
          <div className={styles.orb} style={{top: '15%', right: '4%', width: '65px', height: '65px', animationDelay: '0.6s'}}></div>
          <div className={styles.orb} style={{bottom: '15%', right: '8%', width: '40px', height: '40px', animationDelay: '2s'}}></div>

          {/* Left wing decoration */}
          <div className={styles.clockWing}>
            <div className={styles.wingLine}></div>
            <div className={styles.wingDiamond}></div>
            <div className={styles.wingLine}></div>
          </div>

          {/* Clock Center */}
          <div className={styles.clockCenterBlock}>
            <p className={styles.clockLabel}>✦ THỜI GIAN HIỆN TẠI ✦</p>
            <DigitalClock theme="dark" />
            <p className={styles.clockSub}>Mỗi giây trôi qua là một trang sách bạn chưa đọc</p>
          </div>

          {/* Right wing decoration */}
          <div className={styles.clockWing}>
            <div className={styles.wingLine}></div>
            <div className={styles.wingDiamond}></div>
            <div className={styles.wingLine}></div>
          </div>
        </div>
      </div>

      {/* Featured Products Section */}
      <section className={styles.productsSection} id="featured-section" data-animate style={{paddingTop: '60px', paddingBottom: '40px', background: 'white'}}>
        <Container>
          <div className={`${styles.sectionHeader} ${visibleSections['featured-section'] ? styles.animateIn : ''}`}>
            <span className={styles.sectionTag}>TUYỂN CHỌN</span>
            <h2 className={styles.sectionTitle}>Sản phẩm nổi bật</h2>
            <p className={styles.sectionSubtitle}>
              Những tác phẩm tinh hoa, kinh điển và được yêu thích nhất tại ThanhStore
            </p>
            <div className={styles.titleDecor}>
              <span></span><IoStarOutline /><span></span>
            </div>
          </div>
          <div className={`${styles.booksList} ${visibleSections['featured-section'] ? styles.animateIn : ''}`}>
            <div className={styles.booksGrid}>
              {featuredBooks && featuredBooks.length > 0 ? (
                 featuredBooks.map(book => 
                  <div key={book._id} className={styles.bookGridItem}>
                    <BookItem data={book} />
                  </div>)
              ) : <Loading />}
            </div>
          </div>
        </Container>
      </section>

      {/* Products Section */}
      <section className={styles.productsSection} id="products-section" data-animate>
        <Container>
          <div className={`${styles.sectionHeader} ${visibleSections['products-section'] ? styles.animateIn : ''}`}>
            <span className={styles.sectionTag}>BỘ SƯU TẬP</span>
            <h2 className={styles.sectionTitle}>Sản phẩm mới nhất</h2>
            <p className={styles.sectionSubtitle}>
              Khám phá những cuốn sách được yêu thích nhất — được chúng tôi chọn lọc kỹ lưỡng cho bạn
            </p>
            <div className={styles.titleDecor}>
              <span></span><IoLeafOutline /><span></span>
            </div>
          </div>
          <div className={`${styles.booksList} ${visibleSections['products-section'] ? styles.animateIn : ''}`}>
            <div className={styles.booksGrid}>
              {books && books.length > 0 ? (
                 books.map(book => 
                  <div key={book._id} className={styles.bookGridItem}>
                    <BookItem data={book} />
                  </div>)
              ) : <Loading />}
            </div>
          </div>
          <div className={styles.viewAllWrapper}>
            <Link to="/san-pham" className={styles.viewAllBtn}>
              <span>Khám phá toàn bộ bộ sưu tập</span>
              <span className={styles.btnArrow}>→</span>
            </Link>
          </div>
        </Container>
      </section>

      {/* About Section — Extended & Luxurious */}
      <section className={styles.aboutSection} id="about" data-animate>
        <div className={styles.aboutBgDecor}></div>
        <Container>
          <div className={`${styles.sectionHeader} ${visibleSections['about'] ? styles.animateIn : ''}`}>
            <span className={styles.sectionTag}>CÂU CHUYỆN CỦA CHÚNG TÔI</span>
            <h2 className={styles.sectionTitle}>Về ThanhStore</h2>
            <p className={styles.sectionSubtitle}>
              Hơn cả một hiệu sách — chúng tôi là nơi kết nối tri thức, cảm hứng và cộng đồng
            </p>
            <div className={styles.titleDecor}>
              <span></span><IoDiamondOutline /><span></span>
            </div>
          </div>

          {/* Luxury Store Showcase */}
          <div className={`${styles.storeShowcase} ${visibleSections['about'] ? styles.animateIn : ''}`}>
            <GoddessCanvas />
            <div className={styles.showcaseCaption}>
              <p>✦ Không gian đọc sách sang trọng tại ThanhStore — nơi mỗi cuốn sách được trưng bày như một tác phẩm nghệ thuật ✦</p>
            </div>
          </div>

          {/* About Content — Two columns */}
          <Row className={`align-items-stretch ${styles.aboutMainRow}`}>
            <Col xl={6} lg={6} xs={12}>
              <div className={`${styles.aboutContent} ${visibleSections['about'] ? styles.animateSlideRight : ''}`}>
                <h3 className={styles.aboutHeading}>
                  Nơi lan tỏa <span className={styles.highlight}>tri thức</span><br/>
                  và <span className={styles.highlight}>cảm hứng</span> sống
                </h3>
                <p className={styles.aboutText}>
                  <strong>ThanhStore</strong> được thành lập với sứ mệnh mang đến cho bạn đọc Việt Nam 
                  những cuốn sách chất lượng nhất. Chúng tôi tin rằng mỗi cuốn sách 
                  đều có sức mạnh thay đổi cuộc đời, mở ra cánh cửa đến những thế giới mới 
                  và truyền cảm hứng cho hàng triệu tâm hồn.
                </p>
                <p className={styles.aboutText}>
                  Từ những trang văn học kinh điển đến sách phát triển bản thân, kỹ năng 
                  kinh doanh, công nghệ thông tin hay sách thiếu nhi — mỗi đầu sách tại 
                  ThanhStore đều được <em>lựa chọn kỹ lưỡng</em> bởi đội ngũ chuyên gia 
                  am hiểu và tâm huyết với nghề.
                </p>
                <p className={styles.aboutText}>
                  Với không gian cửa hàng được thiết kế theo phong cách hiện đại, ấm cúng 
                  cùng dịch vụ khách hàng tận tâm, chúng tôi mong muốn ThanhStore trở thành 
                  điểm đến quen thuộc cho mọi người yêu sách trên khắp Việt Nam.
                </p>
                
                <div className={styles.aboutQuote}>
                  <blockquote>
                    "Sách là ngọn đèn soi sáng tâm hồn, là người bạn đồng hành trên mọi chặng đường cuộc đời."
                  </blockquote>
                  <cite>— Triết lý ThanhStore</cite>
                </div>
              </div>
            </Col>
            <Col xl={6} lg={6} xs={12}>
              <div className={`${styles.aboutCardsGrid} ${visibleSections['about'] ? styles.animateSlideLeft : ''}`}>
                <div className={styles.aboutCard}>
                  <div className={`${styles.aboutCardIcon} ${styles.iconGreen}`}>
                    <IoBookOutline />
                  </div>
                  <h4>Chọn lọc kỹ càng</h4>
                  <p>Mỗi cuốn sách đều được đội ngũ chuyên gia lựa chọn kỹ lưỡng về nội dung, chất lượng in ấn và giá trị tri thức mang lại.</p>
                </div>
                <div className={styles.aboutCard}>
                  <div className={`${styles.aboutCardIcon} ${styles.iconPurple}`}>
                    <IoHeartOutline />
                  </div>
                  <h4>Tận tâm phục vụ</h4>
                  <p>Đội ngũ chăm sóc khách hàng chuyên nghiệp, luôn sẵn sàng tư vấn và hỗ trợ bạn 7 ngày trong tuần.</p>
                </div>
                <div className={styles.aboutCard}>
                  <div className={`${styles.aboutCardIcon} ${styles.iconBlue}`}>
                    <IoRocketOutline />
                  </div>
                  <h4>Giao hàng toàn quốc</h4>
                  <p>Hệ thống logistics đối tác phủ rộng 63 tỉnh thành, miễn phí vận chuyển cho đơn hàng từ 300.000đ.</p>
                </div>
                <div className={styles.aboutCard}>
                  <div className={`${styles.aboutCardIcon} ${styles.iconGold}`}>
                    <IoShieldCheckmarkOutline />
                  </div>
                  <h4>Bảo đảm chất lượng</h4>
                  <p>100% sách chính hãng, có hóa đơn đầy đủ. Cam kết đổi trả trong 7 ngày nếu sách lỗi.</p>
                </div>
              </div>
            </Col>
          </Row>

          {/* Stats — Extended */}
          <div className={`${styles.statsBar} ${visibleSections['about'] ? styles.animateIn : ''}`}>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>1,000+</span>
              <span className={styles.statLabel}>Đầu sách</span>
              <span className={styles.statDesc}>Đa dạng thể loại</span>
            </div>
            <div className={styles.statDivider}></div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>5,000+</span>
              <span className={styles.statLabel}>Khách hàng</span>
              <span className={styles.statDesc}>Tin tưởng lựa chọn</span>
            </div>
            <div className={styles.statDivider}></div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>10,000+</span>
              <span className={styles.statLabel}>Đơn hàng</span>
              <span className={styles.statDesc}>Đã giao thành công</span>
            </div>
            <div className={styles.statDivider}></div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>99%</span>
              <span className={styles.statLabel}>Hài lòng</span>
              <span className={styles.statDesc}>Đánh giá 5 sao</span>
            </div>
          </div>
        </Container>
      </section>

      {/* Testimonials Section */}
      <section className={styles.testimonialSection} id="testimonials" data-animate>
        <Container>
          <div className={`${styles.sectionHeader} ${visibleSections['testimonials'] ? styles.animateIn : ''}`}>
            <span className={styles.sectionTag}>PHẢN HỒI KHÁCH HÀNG</span>
            <h2 className={styles.sectionTitle}>Khách hàng nói gì về chúng tôi</h2>
            <p className={styles.sectionSubtitle}>
              Niềm tin và sự hài lòng của khách hàng là động lực để chúng tôi không ngừng phát triển
            </p>
            <div className={styles.titleDecor}>
              <span></span><IoStarOutline /><span></span>
            </div>
          </div>
          <Row className={visibleSections['testimonials'] ? styles.animateIn : ''}>
            <Col xl={4} lg={4} md={6} xs={12}>
              <div className={styles.testimonialCard}>
                <div className={styles.testimonialStars}>
                  <IoStar /><IoStar /><IoStar /><IoStar /><IoStar />
                </div>
                <p className={styles.testimonialText}>
                  "Sách đóng gói rất cẩn thận, giao hàng nhanh. Tôi đặc biệt ấn tượng với bộ sưu tập 
                  văn học kinh điển ở đây — rất phong phú và giá cả hợp lý. Chắc chắn sẽ quay lại mua thêm!"
                </p>
                <div className={styles.testimonialAuthor}>
                  <div className={styles.authorAvatar}>NT</div>
                  <div>
                    <h5>Nguyễn Thu Hà</h5>
                    <span>Khách hàng thân thiết</span>
                  </div>
                </div>
              </div>
            </Col>
            <Col xl={4} lg={4} md={6} xs={12}>
              <div className={`${styles.testimonialCard} ${styles.testimonialCardFeatured}`}>
                <div className={styles.testimonialStars}>
                  <IoStar /><IoStar /><IoStar /><IoStar /><IoStar />
                </div>
                <p className={styles.testimonialText}>
                  "Là một người mê sách, tôi đã thử nhiều hiệu sách online. ThanhStore thực sự nổi bật 
                  với chất lượng dịch vụ và sự tận tâm. Đặc biệt, đội ngũ tư vấn rất am hiểu sách và 
                  luôn gợi ý chính xác những gì tôi cần!"
                </p>
                <div className={styles.testimonialAuthor}>
                  <div className={styles.authorAvatar}>TM</div>
                  <div>
                    <h5>Trần Minh Đức</h5>
                    <span>Book Blogger</span>
                  </div>
                </div>
              </div>
            </Col>
            <Col xl={4} lg={4} md={12} xs={12}>
              <div className={styles.testimonialCard}>
                <div className={styles.testimonialStars}>
                  <IoStar /><IoStar /><IoStar /><IoStar /><IoStarHalf />
                </div>
                <p className={styles.testimonialText}>
                  "Mua sách làm quà tặng sinh nhật cho bạn bè, được tặng kèm bookmark rất xinh. 
                  Giao diện web dễ sử dụng, thanh toán nhanh gọn. Rất hài lòng với trải nghiệm mua sắm tại ThanhStore!"
                </p>
                <div className={styles.testimonialAuthor}>
                  <div className={styles.authorAvatar}>PL</div>
                  <div>
                    <h5>Phạm Lan Anh</h5>
                    <span>Giáo viên — Hà Nội</span>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Contact & Map Section */}
      <section className={styles.contactSection} id="contact" data-animate>
        <Container>
          <div className={`${styles.sectionHeader} ${visibleSections['contact'] ? styles.animateIn : ''}`}>
            <span className={styles.sectionTag}>KẾT NỐI</span>
            <h2 className={styles.sectionTitle}>Liên hệ với chúng tôi</h2>
            <p className={styles.sectionSubtitle}>
              Bạn có câu hỏi, góp ý hay cần hỗ trợ? Hãy liên hệ với ThanhStore — chúng tôi luôn lắng nghe bạn
            </p>
            <div className={styles.titleDecor}>
              <span></span><IoMailOutline /><span></span>
            </div>
          </div>
          <Row className={visibleSections['contact'] ? styles.animateIn : ''}>
            <Col xl={5} lg={5} xs={12}>
              <div className={styles.contactInfo}>
                <div className={styles.contactCard}>
                  <div className={`${styles.contactIconWrapper} ${styles.iconGreen}`}>
                    <IoLocationOutline />
                  </div>
                  <div>
                    <h4>Địa chỉ cửa hàng</h4>
                    <p>Nhà số 4, Ngõ 7, Đường 6<br/>Thôn 6, Xã Hát Môn<br/>Phúc Thọ, Hà Nội</p>
                  </div>
                </div>
                <div className={styles.contactCard}>
                  <div className={`${styles.contactIconWrapper} ${styles.iconBlue}`}>
                    <IoCallOutline />
                  </div>
                  <div>
                    <h4>Hotline hỗ trợ</h4>
                    <p>0123 456 789<br/><small>Gọi miễn phí tư vấn</small></p>
                  </div>
                </div>
                <div className={styles.contactCard}>
                  <div className={`${styles.contactIconWrapper} ${styles.iconPurple}`}>
                    <IoMailOutline />
                  </div>
                  <div>
                    <h4>Email liên hệ</h4>
                    <p>thanhtore@gmail.com<br/><small>Phản hồi trong 24h</small></p>
                  </div>
                </div>
                <div className={styles.contactCard}>
                  <div className={`${styles.contactIconWrapper} ${styles.iconGold}`}>
                    <IoTimeOutline />
                  </div>
                  <div>
                    <h4>Giờ hoạt động</h4>
                    <p>Thứ 2 – Thứ 7: 8:00 – 21:00<br/>Chủ nhật: 9:00 – 18:00</p>
                  </div>
                </div>
              </div>
            </Col>
            <Col xl={7} lg={7} xs={12}>
              <div className={styles.mapWrapper}>
                <iframe
                  title="ThanhStore Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3720.0!2d105.6847!3d21.1456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31345cb3c20c61e7%3A0x4e66400f6fa92ed5!2zSMOhdCBNw7RuLCBQaMO6YyBUaOG7jSwgSMOgIE7hu5lp!5e0!3m2!1svi!2svn!4v1700000000000!5m2!1svi!2svn"
                  width="100%"
                  height="100%"
                  style={{ border: 0, borderRadius: '20px' }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Newsletter CTA */}
      <section className={styles.newsletterSection}>
        <Container>
          <div className={styles.newsletterInner}>
            <div className={styles.newsletterContent}>
              <IoBookOutline className={styles.newsletterIcon} />
              <h3>Đăng ký nhận tin từ ThanhStore</h3>
              <p>Nhận ngay thông tin sách mới, ưu đãi đặc biệt và mã giảm giá độc quyền mỗi tuần</p>
              <div className={styles.newsletterForm}>
                <input type="email" placeholder="Nhập email của bạn..." />
                <button>Đăng ký ngay</button>
              </div>
              <small>🔒 Chúng tôi cam kết không spam. Bạn có thể hủy đăng ký bất kỳ lúc nào.</small>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}

export default Home;
