import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// material-ui
import { Grid, Stack, Typography } from '@mui/material';
import { SyncOutlined } from '@ant-design/icons';

// project import
import AuthWrapper from './AuthWrapper';
import { verifyAccount } from 'store/reducers/auth';

// ================================|| Verify ||================================ //

const Verify = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { verify } = useSelector((state) => state.auth);

  useEffect(() => {
    if (params.token) dispatch(verifyAccount(params.token));
  }, [params]);

  useEffect(() => {
    if (verify) {
      navigate('/');
    }
  }, [verify]);

  return (
    <AuthWrapper>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ gap: 2, mb: { xs: -0.5, sm: 0.5 } }}>
            <Typography variant="h3">Verifying</Typography>
            <SyncOutlined spin style={{ fontSize: '24px' }} />
          </Stack>
        </Grid>
      </Grid>
    </AuthWrapper>
  );
};

export default Verify;
