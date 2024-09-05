// assets
import { LoginOutlined, ProfileOutlined, TeamOutlined, SendOutlined, CreditCardOutlined } from '@ant-design/icons';

// icons
const icons = {
  LoginOutlined,
  ProfileOutlined,
  TeamOutlined,
  SendOutlined,
  CreditCardOutlined
};
// ==============================|| MENU ITEMS - EXTRA PAGES ||============================== //
const pages = {
  id: 'authentication',
  title: 'Main',
  type: 'group',
  children: [
    {
      id: 'prescriptions',
      title: 'Prescriptions',
      type: 'item',
      url: '/dashboard/prescription',
      icon: icons.SendOutlined
    },
    {
      id: 'patients',
      title: 'Patients',
      type: 'item',
      url: '/dashboard/patient',
      icon: icons.TeamOutlined
    },
    {
      id: 'credit',
      title: 'Credit',
      type: 'item',
      url: '/dashboard/credit',
      icon: icons.CreditCardOutlined
    },
    {
      id: 'profile',
      title: 'Profile',
      type: 'item',
      hidden: true,
      url: '/dashboard/profile',
      icon: icons.ProfileOutlined
    }
  ]
};

export default pages;
