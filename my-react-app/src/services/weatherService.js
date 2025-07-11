// weatherService.js

const SERVICE_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const BASE_URL = 'https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst';

function getBaseDateTime() {
  const now = new Date();
  let baseDate = now.toISOString().slice(0, 10).replace(/-/g, '');
  let baseTime = '0200';

  // 0200 이전이면 전날 0200로 잡음
  if (now.getHours() < 2) {
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    baseDate = yesterday.toISOString().slice(0, 10).replace(/-/g, '');
  }

  return { baseDate, baseTime };
}

// 단기예보는 0200 기준으로 받고
export async function fetchMinMaxTemp(nx, ny) {
  const { baseDate, baseTime } = getBaseDateTime();

  const url = `${BASE_URL}?serviceKey=${SERVICE_KEY}&pageNo=1&numOfRows=400&dataType=JSON&base_date=${baseDate}&base_time=${baseTime}&nx=${nx}&ny=${ny}`;
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

// 강수확률(POP), 강수형태(PTY), 하늘 상태(SKY)는 최신 시간으로 계속 요청해야 하니
// 호출 시점 기준 가장 가까운 baseDate/baseTime으로 받아옴
function getLatestBaseDateTime() {
  // 단기예보 base_time 기준: 0200, 0500, 0800, 1100, 1400, 1700, 2000, 2300 중에서 현재시간 이전 가장 가까운 시간 사용
  const now = new Date();
  const baseTimes = ['0200', '0500', '0800', '1100', '1400', '1700', '2000', '2300'];
  let baseDate = now.toISOString().slice(0, 10).replace(/-/g, '');

  let hour = now.getHours();
  let minute = now.getMinutes();
  // 기준 시간 찾기 (현재시간 이전 중 가장 가까운 base_time)
  let baseTime = '0200';
  for (let i = baseTimes.length - 1; i >= 0; i--) {
    const tHour = parseInt(baseTimes[i].slice(0, 2), 10);
    if (hour > tHour || (hour === tHour && minute >= 0)) {
      baseTime = baseTimes[i];
      break;
    }
  }

  // 0200 이전 (예: 00시)일 경우 전날 2300 기준으로
  if (hour < 2) {
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    baseDate = yesterday.toISOString().slice(0, 10).replace(/-/g, '');
    baseTime = '2300';
  }

  return { baseDate, baseTime };
}

export async function fetchLatestWeatherConditions(nx, ny) {
  const { baseDate, baseTime } = getLatestBaseDateTime();

  const url = `${BASE_URL}?serviceKey=${SERVICE_KEY}&pageNo=1&numOfRows=400&dataType=JSON&base_date=${baseDate}&base_time=${baseTime}&nx=${nx}&ny=${ny}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('단기예보 최신 기상 상태 API 요청 실패');
  const data = await res.json();
  const items = data.response?.body?.items?.item ?? [];

  // fcstTime이 현재시간보다 같거나 큰 첫 데이터부터 3가지 카테고리 추출
  const now = new Date();
  const nowHHmm = String(now.getHours()).padStart(2, '0') + String(now.getMinutes()).padStart(2, '0');

  // 현재시간 이후 forecast 중 가장 가까운 시간 선택
  let targetFcstTime = null;
  for (const item of items) {
    if (item.fcstTime >= nowHHmm) {
      targetFcstTime = item.fcstTime;
      break;
    }
  }
  // 만약 현재시간 이후 forecast가 없으면 가장 가까운 fcstTime으로 fallback
  if (!targetFcstTime && items.length > 0) {
    targetFcstTime = items[0].fcstTime;
  }

  const conditions = {};

  ['POP', 'PTY', 'SKY'].forEach((category) => {
    const found = items.find(
      (item) => item.category === category && item.fcstTime === targetFcstTime
    );
    conditions[category.toLowerCase()] = found ? found.fcstValue : null;
  });

  // 여기서 pty 값을 rain으로 복사
  conditions.rain = conditions.pty;

  return conditions; // { pop, pty, sky, rain }
}


export async function fetchDailyWeatherData(nx, ny, dailyDates) {
  const BASE_URL = 'https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst';

  // 7/11, 7/12는 baseDate, baseTime 기준으로 데이터 여러개가 있으니
  // 최근 baseDate/baseTime을 구해서 API 호출 (ex. getLatestBaseDateTime 함수 참고)
  const { baseDate, baseTime } = getLatestBaseDateTime();

  const url = `${BASE_URL}?serviceKey=${SERVICE_KEY}&pageNo=1&numOfRows=1000&dataType=JSON&base_date=${baseDate}&base_time=${baseTime}&nx=${nx}&ny=${ny}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error('일별 단기예보 API 요청 실패');
  const data = await res.json();
  const items = data.response?.body?.items?.item ?? [];

  // dailyDates 배열을 Set으로 만들기 (빠른 검색용)
  const dateSet = new Set(dailyDates);

  // 각 날짜별 데이터 객체 생성
  const dailyData = {};

  // 최대/최저기온 저장용
  dailyDates.forEach((date) => {
    dailyData[date] = {
      date,
      maxTemp: null,
      minTemp: null,
      sky: null,
      rain: null,
      pty: null,
      pop: null,
    };
  });

  // API에서 받은 items 중 날짜가 dailyDates에 포함된 데이터만 필터 및 가공
  items.forEach((item) => {
    if (!dateSet.has(item.fcstDate)) return;

    const dayData = dailyData[item.fcstDate];
    switch (item.category) {
      case 'TMX':
        dayData.maxTemp = item.fcstValue;
        break;
      case 'TMN':
        dayData.minTemp = item.fcstValue;
        break;
      case 'SKY':
        dayData.sky = item.fcstValue;
        break;
      case 'PTY':
        dayData.pty = item.fcstValue;
        dayData.rain = item.fcstValue; // rain 복사
        break;
      case 'POP':
        dayData.pop = item.fcstValue;
        break;
      default:
        break;
    }
  });

  // 배열로 반환
  return dailyDates.map((date) => dailyData[date]);
}