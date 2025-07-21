// src/components/DustLevelBar.jsx
import React from 'react';

function getBarColor(pm10) {
  if (pm10 <= 30) return '#4CAF50'; // 좋음 (초록)
  if (pm10 <= 80) return '#FF9800'; // 보통 (주황)
  if (pm10 <= 150) return '#F44336'; // 나쁨 (빨강)
  return '#8B0000'; // 매우나쁨 (진한 빨강)
}

function getStatusLabel(pm10) {
  if (pm10 <= 30) return '좋음';
  if (pm10 <= 80) return '보통';
  if (pm10 <= 150) return '나쁨';
  return '매우 나쁨';
}

function DustLevelBar({ pm10 }) {
  const percentage = Math.min((pm10 / 200) * 100, 100); // 기준 상한 200으로 설정
  const color = getBarColor(pm10);
  const label = getStatusLabel(pm10);

  return (
    <div style={{ marginTop: '1rem' }}>
      <div style={{ marginBottom: '0.5rem' }}>PM10 등급: <strong>{label}</strong></div>
      <div style={{
        background: '#eee',
        height: '20px',
        borderRadius: '10px',
        overflow: 'hidden',
        width: '100%',
      }}>
        <div style={{
          width: `${percentage}%`,
          background: color,
          height: '100%',
          transition: 'width 0.3s ease',
        }} />
      </div>
    </div>
  );
}

export default DustLevelBar;
