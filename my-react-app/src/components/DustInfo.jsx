import React from 'react';
import DustLevelBar from './DustLevelBar'; 

// 통합대기환경지수 상태 반환 함수
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
    <div
      style={{
        padding: '1rem',
        border: '1px solid #ccc',
        borderRadius: '8px',
        display: 'inline-block',
        width: '100%',
        boxSizing: 'border-box'
      }}
    >
      <h2>수원시 미세먼지</h2>
      <p><strong>측정소:</strong> {data.stationName}</p>
      <p><strong>PM10:</strong> {data.pm10Value} ㎍/㎥</p>
      <p><strong>PM2.5:</strong> {data.pm25Value} ㎍/㎥</p>
      <p><strong>통합대기환경지수:</strong> {data.khaiValue} ({getDustStatus(data.khaiValue)})</p>
      <p><strong>측정 시간:</strong> {data.dataTime}</p>

      {/* ✅ 막대 시각화 표시 */}
      <div style={{ marginTop: '1rem' }}>
        <DustLevelBar pm10={parseInt(data.pm10Value, 10)} />
      </div>
    </div>
  );
}

export default DustInfo;
