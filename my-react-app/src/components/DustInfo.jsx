import React from 'react';

function getDustStatus(khaiValue) {
  if (!khaiValue || isNaN(khaiValue)) return '정보 없음';
  if (khaiValue <= 50) return '좋음';
  if (khaiValue <= 100) return '보통';
  if (khaiValue <= 150) return '나쁨';
  return '매우 나쁨';
}

function DustInfo({ data }) {
  if (!data) return <p>정보를 가져올 수 없습니다.</p>;

  return (
    <div style={{ padding: '1rem', border: '1px solid #ccc', borderRadius: '8px', display: 'inline-block' }}>
      <h2>수원시 미세먼지</h2>
      <p><strong>측정소:</strong> {data.stationName}</p>
      <p><strong>PM10:</strong> {data.pm10Value} ㎍/㎥</p>
      <p><strong>PM2.5:</strong> {data.pm25Value} ㎍/㎥</p>
      <p><strong>통합대기환경지수:</strong> {data.khaiValue} ({getDustStatus(data.khaiValue)})</p>
      <p><strong>측정 시간:</strong> {data.dataTime}</p>
    </div>
  );
}

export default DustInfo;