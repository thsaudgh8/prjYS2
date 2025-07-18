import React, { useEffect, useRef, useState } from 'react';
import { Container, Box, Typography } from '@mui/material';
import { useLocation } from '../hooks/useLocation';
import HomeWeather from '../components/HomeWeather';
import HomeDust from '../components/HomeDust';
import { convertLatLonToGrid } from '../utils/convertGrid'; // 좌표 변환 함수 경로 맞게 조정

function Home() {
  const { location, loading, error } = useLocation();
  const mapRef = useRef(null);
  const [address, setAddress] = useState('');
  const [map, setMap] = useState(null);
  const [kakaoLoaded, setKakaoLoaded] = useState(false);

  // Kakao Map SDK 로딩
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

  // Kakao Map 초기화 및 주소 변환
  useEffect(() => {
    if (!kakaoLoaded) return;
    if (loading || !location?.lat || !location?.lon || !mapRef.current) return;

    // 이미 지도 생성되어 있으면 새로 생성하지 않음
    if (map) return;

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
        } else {
          setAddress('주소를 불러올 수 없습니다');
        }
      });
    });
  }, [kakaoLoaded, loading, location, map]);

  if (loading) return <Typography>위치 정보를 불러오는 중...</Typography>;
  if (error) return <Typography color="error">위치 정보 오류: {error}</Typography>;

  // location이 있을 때만 nx, ny 계산 (기상청 격자 좌표)
  const { nx, ny } = location ? convertLatLonToGrid(location.lat, location.lon) : { nx: null, ny: null };

  // 임시 미세먼지 더미 데이터 (추후 실제 API 연동 필요)
  const pm10Hourly = [20, 25, 30, 35, 40, 45];
  const pm25Hourly = [10, 12, 15, 18, 20, 22];

  return (
    <Container
      maxWidth="xl"
      sx={{
        minHeight: '85vh',
        display: 'flex',
        gap: 2,
        py: 4,
        px: { xs: 2, sm: 4, md: 8 },
        flexDirection: { xs: 'column', md: 'row' },
      }}
    >
      {/* 좌측 지도 + 주소 영역 */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          height: { xs: 'auto', md: '750px' },
          minHeight: { xs: 400, md: 0 },
        }}
      >
        <Box sx={{ p: 2, bgcolor: '#81d4fa', color: 'white', borderRadius: 2 }}>
          <Typography variant="h6" fontWeight="bold">
            현위치 주소
          </Typography>
          <Typography>{address}</Typography>
        </Box>

        <Box
          ref={mapRef}
          sx={{
            flex: 1,
            borderRadius: 2,
            bgcolor: '#e0e0e0',
            minHeight: { xs: 200, md: 0 },
          }}
        />
      </Box>

      {/* 우측 날씨+미세먼지 영역 */}
      <Box
        sx={{
          flexBasis: { xs: '100%', md: '400px' },
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          height: { xs: 'auto', md: '500px' },
        }}
      >
        {nx && ny ? (
          <>
            <HomeWeather nx={nx} ny={ny} />
            <HomeDust pm10Hourly={pm10Hourly} pm25Hourly={pm25Hourly} />
          </>
        ) : (
          <Typography>현재 위치 기반 좌표를 계산 중입니다...</Typography>
        )}
      </Box>
    </Container>
  );
}

export default Home;
