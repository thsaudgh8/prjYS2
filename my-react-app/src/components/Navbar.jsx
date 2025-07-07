// 상단 카테고리

import { AppBar, Toolbar, Button, Typography, Box, IconButton, Drawer, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Weather', to: '/weather' },
  { label: 'Dust', to: '/dust' },
  { label: 'Bus', to: '/bus' },
];

function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDrawerToggle = () => {
    setDrawerOpen((prev) => !prev);
  };

  return (
    <>
      <AppBar
        position="static"
        color="primary"
        sx={{
          width: { xs: '100%', md: '80%' },
          margin: { xs: 0, md: '0 auto' },
        }}
      >
        <Toolbar>
          <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
            오늘의 바깥
          </Typography>
          {/* 데스크탑 메뉴 */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
            {navItems.map((item) => (
              <Button
                key={item.to}
                color="inherit"
                component={Link}
                to={item.to}
                size="large"
                sx={{ fontSize: '1.4rem', px: 3 }}
              >
                {item.label}
              </Button>
            ))}
          </Box>
          {/* 모바일 메뉴 버튼 */}
          <IconButton
            color="inherit"
            edge="end"
            sx={{ display: { xs: 'flex', md: 'none' } }}
            onClick={handleDrawerToggle}
            aria-label="menu"
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      {/* 모바일 Drawer 메뉴 */}
      <Drawer
        anchor="top"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        sx={{ display: { xs: 'block', md: 'none' } }}
      >
        <List>
          {navItems.map((item) => (
            <ListItem key={item.to} disablePadding>
              <ListItemButton
                component={Link}
                to={item.to}
                onClick={handleDrawerToggle}
              >
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
}

export default Navbar;
