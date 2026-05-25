import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';
import styles from './HeroBanner.module.css';

// Import local banner images
import bannerMystical from '../../assets/images/banner_mystical.png';
import bannerGothic from '../../assets/images/banner_gothic.png';
import bannerEnchanted from '../../assets/images/banner_enchanted.png';

const slides = [
  {
    id: 1,
    title: 'Bước Vào Thế Giới\nCủa Những Trang Sách',
    subtitle: '✦ NƠI TRI THỨC VÀ MA THUẬT HỘI TỤ ✦',
    description: 'Hàng ngàn đầu sách chọn lọc đang chờ đợi bạn khám phá',
    buttonText: 'Khám phá ngay',
    buttonLink: '/san-pham',
    bgImage: bannerMystical,
    accentColor: '#c9a84c',
    accentGlow: 'rgba(201, 168, 76, 0.5)',
    theme: 'golden',
  },
  {
    id: 2,
    title: 'Tri Thức Cổ Xưa\nSoi Sáng Tương Lai',
    subtitle: '✦ THƯ VIỆN CỦA NHỮNG GIẤC MƠ ✦',
    description: 'Giảm đến 20% cho sách tài chính & kỹ năng sống',
    buttonText: 'Xem ưu đãi',
    buttonLink: '/khuyen-mai',
    bgImage: bannerGothic,
    accentColor: '#e8b86d',
    accentGlow: 'rgba(232, 184, 109, 0.5)',
    theme: 'amber',
  },
  {
    id: 3,
    title: 'Phiêu Lưu Vào\nXứ Sở Kỳ Diệu',
    subtitle: '✦ NƠI CÂU CHUYỆN BẮT ĐẦU ✦',
    description: 'Bộ sưu tập Fantasy, Manga & tiểu thuyết đặc sắc',
    buttonText: 'Bộ sưu tập',
    buttonLink: '/san-pham',
    bgImage: bannerEnchanted,
    accentColor: '#7dd3c0',
    accentGlow: 'rgba(125, 211, 192, 0.5)',
    theme: 'emerald',
  },
];

