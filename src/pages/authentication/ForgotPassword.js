import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// material-ui
import { Box, Button, Grid, Stack, Typography, InputBase } from '@mui/material';

// project import
import AuthForgot from './auth-forms/AuthForgot';
import AuthNewPassword from './auth-forms/AuthNewPassword';
import AuthWrapper from './AuthWrapper';
import { codeVerifyToForgot, backToSignin } from 'store/reducers/auth';

// ================================|| LOGIN ||================================ //

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [verifyCode, setVerifyCode] = useState('');
  const dispatch = useDispatch();
  const { signinStatus, user, verifyCode: code } = useSelector((state) => state.auth);
  const handleCodeVerify = () => {
    dispatch(codeVerifyToForgot({ verifyCode, email: user.email }));
  };
  const handleBack = () => {
    dispatch(backToSignin());
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      handleCodeVerify();
    }
  };

  useEffect(() => {
    if (signinStatus === 'success') {
      navigate('/auth/login');
    } else if (signinStatus === 'savepassword') {
      setVerifyCode('');
    } else if (signinStatus === 'codeverify') {
      setVerifyCode('');
    }
  }, [signinStatus, navigate]);
  return (
    <AuthWrapper>
      {signinStatus !== 'codeverify' && signinStatus !== 'savenewpassword' && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Stack direction="column" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
              <Typography variant="h4" color="textSecondary">
                Reset your password
              </Typography>
              <Typography variant="h5">Enter your email address so we can reset your password.</Typography>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <AuthForgot />
          </Grid>
        </Grid>
      )}

      {signinStatus === 'codeverify' && (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography sx={{ py: 1 }}>Enter your verify code</Typography>
            <Button variant="text" color="primary" onClick={handleBack}>
              Back
            </Button>
          </Box>
          <Box sx={{ border: '1px solid #ccc', padding: '5px', borderRadius: 1 }}>
            <InputBase
              sx={{ pl: 1 }}
              onKeyDown={handleKeyDown}
              type="text"
              value={verifyCode}
              onChange={(e) => setVerifyCode(e.target.value)}
              placeholder="5 digits number"
            />
            <Button variant="contained" color="primary" onClick={handleCodeVerify}>
              Verify
            </Button>
          </Box>
          <Typography sx={{ py: 1 }}>{code}</Typography>
        </>
      )}
      {signinStatus === 'savenewpassword' && (
          <Grid container spacing={3}>
          <Grid item xs={12}>
            <Stack direction="column" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
              <Typography variant="h4" color="textSecondary">
                Reset your password
              </Typography>
              <Typography variant="h5">Choose your new password.</Typography>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <AuthNewPassword />
          </Grid>
        </Grid>
      )}
    </AuthWrapper>
  );
};
export default ForgotPassword;
