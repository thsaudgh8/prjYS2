// utils/getUltraSrtBaseDateTime.js

export function getUltraSrtBaseDateTime() {
  const now = new Date();
  let baseDate = now.toISOString().slice(0, 10).replace(/-/g, '');
  let hour = now.getHours();
  const minutes = now.getMinutes();

  // 45분 전보다 이르면 한 시간 전 시간으로 보정
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
