import React from 'react';
import { Card, Box, Typography } from '@mui/material';

function getGradeColor(grade) {
  switch (grade) {
    case '좋음':
      return 'green';
    case '보통':
      return 'orange';
    case '나쁨':
      return 'red';
    default:
      return 'gray';
  }
}

function getDustGrade(pm10) {
  if (pm10 <= 30) return '좋음';
  if (pm10 <= 80) return '보통';
  return '나쁨';
}

function getMaskMessage(grade) {
  if (grade === '좋음') return '마스크 착용 필요 없음';
  if (grade === '보통') return '마스크 착용 권장';
  return '마스크 착용 필수';
}

function HomeDust({ pm10Hourly = [], pm25Hourly = [] }) {
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
        maxHeight: 300,
        overflowY: 'auto',
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
          flexWrap: 'nowrap',
          overflowX: 'auto',
          pb: 1,
        }}
      >
        {pm10Hourly.map((pm10, idx) => {
          const pm25 = pm25Hourly[idx];
          const grade = getDustGrade(pm10);
          const color = getGradeColor(grade);
          const maskMsg = getMaskMessage(grade);

          return (
            <Card
              key={idx}
              sx={{
                width: 80,
                minHeight: 180,
                bgcolor: 'rgba(255, 255, 255, 0.9)',
                color: '#3e2723',
                p: 1,
                borderRadius: 2,
                textAlign: 'center',
                flexShrink: 0,
              }}
              elevation={2}
            >
              <Typography variant="caption" lineHeight={1}>
                {idx + 1}시 후
              </Typography>

              <Typography
                variant="body2"
                fontWeight="bold"
                color={color}
                lineHeight={1.2}
                sx={{ mt: 0.5 }}
              >
                PM10: {pm10}㎍/㎥
              </Typography>

              <Typography variant="caption" lineHeight={1}>
                PM2.5: {pm25}㎍/㎥
              </Typography>

              <Typography
                variant="caption"
                sx={{
                  fontWeight: 'bold',
                  color: color,
                  mt: 0.5,
                  display: 'block',
                }}
              >
                {grade}
              </Typography>

              <Typography
                variant="caption"
                sx={{
                  whiteSpace: 'pre-line',
                  display: 'block',
                }}
              >
                {maskMsg}
              </Typography>
            </Card>
          );
        })}
      </Box>
    </Card>
  );
}

export default HomeDust;
