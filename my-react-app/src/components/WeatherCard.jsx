//  날씨 정보

// components/WeatherCard.js
import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, CircularProgress } from '@mui/material';
import { fetchTodayMinMaxTemp } from '../services/weatherService';
import { useLocation } from '../hooks/useLocation.js';
import { convertLatLonToGrid } from '../utils/convertGrid';



const WeatherCard = () => {
  const { location, loading: locLoading, error: locError } = useLocation();
  const [minTemp, setMinTemp] = useState(null);
  const [maxTemp, setMaxTemp] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (locLoading || locError) return;
    if (!location.lat || !location.lon) return;

    const loadTemp = async () => {
      const { nx, ny } = convertLatLonToGrid(location.lat, location.lon);
      const { minTemp, maxTemp } = await fetchTodayMinMaxTemp(nx, ny);

      setMinTemp(minTemp);
      setMaxTemp(maxTemp);
      setLoading(false);
    };

    loadTemp();
  }, [location, locLoading, locError]);

  if (locLoading) {
    return (
      <Card sx={{ minWidth: 275, maxWidth: 400, margin: '0 auto', mt: 4, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h5" component="div" gutterBottom>
            오늘의 기온
          </Typography>
          <CircularProgress />
        </CardContent>
      </Card>
    );
  }

  if (locError) {
    return (
      <Card sx={{ minWidth: 275, maxWidth: 400, margin: '0 auto', mt: 4, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h5" component="div" gutterBottom>
            오늘의 기온
          </Typography>
          <Typography color="error">{locError}</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ minWidth: 275, maxWidth: 400, margin: '0 auto', mt: 4, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
          오늘의 기온
        </Typography>
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            <Typography variant="body1" sx={{ fontSize: '1.2rem', mb: 1 }}>
              🌡️ 최고기온: <strong>{maxTemp}℃</strong>
            </Typography>
            <Typography variant="body1" sx={{ fontSize: '1.2rem' }}>
              ❄️ 최저기온: <strong>{minTemp}℃</strong>
            </Typography>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default WeatherCard;
