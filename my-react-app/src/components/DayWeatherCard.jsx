import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import WeatherIcon from './WeatherIcon';

const convertPtyToText = (pty) => {
  switch (Number(pty)) {
    case 0: return '없음';
    case 1: return '비';
    case 2: return '비/눈';
    case 3: return '눈';
    case 4: return '소나기';
    default: return '알 수 없음';
  }
};

const getTodayDateString = (yyyymmdd) => {
  if (!yyyymmdd || yyyymmdd.length !== 8) return '';
  const month = Number(yyyymmdd.slice(4, 6));
  const day = Number(yyyymmdd.slice(6, 8));
  return `${month}월  ${day}일`;
};

const getWeatherMessage = (sky, rain) => {
  const rainCode = Number(rain);
  if (rainCode > 0) {
    switch (rainCode) {
      case 1: return '우산 꼭 챙기세요! 비가 와요.';
      case 2: return '비와 눈이 함께 와요.';
      case 3: return '눈이 내려요! 따뜻하게 입으세요.';
      case 4: return '소나기 조심하세요!';
      default: return '비 오는 날이에요!';
    }
  }
  switch (String(sky)) {
    case '1': return '맑은 날이에요!';
    case '3': return '구름이 조금 있어요.';
    case '4': return '흐린 하루가 될 거예요.';
    default: return '날씨 정보를 불러오는 중이에요.';
  }
};

const DayWeatherCard = ({ date, sky, rain, pty, popAm, popPm, maxTemp, minTemp }) => {
  return (
    <Card
      sx={{
        maxWidth: 600,
        margin: '10px',
        padding: 3,
        boxShadow: 3,
        borderRadius: '16px',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'translateY(-6px)',
          boxShadow: 8,
          cursor: 'pointer',
        }}
      }
        >
        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          {/* 아이콘 */}
          <Box>
            <WeatherIcon skyCode={sky} rain={rain} sx={{ fontSize: 100 }} />
          </Box>

          {/* 텍스트 */}
          <Box>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              {getTodayDateString(date)}
            </Typography>

            <Typography variant="body1" gutterBottom>
              {getWeatherMessage(sky, rain)}
            </Typography>

            <Typography variant="body2" gutterBottom>
              🌡 최고 온도:<strong style={{ color: 'red' }}>{maxTemp ?? '--'}°</strong> / 최저 온도:{' '}
              <strong style={{ color: 'blue' }}>{minTemp ?? '--'}°</strong>
            </Typography>

            {popAm !== null && popAm !== undefined ? (
              <Typography variant="body2" gutterBottom>
                ☀ 오전 강수 확률: <strong>{popAm}%</strong> / 오후 강수 확률: <strong>{popPm ?? '--'}%</strong>
              </Typography>
            ) : popPm !== null && popPm !== undefined ? (
              <Typography variant="body2" gutterBottom>
                ☀ 오후 강수 확률: <strong>{popPm}%</strong>
              </Typography>
            ) : null}


            {Number(pty) > 0 && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                🌧 강수형태: <strong>{convertPtyToText(pty)}</strong>
              </Typography>
            )}
          </Box>
        </CardContent>
    </Card >
  );
};

export default DayWeatherCard;
