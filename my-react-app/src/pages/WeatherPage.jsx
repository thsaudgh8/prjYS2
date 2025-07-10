import React, { useEffect, useState } from 'react';
import WeatherCard from '../components/WeatherCard';
import WeekWeatherCards from '../components/WeekWeatherCards';
import styles from './WeatherPage.module.css';
import { fetchDailyWeatherData } from '../services/weatherService';
import { convertLatLonToGrid } from '../utils/convertGrid';

const WeatherPage = () => {
  const [dailyWeatherList, setDailyWeatherList] = useState([]);

  // 예시 위치 좌표 (서울 강남구 등)
  const lat = 37.4979;
  const lon = 127.0276;

  useEffect(() => {
    const loadWeekWeather = async () => {
      try {
        const { nx, ny } = convertLatLonToGrid(lat, lon);

        // 오늘 날짜를 기준으로 2일 뒤까지 구함 (YYYYMMDD 형식)
        const today = new Date();
        const dailyDates = [1, 2].map((d) => {
          const date = new Date(today);
          date.setDate(today.getDate() + d);
          return date.toISOString().slice(0, 10).replace(/-/g, '');
        });

        const data = await fetchDailyWeatherData(nx, ny, dailyDates);
        setDailyWeatherList(data);
      } catch (e) {
        console.error(e);
      }
    };

    loadWeekWeather();
  }, []);

  return (
    <div className={styles.container}>
      <WeatherCard />
      <WeekWeatherCards dailyWeatherList={dailyWeatherList} />
    </div>
  );
};

export default WeatherPage;
