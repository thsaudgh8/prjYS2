import React from 'react';
import { Card, Box, Typography } from '@mui/material';

// 등급 구분 함수
function getPm10Grade(pm10) {
  if (pm10 <= 30) return { level: '좋음', color: '#4caf50' };
  if (pm10 <= 80) return { level: '보통', color: '#ffeb3b' };
  if (pm10 <= 150) return { level: '나쁨', color: '#ff9800' };
  return { level: '매우 나쁨', color: '#f44336' };
}

function HomeDust({ pm10Hourly = [], pm25Hourly = [], stationName = '측정소 정보 없음' }) {
  return (
    <Card
      sx={{
        p: 2,
        bgcolor: '#aed581',
        color: '#3e2723',
        flex: 1,
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
      elevation={4}
    >
      <Typography variant="h6" fontWeight="bold" mb={1}>
        미세먼지 정보
      </Typography>

      <Typography variant="body2" fontWeight="bold" mb={1}>
        측정소: {stationName}
      </Typography>

      <Box
        sx={{
          display: 'flex',
          gap: 0.5,
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        {pm10Hourly.map((pm10, idx) => {
          const { level, color } = getPm10Grade(pm10);
          return (
            <Card
              key={idx}
              sx={{
                width: 60,
                bgcolor: 'rgba(255, 255, 255, 0.85)',
                color: '#3e2723',
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
              <Typography
                variant="body2"
                fontWeight="bold"
                lineHeight={1}
                mb={0.2}
                sx={{ color }}
              >
                PM10
              </Typography>
              <Typography variant="body1" lineHeight={1}>
                {pm10}㎍/㎥
              </Typography>
              <Typography variant="caption" color="textSecondary" lineHeight={1}>
                PM2.5: {pm25Hourly[idx]}㎍/㎥
              </Typography>
              <Typography variant="caption" fontWeight="bold" sx={{ color }}>
                {level}
              </Typography>
            </Card>
          );
        })}
      </Box>
    </Card>
  );
}

export default HomeDust;
