// project import
import AdminLayout from 'layout/AdminLayout';
import DashboardDefault from 'pages/dashboard';
import Prescription from 'pages/prescription';
import Patient from 'pages/patient';
import ProfilePage from 'pages/profile';
import CreditPage from 'pages/credit';

const AdminRoutes = {
  path: '/dashboard',
  element: <AdminLayout />,
  children: [
    {
      path: '',
      element: <DashboardDefault />
    },
    {
      path: 'prescription',
      element: <Prescription />
    },
    {
      path: 'patient',
      element: <Patient />
    },
    {
      path: 'profile',
      element: <ProfilePage />
    },
    {
      path: 'credit',
      element: <CreditPage />
    },
    {
      path: '*',
      element: <DashboardDefault />
    }
  ]
};

export default AdminRoutes;
