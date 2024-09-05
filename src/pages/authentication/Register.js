import { useState } from 'react';
import { Link } from 'react-router-dom';

// material-ui
import { Grid, Stack, Typography } from '@mui/material';

// project import
import FirebaseRegister from './auth-forms/AuthRegister';
import AuthWrapper from './AuthWrapper';

// ================================|| REGISTER ||================================ //

const Register = () => {
  const [verifying, setVerifying] = useState(null);
  return (
    <AuthWrapper>
      <Grid className={verifying ? 'hidden' : ''} container spacing={3}>
        <Grid item xs={12}>
          <Stack direction="column" spacing={1}>
            <Typography variant="h3">Create new account!</Typography>
            <Typography component={Link} to="/auth/login" variant="body1" sx={{ textDecoration: 'none' }} color="primary">
              Already have an account?
            </Typography>
          </Stack>
        </Grid>

        <Grid item xs={12}>
          <FirebaseRegister setVerifying={setVerifying} />
        </Grid>
      </Grid>
      {verifying && <Typography variant="h4">Check your email</Typography>}
    </AuthWrapper>
  );
};

export default Register;
