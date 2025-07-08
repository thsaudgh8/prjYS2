const SERVICE_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const BASE_URL = 'https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst';
const ULTRA_SHORT_URL = 'https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst';

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

function getUltraBaseDateTime() {
  const now = new Date();
  let baseDate = now.toISOString().slice(0, 10).replace(/-/g, '');
  let hour = now.getHours();
  let minute = now.getMinutes();

  if (minute < 45) hour -= 1;
  const baseTime = String(hour).padStart(2, '0') + '30';

  return { baseDate, baseTime };
}

export async function fetchTodayMinMaxTemp(nx, ny) {
  const { baseDate, baseTime } = getBaseDateTime();
  const url = `${BASE_URL}?serviceKey=${SERVICE_KEY}&pageNo=1&numOfRows=400&dataType=JSON&base_date=${baseDate}&base_time=${baseTime}&nx=${nx}&ny=${ny}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("API 요청 실패");
  const data = await res.json();
  const items = data.response?.body?.items?.item ?? [];

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

export async function fetchTodayPop(nx, ny) {
  const { baseDate, baseTime } = getBaseDateTime();
  const url = `${BASE_URL}?serviceKey=${SERVICE_KEY}&pageNo=1&numOfRows=400&dataType=JSON&base_date=${baseDate}&base_time=${baseTime}&nx=${nx}&ny=${ny}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("POP API 요청 실패");
  const data = await res.json();
  const items = data.response?.body?.items?.item ?? [];

  const now = new Date();
  const hhmm = String(now.getHours()).padStart(2, '0') + '00';

  const popItem = items.find(
    (item) => item.category === 'POP' && item.fcstDate === baseDate && item.fcstTime >= hhmm
  );

  return popItem?.fcstValue ?? null;
}

export async function fetchCurrentConditions(nx, ny) {
  const { baseDate, baseTime } = getUltraBaseDateTime();
  const url = `${ULTRA_SHORT_URL}?serviceKey=${SERVICE_KEY}&pageNo=1&numOfRows=100&dataType=JSON&base_date=${baseDate}&base_time=${baseTime}&nx=${nx}&ny=${ny}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("초단기예보 API 요청 실패");
  const data = await res.json();
  const items = data.response?.body?.items?.item ?? [];

  const getValue = (category) =>
    items.find((item) => item.category === category)?.fcstValue ?? null;

  return {
    temp: getValue('T1H'),
    sky: getValue('SKY'),
    rain: getValue('RN1'),
  };
}
