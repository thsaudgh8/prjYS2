import React, { useEffect, useRef, useState } from 'react';
import { Container, Box, Typography, Card } from '@mui/material';
import { useLocation } from '../hooks/useLocation';

function Home() {
  const { location, loading, error } = useLocation();
  const mapRef = useRef(null);
  const [address, setAddress] = useState('');
  const [map, setMap] = useState(null);
  const [kakaoLoaded, setKakaoLoaded] = useState(false);

  // 카카오맵 API 스크립트 동적 로드
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
    <Container maxWidth="xl" sx={{ minHeight: '85vh', display: 'flex', gap: 2, py: 4 }}>
      {/* 좌측 지도 */}
      <Box
        ref={mapRef}
        sx={{ flex: 1, height: 500, borderRadius: 2, bgcolor: '#e0e0e0' }}
      />

      {/* 우측 정보 */}
      <Box sx={{ flexBasis: '400px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Card sx={{ p: 2, bgcolor: '#81d4fa', color: 'white' }}>
          <Typography variant="h6" fontWeight="bold">
            현위치 주소
          </Typography>
          <Typography>{address}</Typography>
        </Card>

        {/* 날씨, 미세먼지 카드도 여기 넣으면 됨 */}
      </Box>
    </Container>
  );
}

export default Home;
