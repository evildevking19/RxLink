import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

const Loader = () => (
  <Backdrop sx={{ backgroundColor: '#fff', color: '#0000ff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={true} >
      <CircularProgress color="inherit" />
  </Backdrop>
);

export default Loader;
