import React from 'react';
import { Card, CardContent, Typography, CircularProgress } from '@mui/material';
import { useLocation } from '../hooks/useLocation.js';
import { useWeather } from '../hooks/useWeather.js';
import { convertSkyCode } from '../utils/convertGrid';

const WeatherCard = () => {
  const { location, loading: locLoading, error: locError } = useLocation();
  const { minTemp, maxTemp, currentTemp, sky, rain, pop, loading } = useWeather(location, locLoading, locError);

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
        <Typography variant="body1" sx={{ fontSize: '1.2rem', mb: 1 }}>
          🌧️ {pop === null ? (<>강수 없음</>) : (<>강수 확률: {pop}%{rain !== null && <> / 예상 강수량: {rain} mm</>}</>)}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default WeatherCard;
