import React, { useState, useEffect } from 'react';
import styles from './DigitalClock.module.css';

const DigitalClock = ({ theme = 'light' }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  
  const formattedHours = hours % 12 || 12;
  const hStr = formattedHours.toString().padStart(2, '0');
  const mStr = minutes.toString().padStart(2, '0');
  const sStr = seconds.toString().padStart(2, '0');

  const isDark = theme === 'dark';

  return (
    <div className={`${styles.clockContainer} ${isDark ? styles.dark : ''}`}>
      <div className={styles.timeWrapper}>
        <span className={`${styles.digit} ${isDark ? styles.digitDark : ''}`}>{hStr}</span>
        <span className={`${styles.colon} ${isDark ? styles.colonDark : ''}`}>:</span>
        <span className={`${styles.digit} ${isDark ? styles.digitDark : ''}`}>{mStr}</span>
        <span className={`${styles.colon} ${isDark ? styles.colonDark : ''}`}>:</span>
        <div className={`${styles.secondsWrapper} ${isDark ? styles.secondsWrapperDark : ''}`}>
           <span key={sStr} className={`${styles.secondsAnimated} ${isDark ? styles.secondsAnimatedDark : ''}`}>{sStr}</span>
        </div>
        <span className={`${styles.ampm} ${isDark ? styles.ampmDark : ''}`}>{ampm}</span>
      </div>
    </div>
  );
};

export default DigitalClock;
