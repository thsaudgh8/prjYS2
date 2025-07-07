//  날씨 정보

// components/WeatherCard.js
import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, CircularProgress } from '@mui/material';
import { fetchTodayMinMaxTemp } from '../services/weatherService';

const WeatherCard = () => {
  const [minTemp, setMinTemp] = useState(null);
  const [maxTemp, setMaxTemp] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTemp = async () => {
      const { minTemp, maxTemp } = await fetchTodayMinMaxTemp(60, 127); // 서울
      setMinTemp(minTemp);
      setMaxTemp(maxTemp);
      setLoading(false);
    };
    loadTemp();
  }, []);

  return (
    <Card sx={{ minWidth: 275, maxWidth: 400, margin: '0 auto', mt: 4, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
          오늘의 기온
        </Typography>
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            <Typography variant="body1" sx={{ fontSize: '1.2rem', mb: 1 }}>
              🌡️ 최고기온: <strong>{maxTemp}℃</strong>
            </Typography>
            <Typography variant="body1" sx={{ fontSize: '1.2rem' }}>
              ❄️ 최저기온: <strong>{minTemp}℃</strong>
            </Typography>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default WeatherCard;
