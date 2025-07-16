import { Container, Typography, Button, TextField } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { fetchNearbyBusStop, fetchBusArrivalInfo } from '../services/busService';

const map_key = import.meta.env.VITE_WEATHER_MAP_API_KEY;

function BusPage() {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);

  const currentMarkerRef = useRef(null); // 빨간 현위치 마커
  const clickMarkerRef = useRef(null); // 기본 클릭 마커
  const greenMarkerRef = useRef(null); // 검색 위치 초록 마커

  const placesRef = useRef(null); // 카카오 장소 검색 객체

  const [coords, setCoords] = useState({ lat: null, lng: null });
  const [currentPosition, setCurrentPosition] = useState({ lat: null, lng: null });
  const [searchText, setSearchText] = useState('');

  // 마커 이미지들
  const redMarkerImage = new window.kakao.maps.MarkerImage(
    'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png',
    new window.kakao.maps.Size(24, 35)
  );
  const greenMarkerImage = new window.kakao.maps.MarkerImage(
    'https://i.imgur.com/jp7b1kd.png',
    new window.kakao.maps.Size(24, 35)
  );

  // 카카오 주소 검색 서비스 객체
  const geocoderRef = useRef(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${map_key}&autoload=false&libraries=services,places`;
    script.async = true;

    script.onload = () => {
      window.kakao.maps.load(() => {
        mapRef.current = new window.kakao.maps.Map(mapContainer.current, {
          center: new window.kakao.maps.LatLng(33.450701, 126.570667),
          level: 3,
        });

        geocoderRef.current = new window.kakao.maps.services.Geocoder();
        placesRef.current = new window.kakao.maps.services.Places();

        // 최초 1회 현재 위치 가져오기
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const { latitude, longitude } = pos.coords;
            const latlng = new window.kakao.maps.LatLng(latitude, longitude);
            mapRef.current.setCenter(latlng);
            setCoords({ lat: latitude, lng: longitude });
            setCurrentPosition({ lat: latitude, lng: longitude });

            currentMarkerRef.current = new window.kakao.maps.Marker({
              position: latlng,
              image: redMarkerImage,
              map: mapRef.current,
            });
          },
          (error) => {
            console.error('현재 위치를 가져오는 데 실패했습니다.', error);
          }
        );

        // 지도 클릭 시 마커 이동
        window.kakao.maps.event.addListener(mapRef.current, 'click', (mouseEvent) => {
          const lat = mouseEvent.latLng.getLat();
          const lng = mouseEvent.latLng.getLng();
          setCoords({ lat, lng });

          if (clickMarkerRef.current) {
            clickMarkerRef.current.setMap(null);
          }

          clickMarkerRef.current = new window.kakao.maps.Marker({
            position: mouseEvent.latLng,
            map: mapRef.current,
          });

          // 초록 마커 있으면 제거 (검색 위치 마커는 클릭 시 삭제)
          if (greenMarkerRef.current) {
            greenMarkerRef.current.setMap(null);
            greenMarkerRef.current = null;
          }
        });
      });
    };

    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  // 현위치로 돌아가기 버튼
  const handleGoCurrentLocation = () => {
    if (!currentPosition.lat || !currentPosition.lng) return;

    const latlng = new window.kakao.maps.LatLng(currentPosition.lat, currentPosition.lng);
    mapRef.current.setCenter(latlng);
    setCoords({ lat: currentPosition.lat, lng: currentPosition.lng });

    // 클릭 마커 제거
    if (clickMarkerRef.current) {
      clickMarkerRef.current.setMap(null);
      clickMarkerRef.current = null;
    }

    // 초록 마커 제거
    if (greenMarkerRef.current) {
      greenMarkerRef.current.setMap(null);
      greenMarkerRef.current = null;
    }

    // 빨간 마커 위치 업데이트
    if (currentMarkerRef.current) {
      currentMarkerRef.current.setPosition(latlng);
    } else {
      currentMarkerRef.current = new window.kakao.maps.Marker({
        position: latlng,
        image: redMarkerImage,
        map: mapRef.current,
      });
    }
  };

  // 검색 실행 함수 - keywordSearch 사용
  const handleSearch = () => {
    if (!searchText.trim()) return;
    if (!placesRef.current) return;

    placesRef.current.keywordSearch(searchText, (result, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        const loc = result[0];
        const lat = parseFloat(loc.y);
        const lng = parseFloat(loc.x);
        const latlng = new window.kakao.maps.LatLng(lat, lng);

        // 초록 마커 위치 설정
        if (greenMarkerRef.current) {
          greenMarkerRef.current.setPosition(latlng);
        } else {
          greenMarkerRef.current = new window.kakao.maps.Marker({
            position: latlng,
            image: greenMarkerImage,
            map: mapRef.current,
          });
        }

        // 지도 중심 이동
        mapRef.current.setCenter(latlng);

        // coords 상태 변경 → BusInfo 갱신
        setCoords({ lat, lng });

        // 클릭 마커 제거 (검색 위치가 우선)
        if (clickMarkerRef.current) {
          clickMarkerRef.current.setMap(null);
          clickMarkerRef.current = null;
        }
      } else {
        alert('검색 결과가 없습니다.');
      }
    });
  };

  return (
    <Container
      maxWidth="md"
      sx={{
        justifyContent: 'center',
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Typography variant="h5" gutterBottom>
        버스 위치 지도
      </Typography>
      <Button
        variant="contained"
        sx={{ mb: 2 }}
        onClick={handleGoCurrentLocation}
        disabled={!currentPosition.lat}
      >
        현위치로 돌아가기
      </Button>

      <div style={{ marginBottom: 16, display: 'flex', gap: 8, width: '700px' }}>
        <TextField
          label="장소 검색"
          variant="outlined"
          fullWidth
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSearch();
            }
          }}
        />
        <Button variant="contained" onClick={handleSearch}>
          검색
        </Button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <div
          id="map"
          ref={mapContainer}
          style={{ width: '700px', height: '700px', marginRight: '700px' }}
        />
        <div style={{ minWidth: 'auto', maxWidth: 'auto', textAlign: 'center' }}>
          <BusInfo lat={coords.lat} lng={coords.lng} />
        </div>
      </div>
    </Container>
  );
}

function BusInfo({ lat, lng }) {
  const [tableHtml, setTableHtml] = useState('');

  useEffect(() => {
    if (!lat || !lng) return;

    async function fetchAndRenderBusInfo() {
      try {
        const nearbyStops = await fetchNearbyBusStop(lat, lng);
        if (!nearbyStops || nearbyStops.length === 0) {
          setTableHtml('<div>주변 정류장을 찾을 수 없습니다.</div>');
          return;
        }

        const { citycode, nodeid } = nearbyStops[0] || nearbyStops;

        const arrivalList = await fetchBusArrivalInfo(citycode, nodeid);
        if (!arrivalList || arrivalList.length === 0) {
          setTableHtml('<div>버스 정보 없음</div>');
          return;
        }

        const nodenm = arrivalList[0].nodenm;
        let tab = '<table>';
        tab += `<tr><th>${nodenm}</th></tr>`;
        tab += '<tr><th>버스번호</th><th>도착예정</th></tr>';

        arrivalList.forEach((bus) => {
          const busNo = bus.routeno;
          let arriveTime2 = Math.floor(bus.arrtime / 60);
          const display = arriveTime2 < 1 ? '곧 도착' : `${arriveTime2}분`;
          tab += `<tr><td>${busNo}</td><td>${display}</td></tr>`;
        });

        tab += '</table>';
        setTableHtml(
          `<div id="table-container" style="max-height:300px; overflow-y:auto;">${tab}</div>`
        );
      } catch (error) {
        console.error('버스 정보 로딩 실패:', error);
        setTableHtml('<div>버스 정보를 불러오는 중 오류가 발생했습니다.</div>');
      }
    }

    fetchAndRenderBusInfo();
    const timer = setInterval(fetchAndRenderBusInfo, 60000);
    return () => clearInterval(timer);
  }, [lat, lng]);

  return <div dangerouslySetInnerHTML={{ __html: tableHtml }} />;
}

export default BusPage;
