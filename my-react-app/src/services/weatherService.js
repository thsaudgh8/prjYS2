// // API 요청 관련 함수 사용

// // my-react-app/src/services/weatherService.js
// export async function fetchShortTermForecast({ baseDate, baseTime, nx, ny }) {
//   const serviceKey = import.meta.env.VITE_WEATHER_API_KEY;;
//   const url = `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=${serviceKey}&pageNo=1&numOfRows=100&dataType=JSON&base_date=${baseDate}&base_time=${baseTime}&nx=${nx}&ny=${ny}`;

//   const res = await fetch(url);
//   if (!res.ok) throw new Error("API 요청 실패");
//   const data = await res.json();
//   return data.response.body.items.item; // 예보 리스트 반환
// }

// services/weatherService.js
const SERVICE_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const BASE_URL = 'https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst';

function getBaseDateTime() {
  const now = new Date();
  let baseDate = now.toISOString().slice(0, 10).replace(/-/g, '');
  const baseTime = '0200';

  if (now.getHours() < 2) {
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    baseDate = yesterday.toISOString().slice(0, 10).replace(/-/g, '');
  }

  return { baseDate, baseTime };
}

export async function fetchTodayMinMaxTemp(nx, ny) {
  const { baseDate, baseTime } = getBaseDateTime();

  const url = `${BASE_URL}?serviceKey=${SERVICE_KEY}&pageNo=1&numOfRows=400&dataType=JSON&base_date=${baseDate}&base_time=${baseTime}&nx=${nx}&ny=${ny}`;

  const res = await fetch(url);
  const data = await res.json();

  const items = data.response.body.items.item;

  let maxTemp = null;
  let minTemp = null;

  for (const item of items) {
    if (item.fcstDate === baseDate) {
      if (item.category === 'TMX') maxTemp = item.fcstValue;
      if (item.category === 'TMN') minTemp = item.fcstValue;
    }
  }

  return { maxTemp, minTemp };
}
