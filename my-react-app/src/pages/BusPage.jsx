// 지도 기반 버스 정보 페이지

import React, { useEffect, useRef, useState } from 'react';
import {
  Container, Typography, Table, TableHead,
  TableBody, TableRow, TableCell, TableContainer, Paper
} from '@mui/material';

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
  const isClick = useRef(false); // 클릭 여부 추적

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
             // 클릭 시에는 중심 이동을 하지 않음
            isClick.current = true; // 클릭 발생
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

  // 위치 추적 때만 중심 이동 및 마커 표시
  useEffect(() => {
    if (coords.lat && coords.lng && mapRef.current && !isClick.current) {
      // 위치 추적 때만 중심을 이동하고 마커를 표시
      mapRef.current.setCenter(new window.kakao.maps.LatLng(coords.lat, coords.lng));

      // 마커가 없으면 새로 생성
      if (!markerRef.current) {
        markerRef.current = new window.kakao.maps.Marker({
          position: new window.kakao.maps.LatLng(coords.lat, coords.lng),
          map: mapRef.current
        });
      } else {
        // 기존 마커의 위치를 갱신
        markerRef.current.setPosition(new window.kakao.maps.LatLng(coords.lat, coords.lng));
      }
    }
  }, [coords]);  // coords가 변경될 때마다 실행


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

              // 정렬 함수
              const sortBusData = (a, b) => {
                const busNoA = String(a.busNo);
                const busNoB = String(b.busNo);

                // 1. 번호-번호 우선 (먼저 숫자 비교, -가 없으면 숫자만 비교)
                const [mainA, subA] = busNoA.split("-");
                const [mainB, subB] = busNoB.split("-");

                // 2. 번호가 더 작은 것이 우선
                if (parseInt(mainA, 10) !== parseInt(mainB, 10)) {
                  return parseInt(mainA, 10) - parseInt(mainB, 10);
                }

                // 3. 번호-번호일 경우, -뒤의 번호가 더 작은 것이 우선
                if (subA && subB) {
                  if (parseInt(subA, 10) !== parseInt(subB, 10)) {
                    return parseInt(subA, 10) - parseInt(subB, 10);
                  }
                } else if (subA) {
                  return -1; // subA가 있으면 더 우선
                } else if (subB) {
                  return 1; // subB가 있으면 더 우선
                }

                // 4. 문자로 시작한 버스 번호는 뒤로
                const isAlphaA = /^[a-zA-Z]/.test(busNoA);
                const isAlphaB = /^[a-zA-Z]/.test(busNoB);
                if (isAlphaA !== isAlphaB) {
                  return isAlphaA ? 1 : -1;
                }

                // 5. 동일한 번호일 때 도착 시간 비교
                if (a.arriveTime !== b.arriveTime) {
                  return a.arriveTime.localeCompare(b.arriveTime);
                }

                return 0; // 같은 경우에는 변경하지 않음
              };

              // 정렬 적용
              const sortedBusData = busInfo.sort(sortBusData);

              // 동일한 번호에서 가장 빨리 도착하는 버스만 남기기
              const uniqueBuses = [];
              const busNosSeen = new Map();

              sortedBusData.forEach((bus) => {
                const busNo = String(bus.busNo);

                // -번호에서 번호만 추출
                const [mainBusNo] = busNo.split("-");

                // 첫 번째 등장 버스를 저장
                if (!busNosSeen.has(mainBusNo) || bus.arriveTime < busNosSeen.get(mainBusNo).arriveTime) {
                  busNosSeen.set(mainBusNo, bus);
                }
              });

              // `busNosSeen` Map의 값만 남기기
              setBusData(Array.from(busNosSeen.values()));
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
