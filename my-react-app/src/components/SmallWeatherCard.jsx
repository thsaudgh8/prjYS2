import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import SmallWeatherIcon from './SmallWeatherIcon'; // 새 아이콘 컴포넌트 import

const SmallWeatherCard = ({ date, skyCode, rain, maxTemp, minTemp }) => {
  return (
    <Card sx={{ width: 120, margin: 1, boxShadow: 1 }}>
      <CardContent sx={{ padding: 1 }}>
        {/* 날짜 */}
        <Typography variant="subtitle2" align="center" gutterBottom>
          {date}
        </Typography>

        {/* 아이콘 */}
        <Box display="flex" justifyContent="center" mb={1}>
          <SmallWeatherIcon skyCode={skyCode} rain={rain} />
        </Box>

        {/* 온도 */}
        <Box display="flex" justifyContent="center" gap={0.5}>
          <Typography variant="body1" sx={{ color: 'red', fontWeight: 'bold' }}>
            {maxTemp ?? '--'}°
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>/</Typography>
          <Typography variant="body1" sx={{ color: 'blue', fontWeight: 'bold' }}>
            {minTemp ?? '--'}°
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default SmallWeatherCard;
