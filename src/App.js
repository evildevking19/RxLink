import { lazy } from 'react';
// project import
import ThemeCustomization from 'themes';
import ScrollTop from 'components/ScrollTop';
import Loadable from 'components/Loadable';

const Routes = Loadable(lazy(() => import('routes')));

// ==============================|| APP - THEME, ROUTER, LOCAL  ||============================== //

const App = () => (
  <ThemeCustomization>
    <ScrollTop>
      <Routes />
    </ScrollTop>
  </ThemeCustomization>
);

export default App;
