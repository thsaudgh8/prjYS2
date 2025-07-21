import React from 'react';
import { Card, Box, Typography } from '@mui/material';

function HomeDust({ pm10Hourly = [], pm25Hourly = [] }) {
  const now = new Date();
  const getHourLabel = (idx) => {
    const hour = (now.getHours() + idx + 1) % 24;
    return `${hour}시 (${idx + 1}시간 후)`;
  };

  const getGrade = (pm10) => {
    if (pm10 <= 30) return { label: '좋음', color: 'green', advice: '마스크 착용\n필요 없음' };
    if (pm10 <= 80) return { label: '보통', color: 'orange', advice: '마스크 착용\n권고' };
    return { label: '나쁨', color: 'red', advice: '마스크 착용\n필수' };
  };

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
      }}
      elevation={4}
    >
      <Typography variant="h6" fontWeight="bold" mb={1}>
        미세먼지 정보
      </Typography>

      <Box
        sx={{
          overflowX: 'auto',
          display: 'flex',
          gap: 1,
          p: 1,
        }}
      >
        {pm10Hourly.map((pm10, idx) => {
          const pm25 = pm25Hourly[idx];
          const grade = getGrade(pm10);
          return (
            <Card
              key={idx}
              sx={{
                width: 60,
                minHeight: 190, // ✅ 높이 늘림
                bgcolor: 'rgba(255, 255, 255, 0.85)',
                color: '#3e2723',
                p: 1.2, // ✅ 여백도 약간 늘림
                borderRadius: 2,
                textAlign: 'center',
                flexShrink: 0,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
              elevation={2}
            >
              <Typography variant="caption" fontWeight="bold">
                {getHourLabel(idx)}
              </Typography>

              <Box>
                <Typography variant="body2" fontWeight="bold" color={grade.color}>
                  PM10: {pm10}㎍/㎥
                </Typography>
                <Typography variant="caption">
                  PM2.5: {pm25}㎍/㎥
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="body2"
                  fontWeight="bold"
                  color={grade.color}
                  sx={{ whiteSpace: 'pre-line', mt: 0.5 }}
                >
                  {grade.label}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ whiteSpace: 'pre-line' }}
                >
                  {grade.advice}
                </Typography>
              </Box>
            </Card>
          );
        })}
      </Box>
    </Card>
  );
}

export default HomeDust;
