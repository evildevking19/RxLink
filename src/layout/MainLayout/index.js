import React from 'react';
import { Outlet } from 'react-router-dom';

// material-ui
import { Box } from '@mui/material';

// project import
import Header from './Header';
// import Footer from './Footer';
import FooterNew from './FooterNew';
import CookieMessageBox from 'components/cookie/CookieMessageBox';
import './main-layout.css';

// ==============================|| MAIN LAYOUT ||============================== //

const MainLayout = () => {
  return (
    <Box sx={{ display: 'flex', width: '100%', flexDirection: 'column' }}>
      <Header />
      <Box component="main" className="main-layout">
        <Outlet />
      </Box>
      <FooterNew />
      <CookieMessageBox />
    </Box>
  );
};

export default MainLayout;
