import React, { useEffect, useState } from 'react';
import { Card, Box, Typography } from '@mui/material';
import { fetchUltraShortForecast } from '../services/weatherService';

function HomeWeather({ nx, ny }) {
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!nx || !ny) return;

    let isMounted = true;
    let intervalId;

    const fetchData = () => {
      setLoading(true);
      fetchUltraShortForecast(nx, ny)
        .then((data) => {
          if (isMounted) {
            setWeatherData(data);
            setLoading(false);
            setError(null);
          }
        })
        .catch((e) => {
          if (isMounted) {
            setError(e.message);
            setLoading(false);
          }
        });
    };

    fetchData(); // 초기 호출
    intervalId = setInterval(fetchData, 10 * 60 * 1000); // 10분마다 갱신

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [nx, ny]);

  if (loading) return <Typography>날씨 불러오는 중...</Typography>;
  if (error) return <Typography color="error">날씨 정보 오류: {error}</Typography>;

  const current = weatherData[0] || {};

  // ✅ 강수 예보 메시지 생성
  const getRainMessage = () => {
    const rainHours = weatherData
      .filter(item => item.pty && item.pty !== '0')
      .map(item => `${item.time.slice(0, 2)}시`);

    if (rainHours.length === 0) return null;

    const start = rainHours[0];
    const end = rainHours[rainHours.length - 1];

    return `${start}부터 ${end}까지 비가 내릴 예정이에요. 우산 챙기세요 ☔️`;
  };

  return (
    <Card
      sx={{
        p: 2,
        bgcolor: '#4fc3f7',
        color: 'white',
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        flex: 1,
      }}
      elevation={4}
    >
      <Box>
        <Typography variant="h6" fontWeight="bold" mb={0.5}>
          현재 날씨
        </Typography>
        <Typography variant="h4" fontWeight="bold" lineHeight={1} mb={0.5}>
          {current.temp ?? '--'}°C{' '}
          {current.sky === '1' ? '☀️' : current.sky === '3' ? '☁️' : '🌧️'}
        </Typography>

        {/* ✅ 강수 메시지 출력 */}
        {getRainMessage() && (
          <Typography variant="body2" mt={1} fontWeight="bold">
            {getRainMessage()}
          </Typography>
        )}
      </Box>

      {/* 시간별 날씨 카드 */}
      <Box
        sx={{
          display: 'flex',
          gap: 0.5,
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        {weatherData.map(({ time, temp, sky }, idx) => {
          // time 예: '1000' => 시: '10', 분: '00'
          const hour = time.slice(0, 2);
          const minute = time.slice(2, 4);
          const timeString = `${hour}:${minute}`;

          return (
            <Card
              key={time}
              sx={{
                width: 50,
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                p: 0.5,
                borderRadius: 2,
                textAlign: 'center',
                flexShrink: 0,
              }}
              elevation={1}
            >
              <Typography variant="caption" lineHeight={1}>
                {timeString}
              </Typography>
              <Typography variant="body1" lineHeight={1} mb={0.2}>
                {sky === '1' ? '☀️' : sky === '3' ? '☁️' : '🌧️'}
              </Typography>
              <Typography variant="caption" lineHeight={1}>
                {temp}°C
              </Typography>
            </Card>
          );
        })}
      </Box>
    </Card>
  );
}

export default HomeWeather;
