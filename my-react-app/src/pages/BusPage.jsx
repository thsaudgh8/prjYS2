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
    const markerRef = useRef(null);   // 마커 참조를 위한 useRef
    const [coords, setCoords] = useState({ lat: null, lng: null });

    useEffect(() => {
      const script = document.createElement('script');
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${map_key}&autoload=false`;
      script.async = true;
      script.onload = () => {
        window.kakao.maps.load(() => {
          const options = {
            center: new window.kakao.maps.LatLng(null, null), // 기본 중심 좌표
            level: 3
          };
          mapRef.current = new window.kakao.maps.Map(mapContainer.current, options);

          // 클릭 이벤트 핸들러
          window.kakao.maps.event.addListener(
            mapRef.current,
            'click',
            (mouseEvent) => {
              rat = mouseEvent.latLng.getLat();
              rng = mouseEvent.latLng.getLng();
              setCoords({ lat: rat, lng: rng });

              // 이전 마커가 있으면 지도에서 제거
              if (markerRef.current) {
                markerRef.current.setMap(null);
              }

              // 새 마커 생성 및 ref에 저장
              markerRef.current = new window.kakao.maps.Marker({
                position: mouseEvent.latLng,
                map: mapRef.current
              });
        });
      });
    };
    document.head.appendChild(script);

    // 위치 추적 시작
    const watchID = navigator.geolocation.watchPosition((position) => {
      setCoords({ lat: position.coords.latitude, lng: position.coords.longitude });
      rat = position.coords.latitude;
      rng = position.coords.longitude;
    });

    // cleanup: 지도 스크립트 및 위치 추적 중지
    return () => {
      document.head.removeChild(script);
      navigator.geolocation.clearWatch(watchID);
    };
  }, []);

  // coords가 변경될 때마다 지도 중심 갱신
  navigator.geolocation.watchPosition((pos) => {
    const lat = pos.coords.latitude;
    const lng = pos.coords.longitude;
    setCoords({ lat, lng });

    // 위치추적 때만 중심 이동
    if (mapRef.current) {
      mapRef.current.setCenter(new window.kakao.maps.LatLng(lat, lng));
    }
  });


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
      const url =
        "http://apis.data.go.kr/1613000/BusSttnInfoInqireService/getCrdntPrxmtSttnList";
      let queryParams =
        "?" + encodeURIComponent("serviceKey") + "=" + SERVICE_KEY;
      queryParams +=
        "&" + encodeURIComponent("pageNo") + "=" + encodeURIComponent("1");
      queryParams +=
        "&" + encodeURIComponent("numOfRows") + "=" + encodeURIComponent("1");
      queryParams +=
        "&" + encodeURIComponent("_type") + "=" + encodeURIComponent("json");
      queryParams +=
        "&" + encodeURIComponent("gpsLati") + "=" + encodeURIComponent(rat);
      queryParams +=
        "&" + encodeURIComponent("gpsLong") + "=" + encodeURIComponent(rng);

      fetch(url + queryParams)
        .then((res) => res.json())
        .then((response) => {
          const item = response.response.body.items.item;
          const citycode = item.citycode;
          const nodeid = item.nodeid;
          const url2 =
            "http://apis.data.go.kr/1613000/ArvlInfoInqireService/getSttnAcctoArvlPrearngeInfoList";
          let queryParams2 =
            "?" + encodeURIComponent("serviceKey") + "=" + SERVICE_KEY;
          queryParams2 +=
            "&" + encodeURIComponent("pageNo") + "=" + encodeURIComponent("1");
          queryParams2 +=
            "&" + encodeURIComponent("numOfRows") + "=" + encodeURIComponent("50");
          queryParams2 +=
            "&" + encodeURIComponent("_type") + "=" + encodeURIComponent("json");
          queryParams2 +=
            "&" + encodeURIComponent("cityCode") + "=" + encodeURIComponent(citycode);
          queryParams2 +=
            "&" + encodeURIComponent("nodeId") + "=" + encodeURIComponent(nodeid);

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
            <TableCell>{nodenm}</TableCell>
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