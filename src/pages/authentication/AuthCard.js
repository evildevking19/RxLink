import PropTypes from 'prop-types';

// material-ui
import { Box } from '@mui/material';

// ==============================|| AUTHENTICATION - CARD WRAPPER ||============================== //

const AuthCard = ({ children }) => (
  <>
    <Box sx={{ maxWidth: '400px' }}>{children}</Box>
  </>
);

AuthCard.propTypes = {
  children: PropTypes.node
};

export default AuthCard;
