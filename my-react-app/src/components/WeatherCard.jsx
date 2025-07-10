// WeatherCard.jsx

import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Box,
  Divider,
} from '@mui/material';
import { useLocation } from '../hooks/useLocation';
import { convertLatLonToGrid } from '../utils/convertGrid';
import { fetchMinMaxTemp, fetchLatestWeatherConditions } from '../services/weatherService';
import WeatherIcon from './WeatherIcon';

const convertPtyToText = (pty) => {
  switch (Number(pty)) {
    case 0:
      return '없음';
    case 1:
      return '비';
    case 2:
      return '비/눈';
    case 3:
      return '눈';
    case 4:
      return '소나기';
    default:
      return '알 수 없음';
  }
};

const getTodayDateString = () => {
  const today = new Date();
  return `${today.getMonth() + 1} / ${today.getDate()}`;
};

const WeatherCard = () => {
  const { location, loading: locLoading, error: locError } = useLocation();
  const [minMaxTemp, setMinMaxTemp] = useState({ minTemp: null, maxTemp: null });
  const [conditions, setConditions] = useState({ pop: null, pty: null, sky: null, rain: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (locLoading || locError) return;
    const { lat, lon } = location;
    if (!lat || !lon) return;

    const { nx, ny } = convertLatLonToGrid(lat, lon);

    const loadData = async () => {
      try {
        setLoading(true);
        const temps = await fetchMinMaxTemp(nx, ny);
        const cond = await fetchLatestWeatherConditions(nx, ny);

        setMinMaxTemp(temps);
        setConditions(cond);
        setError(null);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [locLoading, locError, location]);

  if (locLoading || loading) {
    return (
      <Card sx={{ maxWidth: 600, margin: '20px auto', padding: 3 }}>
        <CardContent>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={120}>
            <CircularProgress />
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (locError || error) {
    return (
      <Card sx={{ maxWidth: 600, margin: '20px auto', padding: 3 }}>
        <CardContent>
          <Typography color="error" align="center">
            에러: {locError || error}
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const getWeatherMessage = (sky, rain) => {
    const rainCode = Number(rain);

    if (rainCode > 0) {
      switch (rainCode) {
        case 1:
          return '우산 챙기세요, 비가 와요!';
        case 2:
          return '비와 눈이 함께 와요!';
        case 3:
          return '눈이 내려요!';
        case 4:
          return '소나기 조심하세요!';
        default:
          return '비 오는 날이에요!';
      }
    }

    switch (String(sky)) {
      case '1':
        return '맑은 날이에요!';
      case '3':
        return '조금 흐린 날이에요';
      case '4':
        return '흐린 하루가 예상돼요';
      default:
        return '날씨 정보를 불러오고 있어요';
    }
  };

  return (
    <Card sx={{ maxWidth: 600, margin: '10px', padding: 3, boxShadow: 3 }}>
      <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
        {/* 아이콘 */}
        <Box>
          <WeatherIcon skyCode={conditions.sky} rain={conditions.rain} sx={{ fontSize: 100 }} />
        </Box>

        {/* 텍스트 정보 */}
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
            {getTodayDateString()}
          </Typography>

          <Typography variant="body1" sx={{ marginBottom: 1 }}>
            {getWeatherMessage(conditions.sky, conditions.rain)}
          </Typography>

          <Typography variant="body1" sx={{ marginBottom: 1 }}>
            최고 온도: <strong style={{ color: 'red' }}>{minMaxTemp.maxTemp ?? '--'}°</strong> / 최저 온도:{' '}
            <strong style={{ color: 'blue' }}>{minMaxTemp.minTemp ?? '--'}°</strong>
          </Typography>

          <Typography variant="body1" sx={{ color: '#6ea8ff' }}>
            강수 확률: <strong>{conditions.pop ?? '정보 없음'}%</strong>
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default WeatherCard;
