import React, { useEffect, useRef, useState } from 'react';
import { fetchBusStationAndArrival } from '../services/busService';

const map_key = import.meta.env.VITE_WEATHER_MAP_API_KEY;

function BusPage() {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [coords, setCoords] = useState({ lat: null, lng: null });
  const [busData, setBusData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${map_key}&autoload=false`;
    script.async = true;
    script.onload = () => {
      window.kakao.maps.load(() => {
        const mapOptions = {
          center: new window.kakao.maps.LatLng(37.5665, 126.9780),
          level: 3,
        };
        mapRef.current = new window.kakao.maps.Map(mapContainer.current, mapOptions);

        window.kakao.maps.event.addListener(mapRef.current, 'click', async (mouseEvent) => {
          const lat = mouseEvent.latLng.getLat();
          const lng = mouseEvent.latLng.getLng();
          setCoords({ lat, lng });

          if (markerRef.current) markerRef.current.setMap(null);
          markerRef.current = new window.kakao.maps.Marker({
            position: mouseEvent.latLng,
            map: mapRef.current,
          });

          try {
            const data = await fetchBusStationAndArrival(lat, lng);
            setBusData(data);
            setError(null);
          } catch (e) {
            setBusData(null);
            setError('버스 정보를 불러오는 데 실패했습니다.');
            console.error(e);
          }
        });
      });
    };
    document.head.appendChild(script);

    const watchID = navigator.geolocation.watchPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      setCoords({ lat: latitude, lng: longitude });

      if (mapRef.current) {
        mapRef.current.setCenter(new window.kakao.maps.LatLng(latitude, longitude));
      }
    });

    return () => {
      document.head.removeChild(script);
      navigator.geolocation.clearWatch(watchID);
    };
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'row', minHeight: '100vh' }}>
      <div id="map" ref={mapContainer} style={{ width: '50%' }} />
      <div style={{ width: '50%', padding: '20px' }}>
        {error && <div>{error}</div>}
        {!busData && !error && <div>지도를 클릭해 정류장을 선택하세요</div>}
        {busData && (
          <div>
            <h3>{busData.stationName}</h3>
            <table>
              <thead>
                <tr>
                  <th>버스 번호</th>
                  <th>도착 예정</th>
                </tr>
              </thead>
              <tbody>
                {busData.buses.map((bus, idx) => {
                  const arrival = Math.floor(bus.arrtime / 60);
                  const timeStr = arrival < 1 ? '곧 도착' : `${arrival}분`;
                  return (
                    <tr key={idx}>
                      <td>{bus.routeno}</td>
                      <td>{timeStr}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default BusPage;
