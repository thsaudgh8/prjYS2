// src/components/WeatherIcon.jsx
import React from 'react';
import WbSunnyIcon from '@mui/icons-material/WbSunny'; // 맑음
import CloudIcon from '@mui/icons-material/Cloud'; // 흐림
import CloudQueueIcon from '@mui/icons-material/CloudQueue'; // 조금 흐림
import GrainIcon from '@mui/icons-material/Grain'; // 비 (예: 물방울 모양)

const WeatherIcon = ({ skyCode, rain }) => {
  // rain 값이 있으면 비 아이콘 우선
  if (rain !== null && Number(rain) > 0) {
    return <GrainIcon sx={{ fontSize: 200, color: '#2196f3' }} />;
  }

  switch (skyCode) {
    case '1': // 맑음
      return <WbSunnyIcon sx={{ fontSize: 200, color: '#ffb300' }} />;
    case '3': // 조금 흐림
      return <CloudQueueIcon sx={{ fontSize: 200, color: '#90a4ae' }} />;
    case '4': // 흐림
      return <CloudIcon sx={{ fontSize: 200, color: '#607d8b' }} />;
    default:
      return <WbSunnyIcon sx={{ fontSize: 200, color: '#ffb300' }} />;
  }
};

export default WeatherIcon;
