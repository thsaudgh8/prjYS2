// WeatherPage.jsx

import React, { useEffect, useState } from 'react';
import styles from './WeatherPage.module.css';
import WeatherCard from '../components/WeatherCard';
import DayWeatherCard from '../components/DayWeatherCard';
import { fetchDailyWeatherData } from '../services/weatherService';
import { convertLatLonToGrid } from '../utils/convertGrid';

const WeatherPage = () => {
  const [futureWeatherList, setFutureWeatherList] = useState([]);

  const lat = 37.4979; // 예시: 강남
  const lon = 127.0276;

  useEffect(() => {
    const loadFutureWeather = async () => {
      const { nx, ny } = convertLatLonToGrid(lat, lon);
      const today = new Date();
      const dailyDates = [1, 2].map((offset) => {
        const d = new Date(today);
        d.setDate(today.getDate() + offset);
        return d.toISOString().slice(0, 10).replace(/-/g, '');
      });

      try {
        const data = await fetchDailyWeatherData(nx, ny, dailyDates);
        setFutureWeatherList(data);
      } catch (e) {
        console.error(e);
      }
    };

    loadFutureWeather();
  }, []);

  return (
    <div className={styles.container}>
      {/* 좌측 지도/검색 자리 */}
      <div className={styles.left}>
        <h3>지도 또는 검색 기능 자리</h3>
      </div>

      {/* 우측 날씨 카드들 */}
      <div className={styles.right}>
        {/* 오늘 날씨 */}
        <WeatherCard />

        {/* 내일/모레 날씨 */}
        {futureWeatherList.map((dayData) => (
          <DayWeatherCard key={dayData.date} {...dayData} />
        ))}
      </div>
    </div>
  );
};

export default WeatherPage;
