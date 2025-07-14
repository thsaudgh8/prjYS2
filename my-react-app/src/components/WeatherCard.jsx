import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import WeatherIcon from './WeatherIcon';

const getTodayDateString = (yyyymmdd) => {
  if (!yyyymmdd || yyyymmdd.length !== 8) return '';
  const month = Number(yyyymmdd.slice(4, 6));
  const day = Number(yyyymmdd.slice(6, 8));
  return `${month} / ${day}`;
};

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

const WeatherCard = ({ weatherData }) => {
  if (!weatherData) return null;

  const { date, maxTemp, minTemp, pop, pty, sky, rain } = weatherData;

  return (
    <Card sx={{ maxWidth: 600, margin: '10px', padding: 3, boxShadow: 3 }}>
      <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
        <Box>
          <WeatherIcon skyCode={sky} rain={rain} sx={{ fontSize: 100 }} />
        </Box>

        <Box>
          <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
            {getTodayDateString(date)}
          </Typography>

          <Typography variant="body1" sx={{ marginBottom: 1 }}>
            {getWeatherMessage(sky, rain)}
          </Typography>

          <Typography variant="body1" sx={{ marginBottom: 1 }}>
            최고 온도: <strong style={{ color: 'red' }}>{maxTemp ?? '--'}°</strong> / 최저 온도:{' '}
            <strong style={{ color: 'blue' }}>{minTemp ?? '--'}°</strong>
          </Typography>

          <Typography variant="body1" sx={{ color: '#6ea8ff' }}>
            강수 확률: <strong>{pop ?? '정보 없음'}%</strong>
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default WeatherCard;
