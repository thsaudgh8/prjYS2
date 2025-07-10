// 기상청 업데이트 시간 갱신하는 코드 

export function getBaseDateTime() {
  const now = new Date();

  // 기상청 발표 시간 (예: 2, 5, 8, 11, 14, 17, 20, 23시)
  const baseTimes = [2, 5, 8, 11, 14, 17, 20, 23];

  let baseDate = now.toISOString().slice(0, 10).replace(/-/g, '');
  let baseTime = '2300';

  // 현재 시간에 가장 가까운 baseTime 찾기
  const hour = now.getHours();

  for (let i = baseTimes.length - 1; i >= 0; i--) {
    if (hour >= baseTimes[i]) {
      baseTime = baseTimes[i].toString().padStart(2, '0') + '00';
      break;
    }
  }

  // 만약 현재 시간이 0~1시라면 전날 23시로 설정
  if (hour < 2) {
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    baseDate = yesterday.toISOString().slice(0, 10).replace(/-/g, '');
  }

  return { baseDate, baseTime };
}
