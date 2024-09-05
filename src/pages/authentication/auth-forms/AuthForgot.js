// import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';

// material-ui
import { Button, FormHelperText, Grid, IconButton, InputAdornment, OutlinedInput, Stack, Typography } from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project import
import AnimateButton from 'components/@extended/AnimateButton';
import { forgotPassword } from 'store/reducers/auth';

// assets
// import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { UserOutlined } from '@ant-design/icons';

// ============================|| FIREBASE - LOGIN ||============================ //

const AuthForgot = () => {
  const dispatch = useDispatch();

  return (
    <>
      <Formik
        initialValues={{
          email: '',
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
            setStatus({ success: false });
            setSubmitting(true);
            dispatch(forgotPassword(values));
          } catch (err) {
            setStatus({ success: false });
            setErrors({ submit: err.message });
            setSubmitting(false);
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <OutlinedInput
                    id="email-login"
                    type="email"
                    value={values.email}
                    name="email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    fullWidth
                    startAdornment={
                      <InputAdornment position="start">
                        <IconButton edge="start" size="large">
                          <UserOutlined />
                        </IconButton>
                      </InputAdornment>
                    }
                    error={Boolean(touched.email && errors.email)}
                  />
                  {touched.email && errors.email && (
                    <FormHelperText error id="standard-weight-helper-text-email-login">
                      {errors.email}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>

              {errors.submit && (
                <Grid item xs={12}>
                  <FormHelperText error>{errors.submit}</FormHelperText>
                </Grid>
              )}
              <Grid item xs={12} align="center" sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <AnimateButton>
                  <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
                    Next
                  </Button>
                </AnimateButton>

                <Typography component={Link} to="/auth/login" variant="body1" sx={{ textDecoration: 'none' }} color="primary">
                  {`Back`}
                </Typography>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </>
  );
};

export default AuthForgot;
