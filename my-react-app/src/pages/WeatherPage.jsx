// import React, { useState, useEffect } from 'react';
// import { fetchShortTermForecast } from '../services/weatherService';
// import { useLocation } from '../hooks/useLocation';
// import { convertLatLonToGrid } from '../utils/convertGrid';
// import { getBaseDateTime } from '../utils/getBaseDateTime';

// import { Container, Typography, Card, CardContent } from '@mui/material';

// function Weather() {
//   const { location, loading: locLoading, error: locError } = useLocation();
//   const [forecast, setForecast] = useState(null);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     if (locLoading || locError) return;

//     if (location.lat && location.lon) {
//       const { nx, ny } = convertLatLonToGrid(location.lat, location.lon);
//       const { baseDate } = getBaseDateTime();
//       const baseTime = '0200'; // ✅ TMX/TMN은 0200 발표에만 포함됨

//       fetchShortTermForecast({ baseDate, baseTime, nx, ny })
//         .then(data => setForecast(data))
//         .catch(err => setError(err.message));
//     }
//   }, [location, locLoading, locError]);

//   if (locLoading) return <Container>위치 정보 불러오는 중...</Container>;
//   if (locError) return <Container>위치 정보를 가져올 수 없습니다: {locError}</Container>;
//   if (error) return <Container>날씨 정보를 가져오는 중 오류 발생: {error}</Container>;
//   if (!forecast) return <Container>날씨 데이터 로딩 중...</Container>;

//   // 오늘 날짜 문자열 (YYYYMMDD)
//   const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');

//   // 특정 카테고리의 오늘 날짜 데이터를 가져오기
//   function getCategoryValue(category) {
//     const filtered = forecast.filter(
//       item => item.category === category && item.fcstDate === today
//     );
//     if (filtered.length === 0) return null;
//     return filtered[0].fcstValue;
//   }

//   const minTemp = getCategoryValue('TMN'); // ✅ 오늘 최저기온
//   const maxTemp = getCategoryValue('TMX'); // ✅ 오늘 최고기온

//   return (
//     <Container sx={{ mt: 4 }}>
//       <Typography variant="h4" gutterBottom>오늘의 날씨</Typography>
//       <Card>
//         <CardContent>
//           <Typography variant="body1">최저기온: {minTemp ?? '정보없음'}°C </Typography>
//           <Typography variant="body1">최고기온: {maxTemp ?? '정보없음'}°C </Typography>
//         </CardContent>
//       </Card>
//     </Container>
//   );
// }

// export default Weather;


// components/Weather.js
// pages/WeatherPage.jsx
import React from 'react';
import WeatherCard from '../components/WeatherCard';

const WeatherPage = () => {
  return (
    <div style={{ padding: '1rem' }}>
      <WeatherCard />
    </div>
  );
};

export default WeatherPage;
