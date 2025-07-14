import React, { useEffect, useState } from 'react';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import styles from './WeatherPage.module.css';
import WeatherCard from '../components/WeatherCard';
import DayWeatherCard from '../components/DayWeatherCard';
import WeatherMap from '../components/WeatherMap.jsx';
import { fetchMinMaxTemp, fetchLatestWeatherConditions, fetchDailyWeatherData } from '../services/weatherService';
import { convertLatLonToGrid } from '../utils/convertGrid';
import { useLocation } from '../hooks/useLocation';

const WeatherPage = () => {
  const { location: initialLocation, loading: locLoading, error: locError } = useLocation();

  const [location, setLocation] = useState(null);
  const [todayWeather, setTodayWeather] = useState(null); // 오늘 날씨 데이터 (최고/최저 + 최신상태)
  const [futureWeatherList, setFutureWeatherList] = useState([]); // 2~3일차 예보
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 초기 위치 설정
  useEffect(() => {
    if (!locLoading && !locError && initialLocation?.lat && initialLocation?.lon) {
      setLocation(initialLocation);
    }
  }, [locLoading, locError, initialLocation]);

  // 날씨 데이터 불러오기 (location 변경 시)
  useEffect(() => {
    if (!location?.lat || !location?.lon) return;

    const loadWeatherData = async () => {
      setLoading(true);
      setError(null);

      try {
        const { nx, ny } = convertLatLonToGrid(location.lat, location.lon);

        // 오늘 날짜, 내일, 모레 날짜 (yyyymmdd)
        const today = new Date();
        const todayStr = today.toISOString().slice(0, 10).replace(/-/g, '');

        const dailyDates = [1, 2].map(offset => {
          const d = new Date(today);
          d.setDate(today.getDate() + offset);
          return d.toISOString().slice(0, 10).replace(/-/g, '');
        });

        // 오늘 최고/최저 기온 + 최신 상태 (POP, PTY, SKY)
        const [minMaxTemp, latestConditions, dailyData] = await Promise.all([
          fetchMinMaxTemp(nx, ny),
          fetchLatestWeatherConditions(nx, ny),
          fetchDailyWeatherData(nx, ny, dailyDates),
        ]);

        setTodayWeather({
          date: todayStr,
          maxTemp: minMaxTemp.maxTemp,
          minTemp: minMaxTemp.minTemp,
          ...latestConditions,
        });

        setFutureWeatherList(dailyData);
      } catch (e) {
        setError(e.message || '날씨 데이터를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadWeatherData();
  }, [location]);

  // 검색 함수
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
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        {/* MUI 검색창 */}
        <TextField
          fullWidth
          variant="outlined"
          placeholder="장소 검색"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSearch();
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleSearch} edge="end" aria-label="search">
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />

        {/* 지도 */}
        {location?.lat && location?.lon ? (
          <WeatherMap lat={location.lat} lon={location.lon} />
        ) : (
          <p>현재 위치 정보를 불러오는 중입니다...</p>
        )}
      </div>

      <div className={styles.right}>
        {/* 오늘 날씨 카드 */}
        {loading && <p>오늘 날씨 불러오는 중...</p>}
        {error && <p style={{ color: 'red' }}>에러: {error}</p>}
        {todayWeather && !loading && !error && <WeatherCard weatherData={todayWeather} />}

        {/* 미래 예보 카드 */}
        {futureWeatherList.map(day => (
          <DayWeatherCard key={day.date} {...day} />
        ))}
      </div>
    </div>
  );
};

export default WeatherPage;
