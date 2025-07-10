// WeekWeatherCards.jsx

import React from 'react';
import DayWeatherCard from './DayWeatherCard';

const WeekWeatherCards = ({ dailyWeatherList }) => {
  return (
    <div style={{ display: 'flex', gap: '12px', padding: '1rem' }}>
      {dailyWeatherList.map(({ date, sky, rain, pty, pop, maxTemp, minTemp }) => (
        <DayWeatherCard
          key={date}
          date={date}
          sky={sky}
          rain={rain}
          pty={pty}
          pop={pop}
          maxTemp={maxTemp}
          minTemp={minTemp}
        />
      ))}
    </div>
  );
};

export default WeekWeatherCards;
