import React from 'react';
import WeatherCard from '../components/WeatherCard';

const WeatherPage = () => {
  return (
    <div
      style={{
        display: 'flex',
        paddingTop: '64px',   // 네비바 높이만큼 띄움
        height: 'calc(100vh - 64px)', // 네비바 제외 화면 전체 높이
        boxSizing: 'border-box',
      }}
    >
      {/* 좌측 영역: WeatherCard */}
      <div
        style={{
          width: '50%',       // 좌우 50%씩 분할 (필요시 조절)
          padding: '1rem',
          overflowY: 'auto',  // 내용 많으면 세로 스크롤 가능
          borderRight: '1px solid #ccc',
        }}
      >
        <WeatherCard />
      </div>

      {/* 우측 영역: 빈 영역 혹은 다른 컨텐츠 넣을 공간 */}
      <div
        style={{
          width: '50%',
          padding: '1rem',
          overflowY: 'auto',
        }}
      >
        {/* 필요시 여기에 우측 컨텐츠 */}
      </div>
    </div>
  );
};

export default WeatherPage;
