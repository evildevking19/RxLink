import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
// material-ui
import { Box, Button } from '@mui/material';

// project import
import MainCard from 'components/MainCard';
import { SettingOutlined, LogoutOutlined } from '@ant-design/icons';
import { logout } from 'store/reducers/auth';

// assets
import AnimateButton from 'components/@extended/AnimateButton';

// ==============================|| DRAWER CONTENT - NAVIGATION CARD ||============================== //

const NavCard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  return (
    <MainCard sx={{ bgcolor: 'grey.50', m: 0, width: '100%', position: 'absolute', bottom: 0 }}>
      <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column' }}>
        <AnimateButton>
          <Button onClick={() => navigate('/dashboard/profile')} variant="outlined" color="primary" fullWidth startIcon={<SettingOutlined />}>
            Profile
          </Button>
        </AnimateButton>
        <AnimateButton>
          <Button onClick={() => dispatch(logout())} variant="outlined" color="primary" fullWidth startIcon={<LogoutOutlined />}>
            Logout
          </Button>
        </AnimateButton>
      </Box>
    </MainCard>
  );
};

export default NavCard;
