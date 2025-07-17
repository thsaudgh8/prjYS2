import React from 'react';
import { Card, Typography } from '@mui/material';

function HomeDust({ lat, lon }) {
  // TODO: lat, lon 기반 미세먼지 API 호출 및 상태 관리

  const dustData = { pm10: 35, pm25: 15 }; // 예시 데이터

  return (
    <Card
      sx={{ bgcolor: '#aed581', color: '#3e2723', p: 2, mt: 'auto' }}
      elevation={4}
    >
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        미세먼지 정보
      </Typography>
      <Typography>PM10: {dustData.pm10} ㎍/㎥</Typography>
      <Typography>PM2.5: {dustData.pm25} ㎍/㎥</Typography>
    </Card>
  );
}

export default HomeDust;
