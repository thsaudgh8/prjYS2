// 상단 카테고리

import { AppBar, Toolbar, Button, Typography, Box } from '@mui/material';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          오늘의 바깥
        </Typography>
        <Box>
          <Button color="inherit" component={Link} to="/">Home</Button>
          <Button color="inherit" component={Link} to="/weather">Weather</Button>
          <Button color="inherit" component={Link} to="/dust">Dust</Button>
          <Button color="inherit" component={Link} to="/bus">Bus</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
