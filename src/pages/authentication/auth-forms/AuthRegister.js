import { useEffect, useState } from 'react';
// import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';

// material-ui
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Stack,
  Typography,
  RadioGroup,
  Radio,
  FormControlLabel
} from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';
import axios from 'axios';
import toastr from 'toastr';

// project import
import AnimateButton from 'components/@extended/AnimateButton';
import { strengthColor, strengthIndicator } from 'utils/password-strength';

// assets
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';

// ============================|| FIREBASE - REGISTER ||============================ //
const AuthRegister = ({ setVerifying }) => {
  const [level, setLevel] = useState();
  const [userGroup, setUserGroup] = useState([]);
  const [practiceFocus, setPracticeFocus] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const loadPracticeList = () => {
    axios
      .get('/api/auth/getPracticeList')
      .then((res) => {
        if (res.data.status === 'success') setUserGroup(res.data.list);
        else toastr.warning(res.data.error);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const changePassword = (value) => {
    const temp = strengthIndicator(value);
    setLevel(strengthColor(temp));
  };

  useEffect(() => {
    changePassword('');
    loadPracticeList();
  }, []);

  return (
    <>
      <Formik
        initialValues={{
          firstname: '',
          lastname: '',
          email: '',
          phone: '',
          practice: '',
          gmc: '',
          password: '',
          role: 1
        }}
        validationSchema={Yup.object().shape({
          firstname: Yup.string().max(255).required('First Name is required'),
          lastname: Yup.string().max(255).required('Last Name is required'),
          email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
          password: Yup.string().max(225).required('Password is required'),
          phone: Yup.string()
                    .matches(/^\+[1-9]\d{1,14}$/, 'Phone number is not valid')
                    .min(10, 'Phone number is too short')
                    .max(15, 'Phone number is too long')
                    .required('Phone is required'),
          practice: Yup.string().max(255).required('Practice is required'),
          gmc: Yup.string().matches(/^[0-9]+$/, 'GMC number must contain only numbers').length(10, 'GMC number must be exactly 10 characters').required('GMC number is required')
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
            setStatus({ success: false });
            setSubmitting(false);
            axios
              .post('/api/auth/register', values)
              .then((res) => {
                console.log(res);
                if (res.data.status === 'success') setVerifying(true);
                else toastr.warning(res.data.error);
              })
              .catch((err) => {
                console.log(err);
              });
          } catch (err) {
            console.error(err);
            setStatus({ success: false });
            setErrors({ submit: err.message });
            setSubmitting(false);
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, setFieldValue }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Stack spacing={1}>
                  <OutlinedInput
                    id="firstname-login"
                    type="firstname"
                    value={values.firstname}
                    name="firstname"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="First Name"
                    fullWidth
                    error={Boolean(touched.firstname && errors.firstname)}
                  />
                  {touched.firstname && errors.firstname && (
                    <FormHelperText error id="helper-text-firstname-signup">
                      {errors.firstname}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={12} md={6}>
                <Stack spacing={1}>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.lastname && errors.lastname)}
                    id="lastname-signup"
                    type="lastname"
                    value={values.lastname}
                    name="lastname"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Last Name"
                    inputProps={{}}
                  />
                  {touched.lastname && errors.lastname && (
                    <FormHelperText error id="helper-text-lastname-signup">
                      {errors.lastname}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.email && errors.email)}
                    id="email-login"
                    type="email"
                    value={values.email}
                    name="email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Email Address"
                    inputProps={{}}
                  />
                  {touched.email && errors.email && (
                    <FormHelperText error id="helper-text-email-signup">
                      {errors.email}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.phone && errors.phone)}
                    id="phone-signup"
                    value={values.phone}
                    name="phone"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="+441434338212"
                    inputProps={{maxLength: 15}}
                  />
                  {touched.phone && errors.phone && (
                    <FormHelperText error id="helper-text-phone-signup">
                      {errors.phone}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <OutlinedInput
                    fullWidth
                    list="user-group"
                    error={Boolean(touched.practice && errors.practice)}
                    id="practice-signup"
                    value={values.practice}
                    name="practice"
                    onBlur={(e) => {
                      if (!e.nativeEvent.relatedTarget || !e.nativeEvent.relatedTarget.dataset.group) setPracticeFocus(false);
                      handleBlur(e);
                    }}
                    onChange={handleChange}
                    onFocus={() => setPracticeFocus(true)}
                    placeholder="Practice"
                    inputProps={{ autoComplete: 'off' }}
                  />
                  {practiceFocus &&
                    userGroup.filter((item) => item.toLowerCase().startsWith(values.practice.toLowerCase())).length !== 0 && (
                      <div id="user-group-box">
                        <div id="user-group">
                          {userGroup
                            .filter((item) => item.toLowerCase().startsWith(values.practice.toLowerCase()))
                            .map((item) => (
                              <button
                                type="button"
                                key={item}
                                data-group={true}
                                onClick={(e) => {
                                  e.preventDefault();
                                  setPracticeFocus(false);
                                  setFieldValue('practice', item);
                                }}
                              >
                                {item}
                              </button>
                            ))}
                        </div>
                      </div>
                    )}
                  {touched.practice && errors.practice && (
                    <FormHelperText error id="helper-text-practice-signup">
                      {errors.practice}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.gmc && errors.gmc)}
                    id="gmc-signup"
                    value={values.gmc}
                    name="gmc"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="GMC number"
                    inputProps={{maxLength: 10}}
                  />
                  {touched.gmc && errors.gmc && (
                    <FormHelperText error id="helper-text-gmc-signup">
                      {errors.gmc}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={12} className="hidden">
                <Stack spacing={1}>
                  <RadioGroup
                    row
                    aria-labelledby="demo-form-control-label-placement"
                    name="role"
                    onChange={handleChange}
                    value={values.role}
                  >
                    <FormControlLabel value="1" control={<Radio />} label="Doctor" />
                    <FormControlLabel value="2" control={<Radio />} label="Pharmacist" />
                  </RadioGroup>
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.password && errors.password)}
                    id="password-signup"
                    type={showPassword ? 'text' : 'password'}
                    value={values.password}
                    name="password"
                    onBlur={handleBlur}
                    onChange={(e) => {
                      handleChange(e);
                      changePassword(e.target.value);
                    }}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                          size="large"
                        >
                          {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                        </IconButton>
                      </InputAdornment>
                    }
                    placeholder="Password"
                    inputProps={{}}
                  />
                  {touched.password && errors.password && (
                    <FormHelperText error id="helper-text-password-signup">
                      {errors.password}
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
                {/* <Typography variant="body2">
                  By Signing up, you agree to our &nbsp;
                  <Link variant="subtitle2" component={RouterLink} to="/terms">
                    Terms of Service
                  </Link>
                  &nbsp; and &nbsp;
                  <Link variant="subtitle2" component={RouterLink} to="/privacy">
                    Privacy Policy
                  </Link>
                </Typography> */}
              </Grid>
              {errors.submit && (
                <Grid item xs={12}>
                  <FormHelperText error>{errors.submit}</FormHelperText>
                </Grid>
              )}
              <Grid item xs={12}>
                <AnimateButton>
                  <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
                    Create Account
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
AuthRegister.propTypes = {
  setVerifying: PropTypes.func
};
export default AuthRegister;
