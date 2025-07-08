//좌표 변환 함수 (WGS84 -> 기상청 격자 좌표)

export function convertLatLonToGrid(lat, lon) {
  // 기상청 API 격자좌표 변환 공식
  const RE = 6371.00877; // 지구 반경(km)
  const GRID = 5.0;      // 격자 간격(km)
  const SLAT1 = 30.0;    // 투영 위도1(degree)
  const SLAT2 = 60.0;    // 투영 위도2(degree)
  const OLON = 126.0;    // 기준점 경도(degree)
  const OLAT = 38.0;     // 기준점 위도(degree)
  const XO = 43;         // 기준점 X좌표(GRID)
  const YO = 136;        // 기준점 Y좌표(GRID)

  const DEGRAD = Math.PI / 180.0;

  const re = RE / GRID;
  const slat1 = SLAT1 * DEGRAD;
  const slat2 = SLAT2 * DEGRAD;
  const olon = OLON * DEGRAD;
  const olat = OLAT * DEGRAD;

  let sn = Math.tan(Math.PI * 0.25 + slat2 * 0.5) / Math.tan(Math.PI * 0.25 + slat1 * 0.5);
  sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn);
  let sf = Math.tan(Math.PI * 0.25 + slat1 * 0.5);
  sf = (Math.pow(sf, sn) * Math.cos(slat1)) / sn;
  let ro = Math.tan(Math.PI * 0.25 + olat * 0.5);
  ro = (re * sf) / Math.pow(ro, sn);
  let rs = {};
  let ra = Math.tan(Math.PI * 0.25 + (lat) * DEGRAD * 0.5);
  ra = (re * sf) / Math.pow(ra, sn);
  let theta = lon * DEGRAD - olon;
  if (theta > Math.PI) theta -= 2.0 * Math.PI;
  if (theta < -Math.PI) theta += 2.0 * Math.PI;
  theta *= sn;
  rs['x'] = Math.floor(ra * Math.sin(theta) + XO + 0.5);
  rs['y'] = Math.floor(ro - ra * Math.cos(theta) + YO + 0.5);
  return { nx: rs.x, ny: rs.y };
}


export function convertSkyCode(code) {  // 기상청 하늘상태 코드 변환 함수  
  switch (parseInt(code)) {
    case 1: return '☀️ 맑음';
    case 3: return '⛅ 구름 많음';
    case 4: return '☁️ 흐림';
    default: return '❓ 알 수 없음';
  }
}
