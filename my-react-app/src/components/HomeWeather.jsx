import React, { useState } from 'react';
import { Card, Typography, Grid, Collapse } from '@mui/material';

function HomeWeather({ address, lat, lon }) {
  const [showHourly, setShowHourly] = useState(false);

  // TODO: 실제 API 호출해서 날씨 데이터 받기
  const weatherData = {
    now: { temp: 27, condition: '맑음', icon: '☀️' },
    hourly: [
      { time: '13시', icon: '☀️', high: 27, low: 18 },
      { time: '14시', icon: '🌤️', high: 26, low: 18 },
      { time: '15시', icon: '🌥️', high: 25, low: 18 },
    ],
  };

  return (
    <>
      <Card
        onClick={() => setShowHourly(!showHourly)}
        sx={{
          cursor: 'pointer',
          bgcolor: '#81d4fa',
          color: 'white',
          p: 2,
        }}
        elevation={4}
      >
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          현재 날씨 - {address}
        </Typography>
        <Typography variant="h3" mt={1}>
          {weatherData.now.temp}°C {weatherData.now.icon} {weatherData.now.condition}
        </Typography>
        <Typography sx={{ fontSize: '0.8rem', opacity: 0.8 }}>
          (클릭하면 시간별 날씨 보기)
        </Typography>
      </Card>

      <Collapse in={showHourly} timeout="auto" unmountOnExit>
        <Grid container spacing={1} sx={{ mt: 1 }}>
          {weatherData.hourly.map((hour, idx) => (
            <Grid item xs={4} key={idx}>
              <Card
                sx={{ bgcolor: '#4fc3f7', color: 'white', p: 1, textAlign: 'center' }}
                elevation={3}
              >
                <Typography variant="subtitle1" fontWeight="bold">
                  {hour.time}
                </Typography>
                <Typography variant="h4">{hour.icon}</Typography>
                <Typography>
                  {hour.high}° / {hour.low}°
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Collapse>
    </>
  );
}

export default HomeWeather;
