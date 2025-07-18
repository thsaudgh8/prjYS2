import React from 'react';

function getDustStatus(khaiValue) {
  if (!khaiValue || isNaN(khaiValue)) return '정보 없음';
  if (khaiValue <= 50) return '좋음';
  if (khaiValue <= 100) return '보통';
  if (khaiValue <= 150) return '나쁨';
  return '매우 나쁨';
}

function formatValue(val) {
  const num = parseFloat(val);
  return isNaN(num) ? '정보 없음' : `${num.toFixed(1)} ㎍/㎥`;
}

function AverageDustCard({ data }) {
  if (!data) return <p>경기도 평균 정보를 불러오는 중...</p>;

  return (
    <div
      style={{
        padding: '1rem',
        border: '1px solid #ccc',
        borderRadius: '8px',
        marginLeft: '1rem',
      }}
    >
      <h2>경기도 평균 미세먼지 정보</h2>
      <p><strong>PM10:</strong> {formatValue(data.pm10)}</p>
      <p><strong>PM2.5:</strong> {formatValue(data.pm25)}</p>
      <p><strong>측정소 수:</strong> {data.count}</p>
      <p><strong>평균 지수 상태:</strong> {getDustStatus(data.khai)}</p>
    </div>
  );
}

export default AverageDustCard;