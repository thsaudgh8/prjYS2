// WeatherIcon.jsx

import React from 'react';
import WbSunnyIcon from '@mui/icons-material/WbSunny'; // 맑음
import CloudIcon from '@mui/icons-material/Cloud'; // 흐림
import CloudQueueIcon from '@mui/icons-material/CloudQueue'; // 구름 조금
import GrainIcon from '@mui/icons-material/Grain'; // 비 기본
import WaterDropIcon from '@mui/icons-material/WaterDrop'; // 비/소나기
import AcUnitIcon from '@mui/icons-material/AcUnit'; // 눈
import ThunderstormIcon from '@mui/icons-material/Thunderstorm'; // 비/눈

const WeatherIcon = ({ skyCode, rain, sx }) => {
  const rainCode = Number(rain);

  if (rainCode > 0) {
    switch (rainCode) {
      case 1:
        return <WaterDropIcon sx={{ fontSize: 100, color: '#2196f3', ...sx }} />;
      case 2:
        return <ThunderstormIcon sx={{ fontSize: 100, color: '#90caf9', ...sx }} />;
      case 3:
        return <AcUnitIcon sx={{ fontSize: 100, color: '#81d4fa', ...sx }} />;
      case 4:
        return <WaterDropIcon sx={{ fontSize: 100, color: '#4fc3f7', ...sx }} />;
      default:
        return <GrainIcon sx={{ fontSize: 100, color: '#2196f3', ...sx }} />;
    }
  }

  switch (skyCode) {
    case '1':
      return <WbSunnyIcon sx={{ fontSize: 100, color: '#ffb300', ...sx }} />;
    case '3':
      return <CloudQueueIcon sx={{ fontSize: 100, color: '#90a4ae', ...sx }} />;
    case '4':
      return <CloudIcon sx={{ fontSize: 100, color: '#607d8b', ...sx }} />;
    default:
      return <WbSunnyIcon sx={{ fontSize: 100, color: '#ffb300', ...sx }} />;
  }
};

export default WeatherIcon;
