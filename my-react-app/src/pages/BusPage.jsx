// 지도 기반 버스 정보 페이지

import { Container, Typography } from '@mui/material';

function Home() {
  return (
    <Container>
      <Typography variant="h4" mt={4}>버스 화면</Typography>
      <Typography variant="body1" mt={2}>여기에 오늘의 날씨와 미세먼지 정보가 표시됩니다.</Typography>
    </Container>
  );
}

export default Home;
