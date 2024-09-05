import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Container } from '@mui/material';
export default function Footer() {
  return (
    <>
      <footer>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', gap: 2, py: 4, justifyContent: 'space-between' }}>
            <span>Rx-Link © 2024</span>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Link to="/faq">FAQ</Link>
              <Link to="/contact">Contact</Link>
            </Box>
          </Box>
        </Container>
      </footer>
    </>
  );
}
