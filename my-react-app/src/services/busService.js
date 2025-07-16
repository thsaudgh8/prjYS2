const SERVICE_KEY = import.meta.env.VITE_BUS_API_KEY;

export async function fetchBusStationAndArrival(lat, lng) {
  const stationUrl = `https://apis.data.go.kr/1613000/BusSttnInfoInqireService/getCrdntPrxmtSttnList?serviceKey=${SERVICE_KEY}&gpsLati=${lat}&gpsLong=${lng}&_type=json&pageNo=1&numOfRows=1`;
  const stationRes = await fetch(stationUrl);
  const stationData = await stationRes.json();

  const station = stationData.response?.body?.items?.item;
  if (!station) throw new Error('정류장 정보를 찾을 수 없습니다.');
  const { nodeid, citycode, nodenm } = station;

  const arrivalUrl = `https://apis.data.go.kr/1613000/ArvlInfoInqireService/getSttnAcctoArvlPrearngeInfoList?serviceKey=${SERVICE_KEY}&cityCode=${citycode}&nodeId=${nodeid}&_type=json&pageNo=1&numOfRows=50`;
  const arrivalRes = await fetch(arrivalUrl);
  const arrivalData = await arrivalRes.json();

  const items = arrivalData.response?.body?.items?.item;
  if (!items) throw new Error('도착 정보를 찾을 수 없습니다.');

  return {
    stationName: nodenm,
    buses: Array.isArray(items) ? items : [items],
  };
}