// WeatherPage.jsx

import React, { useEffect, useState } from 'react';
import styles from './WeatherPage.module.css';
import WeatherCard from '../components/WeatherCard';
import DayWeatherCard from '../components/DayWeatherCard';
import WeatherMap from '../components/WeatherMap.jsx'; // 지도 컴포넌트 import
import { fetchDailyWeatherData } from '../services/weatherService';
import { convertLatLonToGrid } from '../utils/convertGrid';
import { useLocation } from '../hooks/useLocation';

const WeatherPage = () => {
  const { location, loading: locLoading, error: locError } = useLocation();
  const [futureWeatherList, setFutureWeatherList] = useState([]);

  useEffect(() => {
    if (locLoading || locError) return;
    if (!location.lat || !location.lon) return;

    const loadFutureWeather = async () => {
      const { nx, ny } = convertLatLonToGrid(location.lat, location.lon);

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
  }, [locLoading, locError, location]);

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        {/* location이 준비되었을 때만 지도 표시 */}
        {location.lat && location.lon ? (
          <WeatherMap lat={location.lat} lon={location.lon} />
        ) : (
          <p>현재 위치 정보를 불러오는 중입니다...</p>
        )}
      </div>
      <div className={styles.right}>
        {/* 오늘 날씨 */}
        <WeatherCard />

        {/* 2일차, 3일차 */}
        {futureWeatherList.map((dayData) => (
          <DayWeatherCard key={dayData.date} {...dayData} />
        ))}
      </div>
    </div>
  );
};

export default WeatherPage;
