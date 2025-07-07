import React, { useState, useEffect } from 'react';
import { fetchShortTermForecast } from '../services/weatherService';
import { useLocation } from '../hooks/useLocation';
import { convertLatLonToGrid } from '../utils/convertGrid';
import { getBaseDateTime } from '../utils/getBaseDateTime';

import { Container, Typography, Card, CardContent } from '@mui/material';

function Weather() {
  const { location, loading: locLoading, error: locError } = useLocation();
  const [forecast, setForecast] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (locLoading || locError) return;

    if (location.lat && location.lon) {
      const { nx, ny } = convertLatLonToGrid(location.lat, location.lon);
      const { baseDate, baseTime } = getBaseDateTime();

      fetchShortTermForecast({ baseDate, baseTime, nx, ny })
        .then(data => setForecast(data))
        .catch(err => setError(err.message));
    }
  }, [location, locLoading, locError]);

  if (locLoading) return <Container>위치 정보 불러오는 중...</Container>;
  if (locError) return <Container>위치 정보를 가져올 수 없습니다: {locError}</Container>;
  if (error) return <Container>날씨 정보를 가져오는 중 오류 발생: {error}</Container>;
  if (!forecast) return <Container>날씨 데이터 로딩 중...</Container>;

  // forecast 데이터에서 오늘 날짜에 해당하는 것만 필터링 (예: fcstDate가 오늘인 데이터)
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const todayData = forecast.filter(item => item.fcstDate === today);

  // 필요한 정보: 최저기온(TMN), 최고기온(TMX), 구름상태(CLD), 강수형태(PTY), 하늘상태(SKY)
  // 각 카테고리별 가장 최신 시간대 값 추출 (fcstTime 기준 내림차순 정렬 후 첫 번째)

  function getCategoryValue(category) {
    const filtered = todayData.filter(d => d.category === category);
    if (filtered.length === 0) return null;
    filtered.sort((a, b) => b.fcstTime.localeCompare(a.fcstTime));
    return filtered[0].fcstValue;
  }

  const minTemp = getCategoryValue('TMN'); // 최저기온
  const maxTemp = getCategoryValue('TMX'); // 최고기온
  const tmp = getCategoryValue('TMP'); // 현재기온 
  const cloud = getCategoryValue('CLD');  // 구름상태
  const rainType = getCategoryValue('PTY'); // 강수형태
  const sky = getCategoryValue('SKY');    // 하늘상태

  // 강수형태(PTY) 0 = 없음, 1=비, 2=비/눈, 3=눈, 4=소나기
  const rainMap = {
    '0': '없음',
    '1': '비',
    '2': '비/눈',
    '3': '눈',
    '4': '소나기',
  };

  // 하늘상태(SKY) 1=맑음, 3=구름많음, 4=흐림
  const skyMap = {
    '1': '맑음',
    '3': '구름많음',
    '4': '흐림',
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>오늘의 날씨</Typography>

      <Card>
        <CardContent>
          <Typography variant="body1">최저기온: {minTemp}°C </Typography>
          <Typography variant="body1">최고기온: {maxTemp}°C </Typography>
          <Typography variant='body1'>현재기온: {tmp}°C </Typography>
          <Typography variant="body1">구름상태: {cloud ?? '정보없음'} </Typography>
          <Typography variant="body1">강수량: {rainMap[rainType] || '정보없음'} </Typography>
          <Typography variant="body1">하늘상태: {skyMap[sky] || '정보없음'} </Typography>
        </CardContent>
      </Card>
    </Container>
  );
}

export default Weather;
