import React from 'react';
import { Card, CardContent, Typography, Box, Divider } from '@mui/material';
import { useLocation } from '../hooks/useLocation.js';
import { useWeather } from '../hooks/useWeather.js';
import { convertSkyCode } from '../utils/convertGrid';
import WeatherIcon from './WeatherIcon';

const WeatherCard = () => {
  const { location, loading: locLoading, error: locError } = useLocation();
  const { minTemp, maxTemp, currentTemp, sky, rain, pop, loading } = useWeather(location, locLoading, locError);

  if (locLoading || loading) {
    return (
      <Card sx={{ maxWidth: 400, margin: '2rem auto', boxShadow: 3, textAlign: 'center' }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>오늘의 기온</Typography>
          <Typography>데이터를 불러오는 중입니다...</Typography>
        </CardContent>
      </Card>
    );
  }

  if (locError) {
    return (
      <Card sx={{ maxWidth: 400, margin: '2rem auto', boxShadow: 3, textAlign: 'center' }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>오늘의 기온</Typography>
          <Typography color="error">{locError}</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ maxWidth: 400, margin: '2rem auto', boxShadow: 3 }}>
      <CardContent sx={{ textAlign: 'center' }}>
        {/* 날씨 아이콘 크게 */}
        <Box sx={{ mb: 2 }}>
          <WeatherIcon skyCode={sky} rain={rain} />
          <Typography variant="h6" sx={{ mt: 1 }}>
            {convertSkyCode(sky)} {rain !== null && Number(rain) > 0 ? '☔️ 비' : ''}
          </Typography>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* 온도 및 상태 정보 리스트 */}
        <Box>
          <Box display="flex" justifyContent="space-between" sx={{ fontSize: '1.2rem', mb: 1 }}>
            <span>🌡️ 현재기온</span>
            <strong>{currentTemp !== null ? `${currentTemp}℃` : '-'}</strong>
          </Box>

          <Box display="flex" justifyContent="space-between" sx={{ fontSize: '1.2rem', mb: 1 }}>
            <span>🔺 최고기온</span>
            <strong>{maxTemp !== null ? `${maxTemp}℃` : '-'}</strong>
          </Box>

          <Box display="flex" justifyContent="space-between" sx={{ fontSize: '1.2rem', mb: 1 }}>
            <span>🔻 최저기온</span>
            <strong>{minTemp !== null ? `${minTemp}℃` : '-'}</strong>
          </Box>
          <Box display="flex" justifyContent="space-between" sx={{ fontSize: '1.2rem', mb: 1 }}>
            <span>🌧️ {pop === null ? '강수 없음' : `강수 확률: ${pop}%`}</span>
            {pop !== null && <strong>예상 강수량: {rain} mm</strong>}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default WeatherCard;
