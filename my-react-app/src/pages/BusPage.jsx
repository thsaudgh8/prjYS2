// 지도 기반 버스 정보 페이지

import { Container, Typography } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';


const SERVICE_KEY = import.meta.env.VITE_BUS_KEY; // 실제 서비스키로 교체
const map_key = import.meta.env.VITE_MAP_KEY; // 실제 지도 API 키로 교체

function Home() {
  const mapContainer = useRef(null);
  const mapRef = useRef(null); // 지도 객체 저장
  const [coords, setCoords] = useState({ lat: null, lng: null });

  useEffect(() => {
    // Kakao Maps SDK 스크립트 엘리먼트 생성
    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${map_key}&autoload=false`;
    script.async = true;
    script.onload = () => {
      window.kakao.maps.load(() => {
        const options = {
          center: new window.kakao.maps.LatLng(null, null), // 초기 중심 좌표: null
          level: 3
        };
        mapRef.current = new window.kakao.maps.Map(mapContainer.current, options);
      });
    };
    document.head.appendChild(script);

    // 위치 추적 시작
    const watchID = navigator.geolocation.watchPosition((position) => {
      setCoords({ lat: position.coords.latitude, lng: position.coords.longitude });
    });

    // cleanup: 지도 스크립트 및 위치 추적 중지
    return () => {
      document.head.removeChild(script);
      navigator.geolocation.clearWatch(watchID);
    };
  }, []);

  // coords가 변경될 때마다 지도 중심 갱신
  useEffect(() => {
    if (coords.lat && coords.lng && mapRef.current) {
      const newCenter = new window.kakao.maps.LatLng(coords.lat, coords.lng);
      mapRef.current.setCenter(newCenter);
    }
  }, [coords]);

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
      <div>
        <div
          id="map"
          ref={mapContainer}
          style={{ width: '700px', height: '700px', marginRight: '800px' }}
        />
        <div style={{ minWidth: '700px', maxWidth: '700px', marginLeft: '800px', textAlign: 'center' }}>
          <BusInfo lat={coords.lat} lng={coords.lng} />
        </div>
      </div>
    </Container>
  );
}

function BusInfo({ lat, lng }) {
  const [tableHtml, setTableHtml] = useState("");

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
        "&" + encodeURIComponent("gpsLati") + "=" + encodeURIComponent(lat);
      queryParams +=
        "&" + encodeURIComponent("gpsLong") + "=" + encodeURIComponent(lng);

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
                setTableHtml("<div>버스 정보 없음</div>");
                return;
              }
              const nodenm = items[0].nodenm;
              let tab = "<table>";
              tab += `<tr><th>${nodenm}</th></tr>`;
              tab += "<tr><th>버스번호</th><th>도착예정</th></tr>";
              items.forEach((bus) => {
                const busNo = bus.routeno;
                let arriveTime2 = Math.floor(bus.arrtime / 60);
                if (arriveTime2 < 1) {
                  arriveTime2 = "곧 도착";
                  tab += `<tr><td>${busNo}</td><td>${arriveTime2}</td></tr>`;
                } else {
                  tab += `<tr><td>${busNo}</td><td>${arriveTime2}분</td></tr>`;
                }
              });
              tab += "</table>";
              setTableHtml(
                `<div id="table-container" style="max-height:300px; overflow-y:auto;">${tab}</div>`
              );
            });
        });
    }
    fetchAndRenderBusInfo();
    const timer = setInterval(fetchAndRenderBusInfo, 60000);
    return () => clearInterval(timer);
  }, [lat, lng]);

  return (
    <div dangerouslySetInnerHTML={{ __html: tableHtml }} />
  );
}

export default Home;
