import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// material-ui
import { Button, FormHelperText, Grid, IconButton, InputAdornment, OutlinedInput, Stack, Typography, FormControl, Box } from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik, useFormikContext } from 'formik';

// project import
import AnimateButton from 'components/@extended/AnimateButton';
import { resetPassword } from 'store/reducers/auth';

// assets
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { strengthColor, strengthIndicator } from 'utils/password-strength';

// ============================|| FIREBASE - LOGIN ||============================ //
  
const AuthNewPassword = () => {
    
  const navigate = useNavigate();
  const { user, resetPasswordStatus } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [level, setLevel] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const FormCallBack = () => {
    const { resetForm } = useFormikContext() ?? {};

    useEffect(() => {
    if (resetPasswordStatus === 'success') {
        resetForm();
    }
    }, [resetPasswordStatus, resetForm]);
    return null;
  };
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const changePassword = (value) => {
    const temp = strengthIndicator(value);
    setLevel(strengthColor(temp));
  };
  // const changeConfirmPassword = (value) => {
  //   const temp = strengthIndicator(value);
  // };

  useEffect(() => {
    if (resetPasswordStatus === 'success') {
      navigate('/auth/login');
    }
  }, [resetPasswordStatus, navigate]);

  return (
    <>
      <Formik
        initialValues={{
          email: user.email,
          password: '',
        }}
        validationSchema={Yup.object().shape({
          password: Yup.string().max(255).required('Password is required'),
          confirm: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match').max(255).required('Password is required')
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
            setStatus({ success: false });
            setSubmitting(true);
            dispatch(resetPassword(values));
          } catch (err) {
            setStatus({ success: false });
            setErrors({ submit: err.message });
            setSubmitting(false);
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            <FormCallBack />
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Stack spacing={1}>
                    <OutlinedInput
                        fullWidth
                        error={Boolean(touched.password && errors.password)}
                        id="-password-login"
                        type={showPassword ? 'text' : 'password'}
                        value={values.password}
                        name="password"
                        onBlur={handleBlur}
                        onChange={(e) => {
                            handleChange(e);
                            changePassword(e.target.value);
                          }}
                        startAdornment={
                        <InputAdornment position="start">
                            <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="start"
                            size="large"
                            >
                            {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                            </IconButton>
                        </InputAdornment>
                        }
                        placeholder="Enter new password"
                    />
                  {touched.email && errors.email && (
                    <FormHelperText error id="standard-weight-helper-text-email-login">
                      {errors.email}
                    </FormHelperText>
                  )}
                </Stack>
                
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item>
                      <Box sx={{ bgcolor: level?.color, width: 85, height: 8, borderRadius: '7px' }} />
                    </Grid>
                    <Grid item>
                      <Typography variant="subtitle1" fontSize="0.75rem">
                        {level?.label}
                      </Typography>
                    </Grid>
                  </Grid>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.confirm && errors.confirm)}
                    id="-confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={values.confirm}
                    name="confirm"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    startAdornment={
                      <InputAdornment position="start">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowConfirmPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="start"
                          size="large"
                        >
                          {showConfirmPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                        </IconButton>
                      </InputAdornment>
                    }
                    placeholder="Confirm new password"
                  />
                  {touched.confirm && errors.confirm && (
                    <FormHelperText error id="standard-weight-helper-text-password-login">
                      {errors.confirm}
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
                    Submit
                  </Button>
                </AnimateButton>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </>
  );
};

export default AuthNewPassword;
