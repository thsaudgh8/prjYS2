// WeatherPage.jsx

import React, { useEffect, useState } from 'react';
import styles from './WeatherPage.module.css';
import WeatherCard from '../components/WeatherCard';
import DayWeatherCard from '../components/DayWeatherCard';
import WeatherMap from '../components/WeatherMap.jsx';
import { fetchDailyWeatherData } from '../services/weatherService';
import { convertLatLonToGrid } from '../utils/convertGrid';
import { useLocation } from '../hooks/useLocation';

const WeatherPage = () => {
  const { location: initialLocation, loading: locLoading, error: locError } = useLocation();

  const [location, setLocation] = useState(null); // 현재 또는 검색 위치
  const [futureWeatherList, setFutureWeatherList] = useState([]);
  const [searchText, setSearchText] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 초기 위치 설정
  useEffect(() => {
    if (!locLoading && !locError && initialLocation?.lat && initialLocation?.lon) {
      setLocation(initialLocation);
    }
  }, [locLoading, locError, initialLocation]);

  // 날씨 데이터 불러오기
  useEffect(() => {
    if (!location?.lat || !location?.lon) return;

    const loadFutureWeather = async () => {
      setLoading(true);
      setError(null);

      try {
        const { nx, ny } = convertLatLonToGrid(location.lat, location.lon);

        const today = new Date();
        const dailyDates = [1, 2].map((offset) => {
          const d = new Date(today);
          d.setDate(today.getDate() + offset);
          return d.toISOString().slice(0, 10).replace(/-/g, '');
        });

        const data = await fetchDailyWeatherData(nx, ny, dailyDates);
        setFutureWeatherList(data);
      } catch (e) {
        setError('날씨 정보를 불러오는 중 오류가 발생했습니다.');
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    loadFutureWeather();
  }, [location]);

  // 검색 처리
  const handleSearch = () => {
    if (!searchText.trim()) return;

    const ps = new window.kakao.maps.services.Places();
    ps.keywordSearch(searchText, (result, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        const first = result[0];
        const lat = parseFloat(first.y);
        const lon = parseFloat(first.x);

        setLocation({ lat, lon });
      } else {
        alert('검색 결과가 없어요!');
      }
    });
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // 로딩 중
  if (locLoading || loading) {
    return (
      <div className={styles.container}>
        <p style={{ margin: 'auto', fontSize: 18 }}>로딩 중입니다...</p>
      </div>
    );
  }

  // 위치 정보 오류
  if (locError) {
    return (
      <div className={styles.container}>
        <p style={{ margin: 'auto', color: 'red', fontSize: 18 }}>
          위치 정보를 불러오는 데 실패했습니다: {locError}
        </p>
      </div>
    );
  }

  // 날씨 데이터 오류
  if (error) {
    return (
      <div className={styles.container}>
        <p style={{ margin: 'auto', color: 'red', fontSize: 18 }}>{error}</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        {/* 검색창 */}
        <input
          type="text"
          placeholder="장소 검색"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyDown={handleSearchKeyDown}
          style={{
            width: '100%',
            padding: '8px',
            marginBottom: '12px',
            fontSize: '16px',
            boxSizing: 'border-box',
          }}
        />

        {/* 지도 */}
        {location?.lat && location?.lon ? (
          <WeatherMap lat={location.lat} lon={location.lon} />
        ) : (
          <p>현재 위치 정보를 불러오는 중입니다...</p>
        )}
      </div>

      <div className={styles.right}>
        {/* 오늘 날씨 */}
        {location && <WeatherCard location={location} />}

        {/* 2,3일차 예보 */}
        {futureWeatherList.map((dayData) => (
          <DayWeatherCard key={dayData.date} {...dayData} />
        ))}
      </div>
    </div>
  );
};

export default WeatherPage;
