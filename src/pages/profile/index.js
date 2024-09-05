import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// material-ui
import {
  Box,
  Button,
  FormHelperText,
  Grid,
  InputLabel,
  OutlinedInput,
  Stack,
  RadioGroup,
  Radio,
  FormControlLabel,
  InputAdornment,
  IconButton,
  FormControl,
  Typography
} from '@mui/material';
// third party
import * as Yup from 'yup';
import { Formik, useFormikContext } from 'formik';
// project import
import { strengthColor, strengthIndicator } from 'utils/password-strength';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import AnimateButton from 'components/@extended/AnimateButton';
import MainCard from 'components/MainCard';
import { changeProfile, savePassword, setUserGroup } from 'store/reducers/auth';

const FormCallBack = () => {
  const { resetForm } = useFormikContext() ?? {};
  const { resetPasswordStatus } = useSelector((state) => state.auth);

  useEffect(() => {
    if (resetPasswordStatus === 'success') {
      resetForm();
    }
  }, [resetPasswordStatus, resetForm]);
  return null;
};

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user, userGroup } = useSelector((state) => state.auth);

  const [level, setLevel] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const [practiceFocus, setPracticeFocus] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
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
    dispatch(setUserGroup());
  }, []);
  return (
    <MainCard title="Profile">
      <Grid container spacing={8}>
        <Grid item xs={12} sm={6}>
          <Formik
            initialValues={{
              firstname: user.firstname,
              lastname: user.lastname,
              phone: user.phone,
              practice: user.practice,
              gmc: user.gmc,
              role: user.role,
              avatar: null
            }}
            validationSchema={Yup.object().shape({
              firstname: Yup.string().max(255).required('First Name is required'),
              lastname: Yup.string().max(255).required('Last Name is required'),
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
                dispatch(changeProfile(values));
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
                  {/* <Grid item xs={12}>
                    <input
                      id="avatar"
                      name="avatar"
                      type="file"
                      onChange={(event) => {
                        setFieldValue('avatar', event.currentTarget.files[0]);
                      }}
                    />
                  </Grid> */}
                  <Grid item xs={12} md={6}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="firstname-profile">First Name*</InputLabel>
                      <OutlinedInput
                        id="firstname-login"
                        type="firstname"
                        value={values.firstname}
                        name="firstname"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder="John"
                        fullWidth
                        error={Boolean(touched.firstname && errors.firstname)}
                      />
                      {touched.firstname && errors.firstname && (
                        <FormHelperText error id="helper-text-firstname-profile">
                          {errors.firstname}
                        </FormHelperText>
                      )}
                    </Stack>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="lastname-profile">Last Name*</InputLabel>
                      <OutlinedInput
                        fullWidth
                        error={Boolean(touched.lastname && errors.lastname)}
                        id="lastname-profile"
                        type="lastname"
                        value={values.lastname}
                        name="lastname"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder="Doe"
                        inputProps={{}}
                      />
                      {touched.lastname && errors.lastname && (
                        <FormHelperText error id="helper-text-lastname-profile">
                          {errors.lastname}
                        </FormHelperText>
                      )}
                    </Stack>
                  </Grid>
                  <Grid item xs={12}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="phone-profile">Phone</InputLabel>
                      <OutlinedInput
                        fullWidth
                        error={Boolean(touched.phone && errors.phone)}
                        id="phone-profile"
                        value={values.phone}
                        name="phone"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder="+441434338212"
                        inputProps={{maxLength: 15}}
                      />
                      {touched.phone && errors.phone && (
                        <FormHelperText error id="helper-text-phone-profile">
                          {errors.phone}
                        </FormHelperText>
                      )}
                    </Stack>
                  </Grid>
                  <Grid item xs={12}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="practice-profile">Practice</InputLabel>
                      <OutlinedInput
                        fullWidth
                        list="user-group"
                        error={Boolean(touched.practice && errors.practice)}
                        id="practice-profile"
                        value={values.practice}
                        name="practice"
                        onBlur={(e) => {
                          if (!e.nativeEvent.relatedTarget || !e.nativeEvent.relatedTarget.dataset.group) setPracticeFocus(false);
                          handleBlur(e);
                        }}
                        onChange={handleChange}
                        onFocus={() => setPracticeFocus(true)}
                        placeholder="Demo practice name"
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
                        <FormHelperText error id="helper-text-practice-profile">
                          {errors.practice}
                        </FormHelperText>
                      )}
                    </Stack>
                  </Grid>
                  <Grid item xs={12}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="phone-profile">GMC number</InputLabel>
                      <OutlinedInput
                        fullWidth
                        error={Boolean(touched.gmc && errors.gmc)}
                        id="gmc-profile"
                        value={values.gmc}
                        name="gmc"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder="1234567890"
                        inputProps={{maxLength: 10}}
                      />
                      {touched.gmc && errors.gmc && (
                        <FormHelperText error id="helper-text-gmc-profile">
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
                  {errors.submit && (
                    <Grid item xs={12}>
                      <FormHelperText error>{errors.submit}</FormHelperText>
                    </Grid>
                  )}
                  <Grid item xs={12}>
                    <AnimateButton>
                      <Button
                        disableElevation
                        disabled={isSubmitting}
                        fullWidth
                        size="large"
                        type="submit"
                        variant="contained"
                        color="primary"
                      >
                        Save Profile
                      </Button>
                    </AnimateButton>
                  </Grid>
                </Grid>
              </form>
            )}
          </Formik>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Formik
            initialValues={{
              current: '',
              password: '',
              confirm: ''
            }}
            validationSchema={Yup.object().shape({
              current: Yup.string().max(255).required('Current password is required'),
              password: Yup.string()
                .max(255)
                .required('New password is required')
                .notOneOf([Yup.ref('current'), null], 'This is old password'),
              confirm: Yup.string()
                .max(255)
                .required('Confirm password is required')
                .oneOf([Yup.ref('password'), null], 'Passwords must match')
            })}
            onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
              try {
                setStatus({ success: false });
                setSubmitting(false);
                dispatch(savePassword(values));
              } catch (err) {
                console.error(err);
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
                      <InputLabel htmlFor="current-password">Current password</InputLabel>
                      <OutlinedInput
                        id="current-password"
                        type="password"
                        value={values.current}
                        name="current"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder="Password"
                        fullWidth
                        error={Boolean(touched.current && errors.current)}
                      />
                      {touched.current && errors.current && (
                        <FormHelperText error id="helper-text-current-profile">
                          {errors.current}
                        </FormHelperText>
                      )}
                    </Stack>
                  </Grid>
                  <Grid item xs={12}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="password">New Password</InputLabel>
                      <OutlinedInput
                        fullWidth
                        error={Boolean(touched.password && errors.password)}
                        id="password"
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
                        placeholder="******"
                        inputProps={{}}
                      />
                      {touched.password && errors.password && (
                        <FormHelperText error id="helper-text-password">
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
                    <Stack spacing={1}>
                      <InputLabel htmlFor="confirm-password">Confirm password</InputLabel>
                      <OutlinedInput
                        id="confirm-password"
                        type="password"
                        value={values.confirm}
                        name="confirm"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder="Confirm password"
                        fullWidth
                        error={Boolean(touched.confirm && errors.confirm)}
                      />
                      {touched.confirm && errors.confirm && (
                        <FormHelperText error id="helper-text-confirm">
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
                  <Grid item xs={12}>
                    <AnimateButton>
                      <Button
                        disableElevation
                        disabled={isSubmitting}
                        fullWidth
                        size="large"
                        type="submit"
                        variant="contained"
                        color="primary"
                      >
                        Set password
                      </Button>
                    </AnimateButton>
                  </Grid>
                </Grid>
              </form>
            )}
          </Formik>
        </Grid>
      </Grid>
    </MainCard>
  );
};

export default ProfilePage;
