import React, { useEffect, useState } from 'react';
import { TextField, InputAdornment, IconButton, CircularProgress, Box } from '@mui/material';
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
  const [todayWeather, setTodayWeather] = useState(null);
  const [futureWeatherList, setFutureWeatherList] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!locLoading && !locError && initialLocation?.lat && initialLocation?.lon) {
      setLocation(initialLocation);
    }
  }, [locLoading, locError, initialLocation]);

  useEffect(() => {
    if (!location?.lat || !location?.lon) return;

    const loadWeatherData = async () => {
      setLoading(true);
      setError(null);

      try {
        const { nx, ny } = convertLatLonToGrid(location.lat, location.lon);

        const today = new Date();
        const todayStr = today.toISOString().slice(0, 10).replace(/-/g, '');

        // ✅ 오늘 + 내일 + 모레 날짜 포함
        const dailyDates = [0, 1, 2].map(offset => {
          const d = new Date(today);
          d.setDate(today.getDate() + offset);
          return d.toISOString().slice(0, 10).replace(/-/g, '');
        });

        const [minMaxTemp, latestConditions, dailyData] = await Promise.all([
          fetchMinMaxTemp(nx, ny),
          fetchLatestWeatherConditions(nx, ny),
          fetchDailyWeatherData(nx, ny, dailyDates),
        ]);

        // ✅ 오늘 데이터 추출
        const todayDaily = dailyData.find(d => d.date === todayStr);

        setTodayWeather({
          date: todayStr,
          maxTemp: minMaxTemp.maxTemp,
          minTemp: minMaxTemp.minTemp,
          pop: todayDaily?.popAm ?? latestConditions.pop, // 오전 강수확률 우선
          pty: todayDaily?.pty ?? latestConditions.pty,   // 하루 대표 pty 우선
          sky: todayDaily?.sky ?? latestConditions.sky,
          rain: todayDaily?.pty ?? latestConditions.pty,  // rain도 pty 기준으로
          popAm: todayDaily?.popAm,
          popPm: todayDaily?.popPm,
        });


        // ✅ 오늘 제외한 미래 날씨만 따로 뽑기
        const future = dailyData.filter(d => d.date !== todayStr);
        setFutureWeatherList(future);
      } catch (e) {
        setError(e.message || '날씨 데이터를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadWeatherData();
  }, [location]);



  const handleSearch = () => {
    if (!searchText.trim()) return;
    console.log("🔍 검색어:", searchText);

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

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="장소 검색"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
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

        {location?.lat && location?.lon ? (
          <WeatherMap lat={location.lat} lon={location.lon} />
        ) : (
          <p>현재 위치 정보를 불러오는 중입니다...</p>
        )}
      </div>

      <div className={styles.right}>
        {loading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '400px', justifyContent: 'center' }}>
            <CircularProgress size={60} thickness={5} />
            <p style={{ marginTop: '1rem' }}>날씨 데이터를 불러오는 중이에요...</p>
          </Box>
        ) : error ? (
          <p style={{ color: 'red' }}>에러: {error}</p>
        ) : (
          <>
            {todayWeather && <WeatherCard weatherData={todayWeather} />}
            {futureWeatherList.map(day => (
              <DayWeatherCard key={day.date} {...day} />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default WeatherPage
