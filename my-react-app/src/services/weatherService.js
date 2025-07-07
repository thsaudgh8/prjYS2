// API 요청 관련 함수 사용

// my-react-app/src/services/weatherService.js
export async function fetchShortTermForecast({ baseDate, baseTime, nx, ny }) {
  const serviceKey = import.meta.env.VITE_WEATHER_API_KEY;;
  const url = `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=${serviceKey}&pageNo=1&numOfRows=1000&dataType=JSON&base_date=${baseDate}&base_time=${baseTime}&nx=${nx}&ny=${ny}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("API 요청 실패");
  const data = await res.json();
  return data.response.body.items.item; // 예보 리스트 반환
}
