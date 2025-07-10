// useWeather.js

import { useState, useEffect, useRef } from 'react';
import { fetchTodayMinMaxTemp, fetchCurrentConditions, fetchTodayPop } from '../services/weatherService';
import { useLocation } from './useLocation';
import { convertLatLonToGrid } from '../utils/convertGrid';

const getTodayDate = () => new Date().toISOString().slice(0, 10);
const isAfter0200 = () => new Date().getHours() >= 2;

export const useWeather = () => {
  const { location, loading: locLoading, error: locError } = useLocation();
  const [minTemp, setMinTemp] = useState(null);
  const [maxTemp, setMaxTemp] = useState(null);
  const [currentTemp, setCurrentTemp] = useState(null);
  const [sky, setSky] = useState(null);
  const [rain, setRain] = useState(null);
  const [pop, setPop] = useState(null);
  const [loading, setLoading] = useState(true);

  const savedMax = useRef(null);
  const savedMin = useRef(null);
  const currentDateRef = useRef(getTodayDate());

  useEffect(() => {
    if (locLoading || locError || !location.lat || !location.lon) return;

    const loadWeather = async () => {
      const today = getTodayDate();
      const { nx, ny } = convertLatLonToGrid(location.lat, location.lon);

      if (currentDateRef.current !== today && isAfter0200()) {
        currentDateRef.current = today;
        savedMax.current = null;
        savedMin.current = null;
      }

      const [{ maxTemp: apiMax, minTemp: apiMin }, { temp, sky, rain }, pop] = await Promise.all([
        fetchTodayMinMaxTemp(nx, ny),
        fetchCurrentConditions(nx, ny),
        fetchTodayPop(nx, ny),
      ]);

      setCurrentTemp(temp);
      setSky(sky);
      setRain(rain);
      setPop(pop);

      if (savedMax.current === null) savedMax.current = apiMax;
      if (savedMin.current === null) savedMin.current = apiMin;

      if (temp !== null) {
        if (temp > savedMax.current) savedMax.current = temp;
        if (temp < savedMin.current) savedMin.current = temp;
      }

      setMaxTemp(savedMax.current);
      setMinTemp(savedMin.current);
      setLoading(false);
    };

    loadWeather();
    const interval = setInterval(loadWeather, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [location, locLoading, locError]);

  return {
    loading,
    error: locError,
    currentTemp,
    maxTemp,
    minTemp,
    sky,
    rain,
    pop,
  };
};
