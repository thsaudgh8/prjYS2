const API_KEY = import.meta.env.VITE_BUS_API_KEY;

// 정류장 목록 조회
export async function fetchBusStops(stopName, cityCode) {
  const url = `https://apis.data.go.kr/1613000/BusSttnInfoInqireService/getSttnNoList?serviceKey=${API_KEY}&sttnNm=${encodeURIComponent(stopName)}&cityCode=${cityCode}&_type=json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('네트워크 응답 문제');
  const data = await res.json();
  return data;
}

// 정류장별 경유 노선 조회
export async function fetchRoutesByStop(cityCode, nodeid) {
  const url = `https://apis.data.go.kr/1613000/BusSttnInfoInqireService/getSttnThrghRouteList?serviceKey=${API_KEY}&cityCode=${cityCode}&nodeid=${nodeid}&_type=json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('네트워크 응답 문제');
  const data = await res.json();
  return data;
}
