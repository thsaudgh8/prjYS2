import React, { useEffect, useState } from 'react';
import { Card, Box, Typography } from '@mui/material';
import { fetchUltraShortForecast } from '../services/weatherService';

function HomeWeather({ nx, ny }) {
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!nx || !ny) return;

    let isMounted = true;
    let intervalId;

    const fetchData = () => {
      setLoading(true);
      fetchUltraShortForecast(nx, ny)
        .then((data) => {
          if (isMounted) {
            setWeatherData(data);
            setLoading(false);
            setError(null);
          }
        })
        .catch((e) => {
          if (isMounted) {
            setError(e.message);
            setLoading(false);
          }
        });
    };

    fetchData(); // 초기 호출

    // 10분마다 갱신
    intervalId = setInterval(fetchData, 10 * 60 * 1000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [nx, ny]);

  if (loading) return <Typography>날씨 불러오는 중...</Typography>;
  if (error) return <Typography color="error">날씨 정보 오류: {error}</Typography>;

  const current = weatherData[0] || {};

  return (
    <Card
      sx={{
        p: 2,
        bgcolor: '#4fc3f7',
        color: 'white',
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        flex: 1,
      }}
      elevation={4}
    >
      <Box>
        <Typography variant="h6" fontWeight="bold" mb={0.5}>
          현재 날씨
        </Typography>
        <Typography variant="h4" fontWeight="bold" lineHeight={1} mb={0.5}>
          {current.temp ?? '--'}°C {current.sky === '1' ? '☀️' : current.sky === '3' ? '☁️' : '🌧️'}
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'flex',
          gap: 0.5,
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        {weatherData.map(({ time, temp, sky }, idx) => (
          <Card
            key={time}
            sx={{
              width: 50,
              bgcolor: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              p: 0.5,
              borderRadius: 2,
              textAlign: 'center',
              flexShrink: 0,
            }}
            elevation={1}
          >
            <Typography variant="caption" lineHeight={1}>
              {idx + 1}시 후
            </Typography>
            <Typography variant="body1" lineHeight={1} mb={0.2}>
              {sky === '1' ? '☀️' : sky === '3' ? '☁️' : '🌧️'}
            </Typography>
            <Typography variant="caption" lineHeight={1}>
              {temp}°C
            </Typography>
          </Card>
        ))}
      </Box>
    </Card>
  );
}

export default HomeWeather;
