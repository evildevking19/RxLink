// project import
import MinimalLayout from 'layout/MinimalLayout';
import AuthLogin from 'pages/authentication/Login';
import AuthRegister from 'pages/authentication/Register'
import AuthForgot from 'pages/authentication/ForgotPassword';
import AuthVerify from 'pages/authentication/Verify';

const LoginRoutes = {
  path: '/auth',
  element: <MinimalLayout />,
  children: [
    {
      path: 'login',
      element: <AuthLogin />
    },
    {
      path: 'register',
      element: <AuthRegister />
    },
    {
      path: 'forgotpassword',
      element: <AuthForgot />
    },
    {
      path: 'verify/:token',
      element: <AuthVerify />
    }
  ]
};

export default LoginRoutes;
