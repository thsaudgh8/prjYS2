
// getBaseDateTime.js
export function getBaseDateTime() {
  const now = new Date();
  let baseDate = now.toISOString().slice(0, 10).replace(/-/g, '');
  const baseTime = '0200';

  // 만약 현재 시간이 2시 이전이면 전날 기준으로 설정
  if (now.getHours() < 2) {
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    baseDate = yesterday.toISOString().slice(0, 10).replace(/-/g, '');
  }

  return { baseDate, baseTime };
}
