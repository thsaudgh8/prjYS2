const SERVICE_KEY = import.meta.env.VITE_DUST_API_KEY;
const DUST_BASE_URL = 'https://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty';

// 시간별 미세먼지 정보 조회 함수 예시
export async function fetchHourlyDustData(stationName) {
  const url = `${DUST_BASE_URL}?serviceKey=${SERVICE_KEY}&returnType=json&numOfRows=24&pageNo=1&stationName=${encodeURIComponent(stationName)}&dataTerm=DAILY&ver=1.3`;
  
  const res = await fetch(url);
  if (!res.ok) throw new Error('미세먼지 정보 요청 실패');
  const data = await res.json();
  
  if (data.response.body.items.length === 0) throw new Error('미세먼지 데이터가 없습니다');
  
  // 시간별 배열 (최근 24시간) 반환, 필요한 데이터만 가공
  return data.response.body.items.map(item => ({
    dataTime: item.dataTime,
    pm10Value: item.pm10Value === '-' ? null : Number(item.pm10Value),
    pm25Value: item.pm25Value === '-' ? null : Number(item.pm25Value),
  }));
}
