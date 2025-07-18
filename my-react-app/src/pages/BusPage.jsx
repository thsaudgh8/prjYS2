// 지도 기반 버스 정보 페이지

import { Container, Typography, Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';

const SERVICE_KEY = import.meta.env.VITE_BUS_KEY; // 실제 서비스키로 교체
const map_key = import.meta.env.VITE_MAP_KEY; // 실제 지도 API 키로 교체
var rat = null;
var rng = null;
var nodenm = null;

function Home() {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);        // 클릭 마커
  const currentMarkerRef = useRef(null); // 현재 위치 빨간 마커
  const [coords, setCoords] = useState({ lat: null, lng: null });

  useEffect(() => {
    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${map_key}&autoload=false`;
    script.async = true;
    script.onload = () => {
      window.kakao.maps.load(() => {
        const options = {
          center: new window.kakao.maps.LatLng(37.5665, 126.9780), // 초기 중심 좌표 (서울 시청 등 기본값)
          level: 3,
        };
        mapRef.current = new window.kakao.maps.Map(mapContainer.current, options);

        // 지도 클릭 이벤트 - 클릭 위치 마커 표시
        window.kakao.maps.event.addListener(
          mapRef.current,
          'click',
          (mouseEvent) => {
            rat = mouseEvent.latLng.getLat();
            rng = mouseEvent.latLng.getLng();
            setCoords({ lat: rat, lng: rng });

            if (markerRef.current) {
              markerRef.current.setMap(null);
            }

            markerRef.current = new window.kakao.maps.Marker({
              position: mouseEvent.latLng,
              map: mapRef.current,
            });
          }
        );
      });
    };
    document.head.appendChild(script);

    // 현재 위치 추적 및 빨간 마커 표시
    const watchID = navigator.geolocation.watchPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        setCoords({ lat, lng });
        rat = lat;
        rng = lng;

        const latlng = new window.kakao.maps.LatLng(lat, lng);

        if (mapRef.current) {
          mapRef.current.setCenter(latlng);
        }

        // 기존 현재 위치 마커 제거
        if (currentMarkerRef.current) {
          currentMarkerRef.current.setMap(null);
        }

        // 빨간 마커 이미지
        const redMarkerImage = new window.kakao.maps.MarkerImage(
          'http://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png',
          new window.kakao.maps.Size(40, 42),
          { offset: new window.kakao.maps.Point(13, 42) }
        );

        // 현재 위치 빨간 마커 생성
        currentMarkerRef.current = new window.kakao.maps.Marker({
          position: latlng,
          image: redMarkerImage,
          map: mapRef.current,
        });
      },
      (error) => {
        console.error('현재 위치 정보를 가져올 수 없습니다.', error);
      },
      { enableHighAccuracy: true }
    );

    // 정리(cleanup)
    return () => {
      document.head.removeChild(script);
      navigator.geolocation.clearWatch(watchID);
    };
  }, []);

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
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <div
          id="map"
          ref={mapContainer}
          style={{ width: '700px', height: '700px', marginRight: '0px' }}
        />
        <div style={{ minWidth: '700px', maxWidth: '100px', textAlign: 'center' }}>
          <BusInfo lat={coords.lat} lng={coords.lng} />
        </div>
      </div>
    </Container>
  );
}

function BusInfo({ lat, lng }) {
  const [busData, setBusData] = useState([]);

  useEffect(() => {
    if (!lat || !lng) return;

    function fetchAndRenderBusInfo() {
      const url = "http://apis.data.go.kr/1613000/BusSttnInfoInqireService/getCrdntPrxmtSttnList";
      let queryParams = "?" + encodeURIComponent("serviceKey") + "=" + SERVICE_KEY;
      queryParams += "&" + encodeURIComponent("pageNo") + "=" + encodeURIComponent("1");
      queryParams += "&" + encodeURIComponent("numOfRows") + "=" + encodeURIComponent("1");
      queryParams += "&" + encodeURIComponent("_type") + "=" + encodeURIComponent("json");
      queryParams += "&" + encodeURIComponent("gpsLati") + "=" + encodeURIComponent(rat);
      queryParams += "&" + encodeURIComponent("gpsLong") + "=" + encodeURIComponent(rng);

      fetch(url + queryParams)
        .then((res) => res.json())
        .then((response) => {
          const item = response.response.body.items.item;
          if (!item) {
            setBusData([]);
            nodenm = null;
            return;
          }
          const citycode = item.citycode;
          const nodeid = item.nodeid;
          const url2 = "http://apis.data.go.kr/1613000/ArvlInfoInqireService/getSttnAcctoArvlPrearngeInfoList";
          let queryParams2 = "?" + encodeURIComponent("serviceKey") + "=" + SERVICE_KEY;
          queryParams2 += "&" + encodeURIComponent("pageNo") + "=" + encodeURIComponent("1");
          queryParams2 += "&" + encodeURIComponent("numOfRows") + "=" + encodeURIComponent("50");
          queryParams2 += "&" + encodeURIComponent("_type") + "=" + encodeURIComponent("json");
          queryParams2 += "&" + encodeURIComponent("cityCode") + "=" + encodeURIComponent(citycode);
          queryParams2 += "&" + encodeURIComponent("nodeId") + "=" + encodeURIComponent(nodeid);

          fetch(url2 + queryParams2)
            .then((res2) => res2.json())
            .then((response2) => {
              const items = response2.response.body.items.item;
              if (!items || items.length === 0) {
                setBusData([]);
                return;
              }

              const busInfo = items.map((bus) => {
                nodenm = items[0].nodenm;
                const busNo = bus.routeno;
                let arriveTime2 = Math.floor(bus.arrtime / 60);
                let busType = bus.routetp;
                if (arriveTime2 < 1) {
                  arriveTime2 = "곧 도착";
                } else {
                  arriveTime2 = `${arriveTime2}분`;
                }
                return { busNo, busType, arriveTime: arriveTime2 };
              });

              setBusData(busInfo);
            });
        });
    }
    fetchAndRenderBusInfo();
    const timer = setInterval(fetchAndRenderBusInfo, 60000);
    return () => clearInterval(timer);
  }, [lat, lng]);

  return (
    <TableContainer component={Paper} sx={{ maxHeight: '700px', overflow: 'auto' }}>
      <Table sx={{ minWidth: 200 }} aria-label="bus info table">
        <TableHead>
          <TableRow>
            <TableCell>{nodenm || '버스 정류장'}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>버스종류</TableCell>
            <TableCell>버스번호</TableCell>
            <TableCell>도착예정</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {busData.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} align="center">
                버스 정보 없음
              </TableCell>
            </TableRow>
          ) : (
            busData.map((bus, index) => (
              <TableRow key={index}>
                <TableCell>{bus.busType}</TableCell>
                <TableCell>{bus.busNo}</TableCell>
                <TableCell>{bus.arriveTime}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default Home;
