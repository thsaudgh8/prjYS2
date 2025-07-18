const API_KEY = import.meta.env.VITE_DUST_API_KEY;
const BASE_URL = 'https://apis.data.go.kr/B552584/ArpltnInforInqireSvc';

export async function fetchDustData(city = '수원', sido = '경기') {
  try {
    const response = await fetch(
      `${BASE_URL}/getCtprvnRltmMesureDnsty?serviceKey=${API_KEY}&returnType=json&numOfRows=1000&pageNo=1&sidoName=${encodeURIComponent(sido)}&ver=1.0`
    );
    const data = await response.json();

    // stationName에 city 이름 포함된 첫 번째 데이터 찾기
    const target = data?.response?.body?.items?.find(item =>
      item.stationName.includes(city)
    );

    return target || null;
  } catch (error) {
    console.error('미세먼지 정보 불러오기 실패:', error);
    return null;
  }
}

export async function fetchGyeonggiAvgDust() {
  try {
    const response = await fetch(
      `${BASE_URL}/getCtprvnRltmMesureDnsty?serviceKey=${API_KEY}&returnType=json&numOfRows=1000&pageNo=1&sidoName=경기&ver=1.0`
    );
    const data = await response.json();
    const items = data?.response?.body?.items || [];

    let pm10Sum = 0, pm25Sum = 0, khaiSum = 0, count = 0;

    items.forEach(item => {
      const pm10 = parseInt(item.pm10Value);
      const pm25 = parseInt(item.pm25Value);
      const khai = parseInt(item.khaiValue);
      if (!isNaN(pm10) && !isNaN(pm25) && !isNaN(khai)) {
        pm10Sum += pm10;
        pm25Sum += pm25;
        khaiSum += khai;
        count++;
      }
    });

    if (count === 0) return null;

    return {
      pm10: (pm10Sum / count).toFixed(1),
      pm25: (pm25Sum / count).toFixed(1),
      khai: (khaiSum / count).toFixed(1),
      count,
    };
  } catch (err) {
    console.error('경기도 평균 미세먼지 정보 실패:', err);
    return null;
  }
<<<<<<< HEAD
}
=======
}
>>>>>>> f6330e6e1a2ca254b6b87a7a668c8db2cbcf7a64
