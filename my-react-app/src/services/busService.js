const SERVICE_KEY = import.meta.env.VITE_BUS_API_KEY;

// 버스 정류장 정보 가져오기 (좌표 기반)
export async function fetchNearbyBusStop(lat, lng) {
  const url = "http://apis.data.go.kr/1613000/BusSttnInfoInqireService/getCrdntPrxmtSttnList";

  let queryParams = `?serviceKey=${SERVICE_KEY}`;
  queryParams += `&pageNo=1&numOfRows=1&_type=json`;
  queryParams += `&gpsLati=${encodeURIComponent(lat)}`;
  queryParams += `&gpsLong=${encodeURIComponent(lng)}`;

  const response = await fetch(url + queryParams);
  const data = await response.json();

  return data.response?.body?.items?.item;
}

// 정류장에 도착 예정인 버스 정보 가져오기
export async function fetchBusArrivalInfo(cityCode, nodeId) {
  const url = "http://apis.data.go.kr/1613000/ArvlInfoInqireService/getSttnAcctoArvlPrearngeInfoList";

  let queryParams = `?serviceKey=${SERVICE_KEY}`;
  queryParams += `&pageNo=1&numOfRows=50&_type=json`;
  queryParams += `&cityCode=${encodeURIComponent(cityCode)}`;
  queryParams += `&nodeId=${encodeURIComponent(nodeId)}`;

  const response = await fetch(url + queryParams);
  const data = await response.json();

  return data.response?.body?.items?.item;
}
