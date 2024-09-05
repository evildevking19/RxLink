import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import { AppBar, Toolbar, useMediaQuery } from '@mui/material';

// project import
import AppBarStyled from './AppBarStyled';
import HeaderContent from './HeaderContent';

// ==============================|| MAIN LAYOUT - HEADER ||============================== //

const Header = () => {
  const theme = useTheme();
  const matchDownMD = useMediaQuery(theme.breakpoints.down('lg'));

  // common header
  const mainHeader = (
    <Toolbar>
      <HeaderContent />
    </Toolbar>
  );

  // app-bar params
  const appBar = {
    position: 'fixed',
    color: 'inherit',
    elevation: 0
  };

  return (
    <>
      {!matchDownMD ? (
        <AppBarStyled {...appBar} sx={{ backgroundColor: '#f5f5f5' }}>
          {mainHeader}
        </AppBarStyled>
      ) : (
        <AppBar {...appBar} sx={{ backgroundColor: '#f5f5f5' }}>
          {mainHeader}
        </AppBar>
      )}
    </>
  );
};

Header.propTypes = {
  open: PropTypes.bool,
  handleDrawerToggle: PropTypes.func
};

export default Header;
