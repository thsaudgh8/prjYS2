import React, { useEffect, useState, useRef } from 'react';
import { Card, CardContent, Typography, CircularProgress } from '@mui/material';
import { fetchTodayMinMaxTemp, fetchCurrentConditions } from '../services/weatherService';
import { useLocation } from '../hooks/useLocation.js';
import { convertLatLonToGrid, convertSkyCode } from '../utils/convertGrid';

const getTodayDate = () => {
  const now = new Date();
  return now.toISOString().slice(0, 10); // 'YYYY-MM-DD'
};

const isAfter0200 = () => {
  const now = new Date();
  return now.getHours() >= 2;
};

const WeatherCard = () => {
  const { location, loading: locLoading, error: locError } = useLocation();
  const [minTemp, setMinTemp] = useState(null);
  const [maxTemp, setMaxTemp] = useState(null);
  const [currentTemp, setCurrentTemp] = useState(null);
  const [sky, setSky] = useState(null);
  const [rain, setRain] = useState(null);
  const [loading, setLoading] = useState(true);

  const savedMaxRef = useRef(null);
  const savedMinRef = useRef(null);
  const currentDateRef = useRef(getTodayDate());

  useEffect(() => {
    if (locLoading || locError || !location.lat || !location.lon) return;

    const loadWeather = async () => {
      const todayDate = getTodayDate();
      const { nx, ny } = convertLatLonToGrid(location.lat, location.lon);

      // 날짜가 바뀌었고 02:00 이후면 새로 API 갱신
      if (currentDateRef.current !== todayDate && isAfter0200()) {
        currentDateRef.current = todayDate;
        savedMaxRef.current = null;
        savedMinRef.current = null;
      }

      const { minTemp: apiMin, maxTemp: apiMax } = await fetchTodayMinMaxTemp(nx, ny);
      const { temp: current, sky, rain } = await fetchCurrentConditions(nx, ny);

      setCurrentTemp(current);
      setSky(sky);
      setRain(rain);

      // 초기 설정
      if (savedMaxRef.current === null) savedMaxRef.current = apiMax;
      if (savedMinRef.current === null) savedMinRef.current = apiMin;

      // 현재기온이 예보보다 높으면 최고기온 업데이트
      if (current !== null) {
        if (current > savedMaxRef.current) savedMaxRef.current = current;
        if (current < savedMinRef.current) savedMinRef.current = current;
      }

      setMaxTemp(savedMaxRef.current);
      setMinTemp(savedMinRef.current);
      setLoading(false);
    };

    loadWeather();

    const interval = setInterval(loadWeather, 60 * 60 * 1000); // 1시간마다 갱신
    return () => clearInterval(interval);
  }, [location, locLoading, locError]);

  if (locLoading || loading) {
    return (
      <Card sx={{ minWidth: 275, maxWidth: 400, margin: '0 auto', mt: 4, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h5">오늘의 기온</Typography>
          <CircularProgress />
        </CardContent>
      </Card>
    );
  }

  if (locError) {
    return (
      <Card sx={{ minWidth: 275, maxWidth: 400, margin: '0 auto', mt: 4, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h5">오늘의 기온</Typography>
          <Typography color="error">{locError}</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ minWidth: 275, maxWidth: 400, margin: '0 auto', mt: 4, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>오늘의 기온</Typography>
        <Typography variant="body1" sx={{ fontSize: '1.2rem', mb: 1 }}>
          🌡️ 현재기온: <strong>{currentTemp}℃</strong>
        </Typography>
        <Typography variant="body1" sx={{ fontSize: '1.2rem', mb: 1 }}>
          🔺 최고기온: <strong>{maxTemp}℃</strong>
        </Typography>
        <Typography variant="body1" sx={{ fontSize: '1.2rem', mb: 1 }}>
          🔻 최저기온: <strong>{minTemp}℃</strong>
        </Typography>
        <Typography variant="body1" sx={{ fontSize: '1.2rem', mb: 1 }}>
          🌤️ 하늘 상태: <strong>{convertSkyCode(sky)}</strong>
        </Typography>
        <Typography variant="body1" sx={{ fontSize: '1.2rem' }}>
          🌧️ 강수량: <strong>{rain} mm</strong>
        </Typography>
      </CardContent>
    </Card>
  );
};

export default WeatherCard;
