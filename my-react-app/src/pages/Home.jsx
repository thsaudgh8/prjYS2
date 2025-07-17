import React, { useEffect, useRef, useState } from 'react';
import { Container, Box, Typography, Card } from '@mui/material';
import { useLocation } from '../hooks/useLocation';

// 예시용 더미 데이터 (실제 API 데이터로 교체 필요)
const exampleWeather = {
  temp: 27,
  condition: '맑음',
  icon: '☀️',
};

const exampleDust = {
  pm10: 35,
  pm25: 15,
};

function Home() {
  const { location, loading, error } = useLocation();
  const mapRef = useRef(null);
  const [address, setAddress] = useState('');
  const [map, setMap] = useState(null);
  const [kakaoLoaded, setKakaoLoaded] = useState(false);

  useEffect(() => {
    if (window.kakao && window.kakao.maps) {
      setKakaoLoaded(true);
      return;
    }
    const script = document.createElement('script');
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_WEATHER_MAP_API_KEY}&libraries=services&autoload=false`;
    script.async = true;
    script.onload = () => setKakaoLoaded(true);
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (!kakaoLoaded) return;
    if (loading || !location.lat || !location.lon || !mapRef.current || map) return;

    window.kakao.maps.load(() => {
      const container = mapRef.current;
      const options = {
        center: new window.kakao.maps.LatLng(location.lat, location.lon),
        level: 4,
      };
      const newMap = new window.kakao.maps.Map(container, options);
      setMap(newMap);

      const marker = new window.kakao.maps.Marker({
        position: new window.kakao.maps.LatLng(location.lat, location.lon),
      });
      marker.setMap(newMap);

      const geocoder = new window.kakao.maps.services.Geocoder();
      geocoder.coord2Address(location.lon, location.lat, (result, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
          setAddress(result[0].address.address_name);
          console.log('📍 주소:', result[0].address.address_name);
        } else {
          setAddress('주소를 불러올 수 없습니다');
          console.log('❌ 역지오코딩 실패:', status);
        }
      });
    });
  }, [kakaoLoaded, loading, location, map]);

  if (loading) return <Typography>위치 정보를 불러오는 중...</Typography>;
  if (error) return <Typography color="error">위치 정보 오류: {error}</Typography>;

  return (
    <Container
      maxWidth="xl"
      sx={{
        minHeight: '85vh',
        display: 'flex',
        gap: 2,
        py: 4,
      }}
    >
      {/* 좌측 지도 + 주소 영역 */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* 주소 표시 */}
        <Card sx={{ p: 2, bgcolor: '#81d4fa', color: 'white', borderRadius: 2 }}>
          <Typography variant="h6" fontWeight="bold">현위치 주소</Typography>
          <Typography>{address}</Typography>
        </Card>

        {/* 지도 */}
        <Box
          ref={mapRef}
          sx={{ flex: 1, height: '500px', borderRadius: 2, bgcolor: '#e0e0e0' }}
        />
      </Box>

      {/* 우측 날씨+미세먼지 영역 */}
      <Box
        sx={{
          flexBasis: '400px',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          height: '100%',
        }}
      >
        {/* 현재 날씨 카드 */}
        <Card
          sx={{
            p: 2,
            bgcolor: '#4fc3f7',
            color: 'white',
            borderRadius: 2,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
          elevation={4}
        >
          <Typography variant="h6" fontWeight="bold" mb={1}>
            현재 날씨
          </Typography>
          <Typography variant="h3" fontWeight="bold">
            {exampleWeather.temp}°C {exampleWeather.icon}
          </Typography>
          <Typography variant="subtitle1">{exampleWeather.condition}</Typography>

          {/* 6시간 예보 카드 */}
          <Box
            sx={{
              display: 'flex',
              gap: 1,
              mt: 2,
              flexWrap: 'wrap',
              justifyContent: 'space-between',
            }}
          >
            {[1, 2, 3, 4, 5, 6].map((hour) => (
              <Card
                key={hour}
                sx={{
                  flex: '1 1 30%',
                  minWidth: '55px',
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  p: 1,
                  borderRadius: 2,
                  textAlign: 'center',
                }}
                elevation={1}
              >
                <Typography variant="body2">{hour}시간 뒤</Typography>
                <Typography variant="h6">☁️</Typography>
                <Typography variant="body2">24°C</Typography>
              </Card>
            ))}
          </Box>
        </Card>

        {/* 미세먼지 카드 */}
        <Card
          sx={{
            p: 2,
            bgcolor: '#aed581',
            color: '#3e2723',
            flexBasis: '45%',
            borderRadius: 2,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
          elevation={4}
        >
          <Typography variant="h6" fontWeight="bold" mb={1}>
            미세먼지 정보
          </Typography>
          <Typography>PM10: {exampleDust.pm10} ㎍/㎥</Typography>
          <Typography>PM2.5: {exampleDust.pm25} ㎍/㎥</Typography>
        </Card>
      </Box>
    </Container>
  );
}

export default Home;
