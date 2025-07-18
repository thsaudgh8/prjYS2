const SERVICE_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const BASE_URL = 'https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst';
const ULTRA_SHORT_FORECAST_URL = 'https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst';

// 기준 날짜/시간 - 0200 기준 (최고/최저용)
function getBaseDateTime() {
  const now = new Date();
  let baseDate = now.toISOString().slice(0, 10).replace(/-/g, '');
  let baseTime = '0200';

  if (now.getHours() < 2) {
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    baseDate = yesterday.toISOString().slice(0, 10).replace(/-/g, '');
  }

  return { baseDate, baseTime };
}

// 최신 기준 날짜/시간 - 단기예보 업데이트 시간 기준 (0200, 0500, 0800, 1100, 1400, 1700, 2000, 2300)
function getLatestBaseDateTime() {
  const now = new Date();
  const baseTimes = ['0200', '0500', '0800', '1100', '1400', '1700', '2000', '2300'];
  let baseDate = now.toISOString().slice(0, 10).replace(/-/g, '');

  let hour = now.getHours();
  let minute = now.getMinutes();
  let baseTime = '0200';

  for (let i = baseTimes.length - 1; i >= 0; i--) {
    const tHour = parseInt(baseTimes[i].slice(0, 2), 10);
    if (hour > tHour || (hour === tHour && minute >= 0)) {
      baseTime = baseTimes[i];
      break;
    }
  }

  if (hour < 2) {
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    baseDate = yesterday.toISOString().slice(0, 10).replace(/-/g, '');
    baseTime = '2300';
  }

  return { baseDate, baseTime };
}

// 최고/최저 기온 조회 (0200 기준)
export async function fetchMinMaxTemp(nx, ny) {
  const { baseDate, baseTime } = getBaseDateTime();

  const url = `${BASE_URL}?serviceKey=${SERVICE_KEY}&pageNo=1&numOfRows=1000&dataType=JSON&base_date=${baseDate}&base_time=${baseTime}&nx=${nx}&ny=${ny}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('단기예보 최고/최저 기온 API 요청 실패');
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

// 최신 강수확률, 강수형태, 하늘 상태 조회
export async function fetchLatestWeatherConditions(nx, ny) {
  const { baseDate, baseTime } = getLatestBaseDateTime();

  const url = `${BASE_URL}?serviceKey=${SERVICE_KEY}&pageNo=1&numOfRows=1000&dataType=JSON&base_date=${baseDate}&base_time=${baseTime}&nx=${nx}&ny=${ny}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('최신 기상 상태 API 요청 실패');
  const data = await res.json();
  const items = data.response?.body?.items?.item ?? [];

  let pop = null; // 강수확률
  let pty = null; // 강수형태
  let sky = null; // 하늘상태

  for (const item of items) {
    if (item.category === 'POP') pop = item.fcstValue;
    else if (item.category === 'PTY') pty = item.fcstValue;
    else if (item.category === 'SKY') sky = item.fcstValue;
  }

  return { pop, pty, sky };
}