// Floating particle component
function Particles({ count = 30 }) {
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 8,
    duration: 6 + Math.random() * 10,
    size: 2 + Math.random() * 4,
    opacity: 0.2 + Math.random() * 0.5,
  }));

  return (
    <div className={styles.particlesContainer}>
      {particles.map(p => (
        <span
          key={p.id}
          className={styles.particle}
          style={{
            left: `${p.left}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            opacity: p.opacity,
          }}
        />
      ))}
    </div>
  );
}

function HeroBanner() {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const bannerRef = useRef(null);

  const goToSlide = useCallback((index) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrent(index);
    setTimeout(() => setIsTransitioning(false), 900);
  }, [isTransitioning]);

  const nextSlide = useCallback(() => {
    goToSlide((current + 1) % slides.length);
  }, [current, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide((current - 1 + slides.length) % slides.length);
  }, [current, goToSlide]);

  // Auto-play
  useEffect(() => {
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  // Parallax mouse tracking
  const handleMouseMove = useCallback((e) => {
    if (!bannerRef.current) return;
    const rect = bannerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setMousePos({ x, y });
  }, []);

  const slide = slides[current];

  return (
    <div
      className={styles.heroBanner}
      ref={bannerRef}
      onMouseMove={handleMouseMove}
    >
      {/* Ambient particles */}
      <Particles count={35} />

      {/* Mystical fog overlay */}
      <div className={styles.fogLayer}></div>
      <div className={styles.fogLayer2}></div>

      {/* Vignette */}
      <div className={styles.vignette}></div>

      {/* Magical runic border */}
      <div className={styles.runicBorderTop}></div>
      <div className={styles.runicBorderBottom}></div>

      {/* Slides */}
      {slides.map((s, index) => (
        <div
          key={s.id}
          className={`${styles.slide} ${index === current ? styles.slideActive : ''}`}
        >
          {/* Background image with parallax */}
          <div
            className={styles.slideBg}
            style={{
              backgroundImage: `url(${s.bgImage})`,
              transform: index === current
                ? `scale(1.08) translate(${mousePos.x * -8}px, ${mousePos.y * -5}px)`
                : 'scale(1.08)',
            }}
          ></div>

          {/* Dark cinematic gradient overlays */}
          <div className={styles.gradientOverlay}></div>
          <div className={styles.colorOverlay} style={{ background: `radial-gradient(ellipse at 30% 50%, ${s.accentGlow} 0%, transparent 70%)` }}></div>
        </div>
      ))}

      {/* Content (rendered once, not per-slide, for smoother transition) */}
      <div className={styles.slideContent}>
        {/* Left: Text */}
        <div className={styles.textSection}>
          {/* Decorative mystical line */}
          <div className={styles.mysticalLine}>
            <span></span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill={slide.accentColor}>
              <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8l-6.2 4.5 2.4-7.4L2 9.4h7.6z"/>
            </svg>
            <span></span>
          </div>

          <p
            className={styles.subtitle}
            style={{ color: slide.accentColor }}
            key={`sub-${current}`}
          >
            {slide.subtitle}
          </p>

          <h1
            className={styles.slideTitle}
            key={`title-${current}`}
          >
            {slide.title.split('\n').map((line, i) => (
              <span key={i} className={styles.titleLine} style={{ animationDelay: `${0.15 + i * 0.15}s` }}>
                {line}
              </span>
            ))}
          </h1>

          <p
            className={styles.description}
            key={`desc-${current}`}
          >
            {slide.description}
          </p>

          <div className={styles.ctaGroup}>
            <Link
              to={slide.buttonLink}
              className={styles.ctaButton}
              style={{
                '--accent': slide.accentColor,
                '--glow': slide.accentGlow,
              }}
            >
              <span className={styles.ctaBtnText}>{slide.buttonText}</span>
              <span className={styles.ctaArrow}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </span>
            </Link>

            <div className={styles.slideCounter}>
              <span className={styles.counterCurrent}>0{current + 1}</span>
              <span className={styles.counterDivider}>/</span>
              <span className={styles.counterTotal}>0{slides.length}</span>
            </div>
          </div>
        </div>

        {/* Right: Mystical ornament */}
        <div className={styles.ornamentSection}>
          {/* Central mystical symbol */}
          <div className={styles.mysticOrb} style={{ '--orb-color': slide.accentColor, '--orb-glow': slide.accentGlow }}>
            <div className={styles.orbRing}></div>
            <div className={styles.orbRing2}></div>
            <div className={styles.orbCore}>
              <svg viewBox="0 0 100 100" className={styles.orbSymbol}>
                <circle cx="50" cy="50" r="30" fill="none" stroke={slide.accentColor} strokeWidth="0.5" opacity="0.6"/>
                <circle cx="50" cy="50" r="20" fill="none" stroke={slide.accentColor} strokeWidth="0.3" opacity="0.4"/>
                <path d="M50 20 L50 80 M20 50 L80 50" stroke={slide.accentColor} strokeWidth="0.3" opacity="0.3"/>
                <path d="M50 10 L53 47 L50 50 L47 47 Z" fill={slide.accentColor} opacity="0.5"/>
                <path d="M50 90 L53 53 L50 50 L47 53 Z" fill={slide.accentColor} opacity="0.5"/>
                <path d="M10 50 L47 53 L50 50 L47 47 Z" fill={slide.accentColor} opacity="0.5"/>
                <path d="M90 50 L53 53 L50 50 L53 47 Z" fill={slide.accentColor} opacity="0.5"/>
              </svg>
            </div>
          </div>

          {/* Floating rune circles */}
          <div className={styles.runeFloat} style={{ '--r-delay': '0s', '--r-x': '70%', '--r-y': '20%' }}>✦</div>
          <div className={styles.runeFloat} style={{ '--r-delay': '1.5s', '--r-x': '20%', '--r-y': '75%' }}>◈</div>
          <div className={styles.runeFloat} style={{ '--r-delay': '3s', '--r-x': '85%', '--r-y': '70%' }}>✧</div>
          <div className={styles.runeFloat} style={{ '--r-delay': '4.5s', '--r-x': '30%', '--r-y': '25%' }}>◆</div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        className={`${styles.arrow} ${styles.arrowLeft}`}
        onClick={prevSlide}
        aria-label="Previous"
        style={{ '--arrow-accent': slide.accentColor }}
      >
        <IoChevronBack />
      </button>
      <button
        className={`${styles.arrow} ${styles.arrowRight}`}
        onClick={nextSlide}
        aria-label="Next"
        style={{ '--arrow-accent': slide.accentColor }}
      >
        <IoChevronForward />
      </button>

      {/* Bottom progress dots */}
      <div className={styles.dotsContainer}>
        {slides.map((s, index) => (
          <button
            key={index}
            className={`${styles.dot} ${index === current ? styles.dotActive : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Slide ${index + 1}`}
            style={{ '--dot-accent': s.accentColor }}
          >
            {index === current && <span className={styles.dotProgress} style={{ background: s.accentColor }}></span>}
          </button>
        ))}
      </div>
    </div>
  );
}

export default HeroBanner;
