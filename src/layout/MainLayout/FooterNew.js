import React from 'react';
// import { Link } from 'react-router-dom';
import { Box, Container, Typography, InputBase, useMediaQuery, Button } from '@mui/material';
import FooterLogo from 'assets/images/main/logo-footer.png';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
export default function Footer() {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const goToContacSection = () => {
    const element = document.getElementById('contactinfo-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  const goToFaqSection = () => {
    const element = document.getElementById('faq-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  return (
    <>
      <footer>
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              gap: 2,
              p: 8,
              justifyContent: 'space-between',
              alignItems: isMobile ? 'start' : 'end'
            }}
          >
            <Box sx={{ maxWidth: '650px' }}>
              <img src={FooterLogo} alt="Logo" style={{ width: '200px' }} />
              <Typography fontSize="20px" color="rgba(255, 255, 255, 0.6)" sx={{ mt: 2 }}>
                Our team is ready to demonstrate the power of our platform and discuss how we can tailor our services to meet your needs.
              </Typography>
            </Box>
            <div>
              <Typography color="white" fontSize="20px">
                Stay informed with rx-link
              </Typography>
              <Box
                sx={{
                  borderBottom: '1px solid rgb(255, 255, 255, 0.6)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '10px'
                }}
              >
                <InputBase placeholder="Type your email address" sx={{ fontSize: '16px', minWidth: '300px', py: 1 }} />
                <ArrowRightAltIcon color="white" sx={{ fontSize: '36px' }} />
              </Box>
            </div>
          </Box>
        </Container>
        <Container maxWidth="xl">
          <Box sx={{ pt: 3, pb: 6, display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255, 255, 255, 0.25)' }}>
            <Box sx={{ display: 'flex', gap: 4 }}>
              <Button onClick={() => goToFaqSection()}>FAQ</Button>
              <Button onClick={() => goToContacSection()}>Contact Us</Button>
            </Box>
            <Typography color="white">© 2024 All Rights Reserved</Typography>
          </Box>
        </Container>
      </footer>
    </>
  );
}
