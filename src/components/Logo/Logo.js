// material-ui
import { Link } from 'react-router-dom';

import { Box, useMediaQuery } from '@mui/material';

import logo from 'assets/images/main/logo-blue.png';
import logoXs from 'assets/images/main/logo-blue-xs.png';

/**
 * if you want to use image instead of <svg> uncomment following.
 *
 * import logoDark from 'assets/images/logo-dark.svg';
 * import logo from 'assets/images/logo.svg';
 *
 */

// ==============================|| LOGO SVG ||============================== //

const Logo = () => {
  const matchesXs = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  return (
    /**
     * if you want to use image instead of svg uncomment following, and comment out <svg> element.
     *
     * <img src={logo} alt='Mantis' width='100' />
     *
     */
    <Box
      sx={{
        width: matchesXs ? '60px' : '220px'
      }}
    >
      <Link to="/" style={{ display: 'block', textAlign: 'left' }}>
        <img src={matchesXs ? logoXs : logo} alt="Logo" style={{ margin: '20px 0' }} />
      </Link>
    </Box>
  );
};

export default Logo;
