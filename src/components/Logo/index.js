import PropTypes from 'prop-types';

// material-ui
import { ButtonBase } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

// project import
import Logo from './Logo';
import { activeItem } from 'store/reducers/menu';

// ==============================|| MAIN LOGO ||============================== //

const LogoSection = ({ sx }) => {
  const { defaultId } = useSelector((state) => state.menu);
  const dispatch = useDispatch();
  return (
    <ButtonBase disableRipple onClick={() => dispatch(activeItem({ openItem: [defaultId] }))} sx={sx}>
      <Logo />
    </ButtonBase>
  );
};

LogoSection.propTypes = {
  sx: PropTypes.object,
  to: PropTypes.string
};

export default LogoSection;
