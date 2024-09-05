import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
// material-ui
import { Box, Grid, useMediaQuery } from '@mui/material';

// project import
import AuthFooter from 'components/cards/AuthFooter';

// assets
import AuthImage from 'assets/images/auth/authImage.png';
import logo from 'assets/images/main/logo-blue.png';

// ==============================|| AUTHENTICATION - WRAPPER ||============================== //

const AuthWrapper = ({ children }) => {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  return (
    <Box sx={{ height: '100vh', bgcolor: '#F5F5F5' }} id="auth-layout">
      <Grid container sx={{ height: '100vh' }}>
        {!isMobile && (
          <Grid sm={6} xs={12}>
            <Box
              sx={{
                width: '100%',
                height: '100vh',
                backgroundImage: `url(${AuthImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            ></Box>
          </Grid>
        )}
        <Grid item sm={6} xs={12} sx={{ display: 'flex', flexDirection: 'column', height: '100vh', overflowY: 'scroll' }}>
          <Box sx={{ textAlign: 'center', p: 8 }}>
            <Link to="/">
              <img src={logo} alt="Logo" style={{ width: '180px' }} />
            </Link>
          </Box>
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ maxWidth: '500px', px: 2, pb: 4 }}>{children}</Box>
          </Box>
        </Grid>
        <Grid item xs={12} sx={{ m: 3, mt: 1 }}>
          <AuthFooter />
        </Grid>
      </Grid>
    </Box>
  );
};

AuthWrapper.propTypes = {
  children: PropTypes.node
};

export default AuthWrapper;
