// project import
import MainLayout from 'layout/MainLayout';
import Home from 'pages/home';
import Verify from 'pages/verify';

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '',
      element: <Home />
    },
    {
      path: 'verify',
      element: <Verify />
    },
    {
      path: 'verify/:paramsId/:paramsDob',
      element: <Verify />
    },
    {
      path: '*',
      element: <Home />
    }
  ]
};

export default MainRoutes;
