// WeatherMap.jsx

import React from 'react';
import { Map, MapMarker } from 'react-kakao-maps-sdk';

const WeatherMap = ({ lat, lon }) => {
  return (
    <Map
      center={{ lat, lng: lon }}
      style={{ width: '100%', height: '400px' }}
      level={3}
    >
      <MapMarker position={{ lat, lng: lon }}>
        <div style={{ padding: '5px', fontSize: '14px' }}>현재 위치</div>
      </MapMarker>
    </Map>
  );
};

export default WeatherMap;
