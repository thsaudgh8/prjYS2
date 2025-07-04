import { Container, Typography } from '@mui/material';

function Home() {
  return (
    <Container
      maxWidth="xl"
      sx={{
        minHeight: '85vh', // 전체 화면에서 85% 높이
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        py: 6, // 상하 여백
      }}
    >
      <Typography
        variant="h4"
        sx={{
          fontSize: { xs: '2.5rem', md: '3rem' }, // 좀 더 큼직하게
          fontWeight: 'bold',
          mb: 2,
        }}
      >
        홈 화면
      </Typography>

      <Typography
        variant="body1"
        sx={{
          fontSize: { xs: '1.2rem', md: '1.5rem' },
          textAlign: 'center',
          maxWidth: '600px',
        }}
      >
        여기에 오늘의 날씨와 미세먼지 정보가 표시됩니다.
      </Typography>
    </Container>
  );
}

export default Home;
