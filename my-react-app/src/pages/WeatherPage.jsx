import React, { useEffect, useState } from 'react';
import styles from './WeatherPage.module.css';
import WeatherCard from '../components/WeatherCard';
import DayWeatherCard from '../components/DayWeatherCard';
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
      // 오늘 포함해서 +1, +2일치 날짜 만들기
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
        <h3>지도 또는 검색 기능 자리</h3>
      </div>
      <div className={styles.right}>
        {/* 오늘 날씨는 WeatherCard에서 useLocation을 내부에서 사용 중 */}
        <WeatherCard />

        {/* 내일, 모레 날씨 */}
        {futureWeatherList.map((dayData) => (
          <DayWeatherCard key={dayData.date} {...dayData} />
        ))}
      </div>
    </div>
  );
};

export default WeatherPage;
