import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useDispatch } from 'react-redux';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, useMediaQuery } from '@mui/material';

// project import
// import Drawer from './Drawer';
import Header from './Header';

// types
import { openDrawer } from 'store/reducers/menu';

// ==============================|| MAIN LAYOUT ||============================== //

const AdminLayout = () => {
  const theme = useTheme();
  const matchDownLG = useMediaQuery(theme.breakpoints.down('lg'));
  const dispatch = useDispatch();

  // set media wise responsive drawer
  useEffect(() => {
    dispatch(openDrawer({ drawerOpen: !matchDownLG }));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchDownLG]);

  return (
    <Box sx={{ display: 'flex', width: '100%', minHeight: '100vh', bgcolor: '#F5F5F5' }}>
      <Header />
      <Box component="main" sx={{ width: '100%', flexGrow: 1, padding: '100px 24px' }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminLayout;
