// project import
import NavCard from './NavCard';
import Navigation from './Navigation';
import SimpleBar from 'components/third-party/SimpleBar';

// ==============================|| DRAWER CONTENT ||============================== //

const DrawerContent = () => (
  <SimpleBar
    sx={{
      height: '100%',
      '& .simplebar-content': {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        alignItems: 'space-between'
      }
    }}
  >
    <Navigation />
    <NavCard />
  </SimpleBar>
);

export default DrawerContent;
