import React from 'react';
import { Card, Box, Typography } from '@mui/material';

// 현재 시각 기준 라벨 생성 함수
const getTimeLabels = (count = 6) => {
  const now = new Date();
  return Array.from({ length: count }, (_, i) => {
    const hour = (now.getHours() + i + 1) % 24;
    return `${hour}시 (${i + 1}시간 후)`;
  });
};

// 등급 및 메시지 판별 함수
const getDustLevel = (pm10) => {
  if (pm10 <= 30) return { level: '좋음', color: 'green', mask: '마스크 착용 필요 없음' };
  if (pm10 <= 80) return { level: '보통', color: 'orange', mask: '마스크 착용 권고' };
  return { level: '나쁨', color: 'red', mask: '마스크 착용 필수' };
};

function HomeDust({ pm10Hourly = [], pm25Hourly = [] }) {
  const timeLabels = getTimeLabels(pm10Hourly.length);

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

      <Box
        sx={{
          display: 'flex',
          gap: 1,
          overflowX: 'auto',
          pb: 1,
          pr: 1,
        }}
      >
        {pm10Hourly.map((pm10, idx) => {
          const pm25 = pm25Hourly[idx] || 0;
          const { level, color, mask } = getDustLevel(pm10);

          return (
            <Card
              key={idx}
              sx={{
                minWidth: 90,
                bgcolor: 'rgba(255, 255, 255, 0.9)',
                color: '#3e2723',
                p: 1,
                borderRadius: 2,
                textAlign: 'center',
                flexShrink: 0,
              }}
              elevation={2}
            >
              <Typography variant="caption" display="block" fontWeight="bold">
                {timeLabels[idx]}
              </Typography>

              <Typography
                variant="subtitle1"
                fontWeight="bold"
                color={color}
                sx={{ mt: 0.5, mb: 0.5 }}
              >
                PM10: {pm10}㎍/㎥
              </Typography>

              <Typography variant="body2" sx={{ mb: 0.2 }}>
                PM2.5: {pm25}㎍/㎥
              </Typography>

              <Typography
                variant="body2"
                fontWeight="bold"
                color={color}
                sx={{ whiteSpace: 'pre-line', lineHeight: 1.3 }}
              >
                {level}
              </Typography>

              <Typography
                variant="caption"
                sx={{ mt: 0.5, whiteSpace: 'pre-line', fontSize: '0.75rem' }}
              >
                {mask}
              </Typography>
            </Card>
          );
        })}
      </Box>
    </Card>
  );
}

export default HomeDust;
