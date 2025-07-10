import React from 'react';
import WbSunnyIcon from '@mui/icons-material/WbSunny';         // 맑음
import CloudIcon from '@mui/icons-material/Cloud';             // 흐림
import CloudQueueIcon from '@mui/icons-material/CloudQueue';   // 구름 조금
import GrainIcon from '@mui/icons-material/Grain';             // 비 기본
import WaterDropIcon from '@mui/icons-material/WaterDrop';     // 비/소나기
import AcUnitIcon from '@mui/icons-material/AcUnit';           // 눈
import ThunderstormIcon from '@mui/icons-material/Thunderstorm'; // 비/눈

const SmallWeatherIcon = ({ skyCode, rain }) => {
  const rainCode = Number(rain);

  if (rainCode > 0) {
    switch (rainCode) {
      case 1: // 비
        return <WaterDropIcon sx={{ fontSize: 40, color: '#2196f3' }} />;
      case 2: // 비/눈
        return <ThunderstormIcon sx={{ fontSize: 40, color: '#90caf9' }} />;
      case 3: // 눈
        return <AcUnitIcon sx={{ fontSize: 40, color: '#81d4fa' }} />;
      case 4: // 소나기
        return <WaterDropIcon sx={{ fontSize: 40, color: '#4fc3f7' }} />;
      default:
        return <GrainIcon sx={{ fontSize: 40, color: '#2196f3' }} />;
    }
  }

  // 비 안 오는 경우 skyCode 기준
  switch (skyCode) {
    case '1':
      return <WbSunnyIcon sx={{ fontSize: 40, color: '#ffb300' }} />;
    case '3':
      return <CloudQueueIcon sx={{ fontSize: 40, color: '#90a4ae' }} />;
    case '4':
      return <CloudIcon sx={{ fontSize: 40, color: '#607d8b' }} />;
    default:
      return <WbSunnyIcon sx={{ fontSize: 40, color: '#ffb300' }} />;
  }
};

export default SmallWeatherIcon;
