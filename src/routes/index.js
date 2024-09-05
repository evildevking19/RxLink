import { useEffect } from 'react';
import { useRoutes, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Cookies from 'js-cookie';

// project import
import { signinByToken } from 'store/reducers/auth';
import LoginRoutes from './LoginRoutes';
import AdminRoutes from './AdminRoutes';
import MainRoutes from './MainRoutes';

// ==============================|| ROUTING RENDER ||============================== //

export default function ThemeRoutes() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { logined, signinStatus } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!logined) {
      // const cookieFlag = Cookies.get('required-cookies');
      // if (cookieFlag) {
        const token = Cookies.get('rxlink-token');
        if (token) {
          dispatch(signinByToken(token));
        } else if (location.pathname.startsWith('/dashboard')) {
          navigate('/');
        }
      // } else {
      //   navigate('/');
      // }
    }
  }, [logined]);

  useEffect(() => {
    if (signinStatus == 'invalid-token') navigate('/');
  }, [signinStatus]);
  return useRoutes([MainRoutes, LoginRoutes, AdminRoutes]);
}
