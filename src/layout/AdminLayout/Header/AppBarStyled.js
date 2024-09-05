// material-ui
import { styled } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';

// project import

// ==============================|| HEADER - APP BAR STYLED ||============================== //

const AppBarStyled = styled(AppBar, { shouldForwardProp: (prop) => prop !== 'open' })(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  backgroundColor: 'transparent',
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  })
}));

export default AppBarStyled;
