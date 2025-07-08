import { useEffect, useState, useRef } from 'react';
import { fetchTodayMinMaxTemp, fetchCurrentConditions } from '../services/weatherService';
import { convertLatLonToGrid } from '../utils/convertGrid'; // ✅ 이거 중요!

const getTodayDate = () => {
  const now = new Date();
  return now.toISOString().slice(0, 10);
};

const isAfter0200 = () => {
  const now = new Date();
  return now.getHours() >= 2;
};


export function useWeather(location, locLoading, locError) {
    const [minTemp, setMinTemp] = useState(null);
    const [maxTemp, setMaxTemp] = useState(null);
    const [currentTemp, setCurrentTemp] = useState(null);
    const [sky, setSky] = useState(null);
    const [rain, setRain] = useState(null);
    const [pop, setPop] = useState(null);  // 강수 확률 상태 추가
    const [loading, setLoading] = useState(true);

    const savedMaxRef = useRef(null);
    const savedMinRef = useRef(null);
    const currentDateRef = useRef(getTodayDate());

    useEffect(() => {
        if (locLoading || locError || !location?.lat || !location?.lon) return;

        const loadWeather = async () => {
            const todayDate = getTodayDate();
            const { nx, ny } = convertLatLonToGrid(location.lat, location.lon);

            if (currentDateRef.current !== todayDate && isAfter0200()) {
                currentDateRef.current = todayDate;
                savedMaxRef.current = null;
                savedMinRef.current = null;
            }

            const { minTemp: apiMin, maxTemp: apiMax } = await fetchTodayMinMaxTemp(nx, ny);
            const { temp: current, sky, rain, pop } = await fetchCurrentConditions(nx, ny);

            setCurrentTemp(current);
            setSky(sky);
            setRain(rain);
            setPop(pop);  // 강수 확률 저장

            if (savedMaxRef.current === null) savedMaxRef.current = apiMax;
            if (savedMinRef.current === null) savedMinRef.current = apiMin;

            if (current !== null) {
                if (current > savedMaxRef.current) savedMaxRef.current = current;
                if (current < savedMinRef.current) savedMinRef.current = current;
            }

            setMaxTemp(savedMaxRef.current);
            setMinTemp(savedMinRef.current);
            setLoading(false);
        };

        loadWeather();

        const interval = setInterval(loadWeather, 60 * 60 * 1000);
        return () => clearInterval(interval);
    }, [location, locLoading, locError]);

    return { minTemp, maxTemp, currentTemp, sky, rain, pop, loading };
}
