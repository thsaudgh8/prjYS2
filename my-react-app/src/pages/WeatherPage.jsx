//  날씨 상세 정보

// import { Container, Typography } from '@mui/material';

// function Home() {
//   return (
//     <Container>
//       <Typography variant="h4" mt={4}>날씨화면 화면</Typography>
//       <Typography variant="body1" mt={2}>여기에 오늘의 날씨와 미세먼지 정보가 표시됩니다.</Typography>
//     </Container>
//   );
// }

// export default Home;


import React, { useState, useEffect } from 'react';
import { fetchShortTermForecast } from '../services/weatherService';

function Weather() {
  const [forecast, setForecast] = useState(null);

  useEffect(() => {
    const baseDate = '20250707'; // 예: 오늘 날짜
    const baseTime = '0500';     // 기준 시간
    const nx = 60;
    const ny = 127;

    fetchShortTermForecast({ baseDate, baseTime, nx, ny })
      .then(data => setForecast(data))
      .catch(console.error);
  }, []);

  if (!forecast) return <div>로딩중...</div>;

  return (
    <div>
      <h2>단기예보</h2>
      {/* 예보 데이터 출력 예시 */}
      <pre>{JSON.stringify(forecast, null, 2)}</pre>
    </div>
  );
}

export default Weather;
