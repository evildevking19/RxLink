import { useEffect } from 'react';
import { Grid, Box, Button, Container, Typography, Stack, InputLabel, OutlinedInput, FormHelperText } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';

import toastr from 'toastr';
import axios from 'axios';
import * as Yup from 'yup';
import { Formik, useFormikContext } from 'formik';
import AnimateButton from 'components/@extended/AnimateButton';
import './contact.css';
import imgMain from 'assets/images/main/main-bg.jpg';
import imgContact from 'assets/images/main/contact.png';
import PropTypes from 'prop-types';

const FormCallBack = ({ status }) => {
  const { resetForm } = useFormikContext() ?? {};
  useEffect(() => {
    if (status?.success === true) {
      resetForm();
    }
  }, [status, resetForm]);
  return null;
};
FormCallBack.propTypes = {
  status: PropTypes.bool.isRequired
};

const Contact = () => {
  return (
    <>
      <section className="verify">
        <Box
          sx={{
            backgroundImage: `url(${imgMain})`,
            backgroundSize: 'cover',
            backgroundPosition: 'right',
            py: 4,
            minHeight: '390px',
            alignItems: 'center',
            display: 'flex'
          }}
        >
          <Container maxWidth="sm">
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      p: 1,
                      border: '1px solid #ff677e',
                      borderRadius: '50%',
                      width: '60px',
                      height: '60px'
                    }}
                  >
                    <LocationOnIcon fontSize="large" sx={{ color: '#ff677e' }} />
                  </Box>
                  <Typography variant="h4" component="h3" color="#ff677e">
                    Address1
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      p: 1,
                      border: '1px solid #ff677e',
                      borderRadius: '50%',
                      width: '60px',
                      height: '60px'
                    }}
                  >
                    <EmailIcon fontSize="large" sx={{ color: '#ff677e' }} />
                  </Box>
                  <Typography variant="h4" component="h3" color="#ff677e">
                    scripts@rxlink.com
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      p: 1,
                      border: '1px solid #ff677e',
                      borderRadius: '50%',
                      width: '60px',
                      height: '60px'
                    }}
                  >
                    <PhoneIcon fontSize="large" sx={{ color: '#ff677e' }} />
                  </Box>
                  <Typography variant="h4" component="h3" color="#ff677e">
                    +44 (0) 330 113 7894
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </section>
      <Box component="section" sx={{ padding: '20px 0', marginTop: '20px' }}>
        <Container maxWidth="lg" sx={{ backgroundImage: `url(${imgContact})`, backgroundSize: 'cover' }}>
          <Grid container>
            <Grid item xs={12} sm={6}>
              <Formik
                initialValues={{
                  fullname: '',
                  email: '',
                  phone: '',
                  message: ''
                }}
                validationSchema={Yup.object().shape({
                  fullname: Yup.string().max(255).required('Full Name is required'),
                  email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
                  phone: Yup.string().max(255).required('Phone is required'),
                  message: Yup.string().max(255).required('Message is required')
                })}
                onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                  try {
                    axios
                      .post('/api/home/contact', values)
                      .then((res) => {
                        if (res.data.status === 'success') {
                          toastr.success('Your message is sent successfully');
                          setStatus({ success: true });
                        } else {
                          setStatus({ success: false });
                          toastr.warning(res.data.error);
                        }
                        setSubmitting(false);
                      })
                      .catch((err) => {
                        console.log(err);
                        setStatus({ success: false });
                        setSubmitting(false);
                      });
                  } catch (err) {
                    console.error(err);
                    setStatus({ success: false });
                    setErrors({ submit: err.message });
                    setSubmitting(false);
                  }
                }}
              >
                {({ errors, handleBlur, handleChange, handleSubmit, status, isSubmitting, touched, values }) => (
                  <form noValidate onSubmit={handleSubmit}>
                    <FormCallBack status={status} />
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <Stack spacing={1}>
                          <InputLabel htmlFor="firstname-contact">
                            Full Name
                            <Typography component="span" color="red">
                              *
                            </Typography>
                          </InputLabel>
                          <OutlinedInput
                            id="fullname-contact"
                            type="fullname"
                            value={values.fullname}
                            name="fullname"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            placeholder="John"
                            fullWidth
                            error={Boolean(touched.fullname && errors.fullname)}
                          />
                          {touched.fullname && errors.fullname && (
                            <FormHelperText error id="helper-text-fullname-contact">
                              {errors.fullname}
                            </FormHelperText>
                          )}
                        </Stack>
                      </Grid>
                      <Grid item xs={12}>
                        <Stack spacing={1}>
                          <InputLabel htmlFor="email-contact">
                            Email Address
                            <Typography component="span" color="red">
                              *
                            </Typography>
                          </InputLabel>
                          <OutlinedInput
                            fullWidth
                            error={Boolean(touched.email && errors.email)}
                            id="email-contact"
                            type="email"
                            value={values.email}
                            name="email"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            placeholder="demo@phone.com"
                            inputProps={{}}
                          />
                          {touched.email && errors.email && (
                            <FormHelperText error id="helper-text-email-contact">
                              {errors.email}
                            </FormHelperText>
                          )}
                        </Stack>
                      </Grid>
                      <Grid item xs={12}>
                        <Stack spacing={1}>
                          <InputLabel htmlFor="phone-contact">
                            Phone
                            <Typography component="span" color="red">
                              *
                            </Typography>
                          </InputLabel>
                          <OutlinedInput
                            fullWidth
                            error={Boolean(touched.phone && errors.phone)}
                            id="phone-contact"
                            value={values.phone}
                            name="phone"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            placeholder="+441434338212"
                            inputProps={{}}
                          />
                          {touched.phone && errors.phone && (
                            <FormHelperText error id="helper-text-phone-contact">
                              {errors.phone}
                            </FormHelperText>
                          )}
                        </Stack>
                      </Grid>
                      <Grid item xs={12}>
                        <Stack spacing={1}>
                          <InputLabel htmlFor="message-contact">
                            Message
                            <Typography component="span" color="red">
                              *
                            </Typography>
                          </InputLabel>
                          <OutlinedInput
                            fullWidth
                            type="string"
                            multiline
                            minRows={3}
                            error={Boolean(touched.message && errors.message)}
                            id="message-contact"
                            value={values.message}
                            name="message"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            placeholder="Demo message name"
                            inputProps={{}}
                          />
                          {touched.message && errors.message && (
                            <FormHelperText error id="helper-text-message-contact">
                              {errors.message}
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
                            Submit
                          </Button>
                        </AnimateButton>
                      </Grid>
                    </Grid>
                  </form>
                )}
              </Formik>
            </Grid>
            <Grid item xs={12} sm={6}></Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};
export default Contact;
