// my-react-app\src\components\WeatherMap.jsx

import React, { useEffect, useState } from 'react';

const WeatherMap = ({ lat, lon }) => {
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    // 스크립트 중복로딩 방지
    if (window.kakao && window.kakao.maps) {
      setMapLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_WEATHER_MAP_API_KEY}&libraries=services&autoload=false`;
    script.onload = () => setMapLoaded(true);
    document.head.appendChild(script);

    return () => {
      // cleanup은 필요 없지만 상황에 따라 스크립트 제거 가능
    };
  }, []);

  useEffect(() => {
    if (!mapLoaded || !lat || !lon) return;

    window.kakao.maps.load(() => {
      const container = document.getElementById('map');
      const options = {
        center: new window.kakao.maps.LatLng(lat, lon),
        level: 4,
      };

      const map = new window.kakao.maps.Map(container, options);
      const markerPosition = new window.kakao.maps.LatLng(lat, lon);
      const marker = new window.kakao.maps.Marker({ position: markerPosition });
      marker.setMap(map);
    });
  }, [mapLoaded, lat, lon]);


  return (
    <div
      id="map"
      style={{
        width: '100%',
        aspectRatio: '4 / 3', // 가로 3, 세로 4로 비율 설정
        maxHeight: '80vh',     // 너무 길어지는 거 방지
        minHeight: '400px',    // 최소 높이
      }}
    ></div>
  );
};

export default WeatherMap;
