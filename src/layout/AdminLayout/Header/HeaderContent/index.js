// material-ui
import { Box, useMediaQuery } from '@mui/material';

// project import
import Search from './Search';
import Profile from './Profile';
// import Notification from './Notification';
import MobileSection from './MobileSection';
import Navigation from './Navigation';
import Logo from 'components/Logo';

// ==============================|| HEADER - CONTENT ||============================== //

const HeaderContent = () => {
  const matchesXs = useMediaQuery((theme) => theme.breakpoints.down('md'));

  return (
    <>
      <Logo />
      {matchesXs && <Box sx={{ width: '100%', ml: 1 }} />}
      <Navigation />
      {!matchesXs && <Search />}

      {/* <Notification /> */}
      {!matchesXs && <Profile />}
      {matchesXs && <MobileSection />}
    </>
  );
};

export default HeaderContent;