// 일별 단기예보 (평균 강수확률 포함, 오전/오후 구분)
// 초기값 세팅
export async function fetchDailyWeatherData(nx, ny) {
  const { baseDate, baseTime } = getLatestBaseDateTime(); // 최신 예보 기준 사용

  const url = `${BASE_URL}?serviceKey=${SERVICE_KEY}&pageNo=1&numOfRows=1000&dataType=JSON&base_date=${baseDate}&base_time=${baseTime}&nx=${nx}&ny=${ny}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('일일 예보 데이터 요청 실패');

  const data = await res.json();
  const items = data.response?.body?.items?.item ?? [];

  // 오늘 기준 6일치 날짜 추출
  const today = new Date();
  const dailyDates = Array.from({ length: 3 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    return d.toISOString().slice(0, 10).replace(/-/g, '');
  });

  const dateSet = new Set(dailyDates);
  const dailyData = {};

  // 초기 세팅
  dailyDates.forEach((date) => {
    dailyData[date] = {
      date,
      maxTemp: null,
      minTemp: null,
      sky: null,
      rain: null,
      pty: null,
      popAm: null,
      popPm: null,
      _popAmList: [],
      _popPmList: [],
      _ptyList: [],
    };
  });

  // 데이터 분류
  items.forEach((item) => {
    const { fcstDate, fcstTime, category, fcstValue } = item;
    if (!dateSet.has(fcstDate)) return;

    const data = dailyData[fcstDate];

    switch (category) {
      case 'TMX':
        data.maxTemp = fcstValue;
        break;
      case 'TMN':
        data.minTemp = fcstValue;
        break;
      case 'SKY':
        data.sky = fcstValue;
        break;
      case 'PTY':
        data.pty = fcstValue;
        data._ptyList.push(Number(fcstValue));
        break;
      case 'POP':
        const hour = parseInt(fcstTime.slice(0, 2), 10);
        if (hour < 12) {
          data._popAmList.push(Number(fcstValue));
        } else {
          data._popPmList.push(Number(fcstValue));
        }
        break;
      default:
        break;
    }
  });

  // 후처리 마지막에 추가
dailyDates.forEach((date) => {
  const d = dailyData[date];

  if (d._popAmList.length > 0) d.popAm = Math.max(...d._popAmList);
  if (d._popPmList.length > 0) d.popPm = Math.max(...d._popPmList);

  const hasRain = d._ptyList.some(v => v >= 1);
  d.rain = hasRain ? 1 : 0;

  // ✅ 강수형태 대표값 설정 (최댓값으로)
  if (d._ptyList.length > 0) {
    d.pty = Math.max(...d._ptyList);
  }

  // 정리
  delete d._popAmList;
  delete d._popPmList;
  delete d._ptyList;
});

  return Object.values(dailyData);
}

// 초단기 예보 기준 시각 계산 함수
function getUltraSrtBaseDateTime() {
  const now = new Date();
  let baseDate = now.toISOString().slice(0, 10).replace(/-/g, '');
  let hour = now.getHours();
  const minutes = now.getMinutes();

  if (minutes < 45) {
    hour -= 1;
    if (hour < 0) {
      hour = 23;
      const yesterday = new Date(now);
      yesterday.setDate(now.getDate() - 1);
      baseDate = yesterday.toISOString().slice(0, 10).replace(/-/g, '');
    }
  }

  const baseTime = `${hour.toString().padStart(2, '0')}30`;
  return { baseDate, baseTime };
}

// ✅ 초단기 예보 (1시간 단위: 기온/하늘상태/강수형태)
export async function fetchUltraShortForecast(nx, ny) {
  const { baseDate, baseTime } = getUltraSrtBaseDateTime();
  const url = `${ULTRA_SHORT_FORECAST_URL}?serviceKey=${SERVICE_KEY}&pageNo=1&numOfRows=1000&dataType=JSON&base_date=${baseDate}&base_time=${baseTime}&nx=${nx}&ny=${ny}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error('초단기예보 API 요청 실패');

  const data = await res.json();

  if (!data.response || data.response.header.resultCode !== '00') {
    throw new Error('초단기예보 API 호출 실패');
  }

  const items = data.response.body.items.item ?? [];

  const hourlyMap = {};
  items.forEach(({ fcstTime, category, fcstValue }) => {
    if (!['T1H', 'SKY', 'PTY'].includes(category)) return;
    if (!hourlyMap[fcstTime]) hourlyMap[fcstTime] = {};
    hourlyMap[fcstTime][category] = fcstValue;
  });

  return Object.entries(hourlyMap)
    .map(([time, val]) => ({
      time,
      temp: val.T1H,
      sky: val.SKY,
      pty: val.PTY,
    }))
    .sort((a, b) => a.time.localeCompare(b.time))
    .slice(0, 6);
}
