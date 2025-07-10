import React from 'react';
import WeatherCard from '../components/WeatherCard';
import styles from './WeatherPage.module.css'; // ✅ 스타일 모듈 import

const WeatherPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <WeatherCard />
      </div>
      <div className={styles.right}>
        {/* 우측 공간, 다른 콘텐츠 들어올 자리 */}
      </div>
    </div>
  );
};

export default WeatherPage;
