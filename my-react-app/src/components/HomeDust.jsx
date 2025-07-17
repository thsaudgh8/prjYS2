import React from 'react';
import { Card, Box, Typography } from '@mui/material';

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
      }}
      elevation={4}
    >
      <Typography variant="h6" fontWeight="bold" mb={1}>
        미세먼지 정보
      </Typography>

      <Box
        sx={{
          display: 'flex',
          gap: 0.5,
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        {pm10Hourly.map((pm10, idx) => (
          <Card
            key={idx}
            sx={{
              width: 50,
              bgcolor: 'rgba(255, 255, 255, 0.7)',
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
            <Typography variant="body2" fontWeight="bold" lineHeight={1} mb={0.2}>
              PM10
            </Typography>
            <Typography variant="body1" lineHeight={1}>
              {pm10}㎍/㎥
            </Typography>
            <Typography variant="caption" color="textSecondary" lineHeight={1}>
              PM2.5: {pm25Hourly[idx]}㎍/㎥
            </Typography>
          </Card>
        ))}
      </Box>
    </Card>
  );
}

export default HomeDust;
