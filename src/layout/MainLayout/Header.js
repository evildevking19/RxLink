import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
// material-ui
import { Button, Container } from '@mui/material';

import AccountMenu from 'components/main/AccountMenu';
import logoDark from 'assets/images/main/logo-blue.png';
import logoLight from 'assets/images/main/logo-blue.png';

export default function Header() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  const { logined: loggedIn } = useSelector((state) => state.auth);

  const goToDispenseSection = () => {
    const element = document.getElementById('dispense-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    window.scrollTo({
      top: 0
    });

    const handleScroll = () => {
      const isScrolled = window.scrollY > 1;
      setScrolled(isScrolled);
    };

    // Add scroll event listener when component mounts
    window.addEventListener('scroll', handleScroll);

    // Remove scroll event listener when component unmounts
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); // Empty dependency array to run the effect only once when the component mounts

  return (
    <>
      <header className={scrolled ? 'main sticky' : 'main sticky'}>
        <Container maxWidth="xl" className="header-container">
          <Link to="/" className="header-logo">
            <img src={logoLight} alt="Prescription" style={{ width: '180px', maxheight: '43px' }} />
            <img src={logoDark} alt="Prescription" />
          </Link>
          <div className="header-nav">
            <div className="navbar-right dispense">
              <Button
                rounded="full"
                onClick={() => goToDispenseSection()}
                variant="contained"
                color="primary"
                style={{ fontSize: '1rem', textTransform: 'none' }}
              >
                Dispense Prescription
              </Button>
            </div>

            {!loggedIn && (
              <div className="navbar-right">
                <Button rounded="full" onClick={() => navigate('/auth/login')} variant="outlined" color="primary" sx={{ ml: 2 }}>
                  Log in
                </Button>
                <Button rounded="full" onClick={() => navigate('/auth/register')} variant="outlined" color="primary">
                  Sign up
                </Button>
              </div>
            )}
            {loggedIn && (
              <div className="navbar-right">
                <AccountMenu />
              </div>
            )}
          </div>
        </Container>
      </header>
    </>
  );
}
