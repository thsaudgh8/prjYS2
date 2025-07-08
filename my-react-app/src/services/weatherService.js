// // API 요청 관련 함수 사용

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

export async function fetchTodayMinMaxTemp(lat, lon) {
  const { baseDate, baseTime } = getBaseDateTime();

  const url = `${BASE_URL}?serviceKey=${SERVICE_KEY}&pageNo=1&numOfRows=400&dataType=JSON&base_date=${baseDate}&base_time=${baseTime}&nx=${lat}&ny=${lon}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("API 요청 실패");
  const data = await res.json();

  // 방어적 체크
  if (
    !data.response ||
    !data.response.body ||
    !data.response.body.items ||
    !data.response.body.items.item
  ) {
    throw new Error("API 데이터 구조 오류 또는 데이터 없음");
  }

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


const ULTRA_SHORT_URL = 'https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst';

function getUltraBaseDateTime() {   // 기상청 초단기예보 기준 시간 계산
  const now = new Date();
  let baseDate = now.toISOString().slice(0, 10).replace(/-/g, '');

  let hour = now.getHours();
  let minute = now.getMinutes();

  // 45분 전까지만 기준시간으로 인정됨
  if (minute < 45) hour -= 1;
  const baseTime = String(hour).padStart(2, '0') + '30';

  return { baseDate, baseTime };
}
export async function fetchCurrentConditions(nx, ny) {
  const { baseDate, baseTime } = getUltraBaseDateTime();

  const url = `${ULTRA_SHORT_URL}?serviceKey=${SERVICE_KEY}&pageNo=1&numOfRows=100&dataType=JSON&base_date=${baseDate}&base_time=${baseTime}&nx=${nx}&ny=${ny}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("초단기예보 API 요청 실패");

  const data = await res.json();

  if (
    !data.response ||
    !data.response.body ||
    !data.response.body.items ||
    !data.response.body.items.item
  ) {
    throw new Error("초단기예보 응답 구조 오류 또는 데이터 없음");
  }

  const items = data.response.body.items.item;

  const getValue = (category) =>
    items.find((item) => item.category === category)?.fcstValue ?? null;

  return {
    temp: getValue('T1H'),
    sky: getValue('SKY'),
    rain: getValue('RN1'),
    pop: getValue('POP'), // 강수 확률 추가
  };
}
