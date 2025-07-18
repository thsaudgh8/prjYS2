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
  const getWeatherIcon = (sky, pty) => {
    const ptyNum = Number(pty) || 0;
    if (ptyNum === 1 || ptyNum === 4 || ptyNum === 5) return '🌧️';  // 비, 소나기, 빗방울과 눈날림
    if (ptyNum === 2 || ptyNum === 3) return '❄️';                  // 비/눈, 눈
    if (sky === '1') return '☀️';                                  // 맑음
    if (sky === '3' || sky === '4') return '☁️';                   // 흐림, 구름많음
    return '❓';
  };

  // ✅ 강수 예보 메시지 생성
  const getRainMessage = () => {
    const rainHours = weatherData
      .filter(item => Number(item.pty) !== 0)
      .map(item => item.time.slice(0, 2));

    if (rainHours.length === 0) return null;

    const startHour = rainHours[0];
    const endHour = rainHours[rainHours.length - 1];

    return `${startHour}시부터 ${endHour}시까지 비가 내릴 예정이에요. 우산 챙기세요 ☔️`;
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
      <Box
        sx={{
          display: { xs: 'flex', md: 'block' }, // xs(모바일)은 flex, md 이상은 기본 block
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: { xs: 'center', md: 'left' }, // 모바일에서 텍스트 중앙정렬, 데스크탑은 기본 왼쪽정렬
        }}
      >
        <Typography variant="h6" fontWeight="bold" mb={0.5}>
          현재 날씨
        </Typography>
        <Typography variant="h4" fontWeight="bold" lineHeight={1} mb={0.5}>
          {current.temp ?? '--'}°C{' '}
          {getWeatherIcon(current.sky, current.pty)}
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
        {weatherData.map(({ time, temp, sky, pty }) => {
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
                {getWeatherIcon(sky, pty)}
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
