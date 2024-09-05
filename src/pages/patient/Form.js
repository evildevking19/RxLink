import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Box, Button, Stack, InputLabel, OutlinedInput, FormHelperText } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { savePatient } from 'store/reducers/patient';
import AnimateButton from 'components/@extended/AnimateButton';
import { setEditMode } from 'store/reducers/patient';

// third party
import * as Yup from 'yup';
import { Formik, useFormikContext, useField } from 'formik';
import { styled } from '@mui/material/styles';
import { formatDate, formatDate2Object } from 'utils/common';
const DatePicker = styled((props) => <ReactDatePicker {...props} />)(() => ({
  border: '1px solid #ddd',
  width: '100%',
  outline: 0,
  padding: '12px',
  borderRadius: '3px',
  fontSize: '14px',
  '.react-datepicker__tab-loop': {
    margin: '0!important'
  }
}));

export const DatePickerField = ({ ...props }) => {
  const { setFieldValue, handleBlur } = useFormikContext();
  const [field] = useField(props);

  const handleDateChange = (val) => {
    setFieldValue(field.name, val);
  };
  return (
    <DatePicker
      {...field}
      {...props}
      onBlur={handleBlur}
      selected={field.value}
      onChange={handleDateChange}
      scrollableYearDropdown
      showYearDropdown
      yearDropdownItemNumber={100}
      placeholderText="09-02-2024"
      dateFormat="dd-MM-yyyy"
    />
  );
};

const FormCallBack = () => {
  const dispatch = useDispatch();
  const { resetForm, setFieldValue } = useFormikContext() ?? {};
  const { editData } = useSelector((state) => state.patient);
  const { saveStatus } = useSelector((state) => state.patient);

  useEffect(() => {
    if (editData._id) {
      setFieldValue('id', editData._id);
      setFieldValue('firstname', editData.firstname);
      setFieldValue('lastname', editData.lastname);
      setFieldValue('email', editData.email);
      setFieldValue('phone', editData.phone);
      setFieldValue('birthday', formatDate2Object(editData.birthday));
      setFieldValue('nhs', editData.nhs);
    }
  }, [editData]);

  useEffect(() => {
    if (saveStatus === 'success') {
      resetForm();
      dispatch(setEditMode(false));
    }
  }, [saveStatus, resetForm, dispatch]);
  return null;
};
const Form = () => {
  const dispatch = useDispatch();
  return (
    <>
      <Box sx={{ mt: 2, maxWidth: '500px' }}>
        <Formik
          initialValues={{
            firstname: '',
            lastname: '',
            email: '',
            phone: '',
            nhs: '',
            birthday: ''
          }}
          validationSchema={Yup.object().shape({
            firstname: Yup.string().max(255).required('First Name is required'),
            lastname: Yup.string().max(255).required('Last Name is required'),
            email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
            phone: Yup.string().max(15).required('Phone is required'),
            nhs: Yup.string().max(255).required('NHS number is required'),
            birthday: Yup.string().max(255).required('DOB is required')
          })}
          onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
            try {
              setStatus({ success: false });
              setSubmitting(false);
              dispatch(savePatient({ ...values, birthday: formatDate(values.birthday) }));
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
                <input type="hidden" value={values._id} name="_id" />
                <Grid item xs={12} md={6}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="firstname-register">First Name*</InputLabel>
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
                      <FormHelperText error id="helper-text-firstname-register">
                        {errors.firstname}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="lastname-register">Last Name*</InputLabel>
                    <OutlinedInput
                      fullWidth
                      error={Boolean(touched.lastname && errors.lastname)}
                      id="lastname-register"
                      type="lastname"
                      value={values.lastname}
                      name="lastname"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="Doe"
                      inputProps={{}}
                    />
                    {touched.lastname && errors.lastname && (
                      <FormHelperText error id="helper-text-lastname-register">
                        {errors.lastname}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="email-register">Email Address*</InputLabel>
                    <OutlinedInput
                      fullWidth
                      error={Boolean(touched.email && errors.email)}
                      id="email-login"
                      type="email"
                      value={values.email}
                      name="email"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="demo@email.com"
                      inputProps={{}}
                    />
                    {touched.email && errors.email && (
                      <FormHelperText error id="helper-text-email-register">
                        {errors.email}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="phone-register">Phone</InputLabel>
                    <OutlinedInput
                      fullWidth
                      error={Boolean(touched.phone && errors.phone)}
                      id="phone-register"
                      value={values.phone}
                      name="phone"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="+441434338212"
                      inputProps={{}}
                    />
                    {touched.phone && errors.phone && (
                      <FormHelperText error id="helper-text-phone-register">
                        {errors.phone}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="nhs-register">NHS Number</InputLabel>
                    <OutlinedInput
                      fullWidth
                      error={Boolean(touched.nhs && errors.nhs)}
                      id="nhs-register"
                      value={values.nhs}
                      name="nhs"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="NHS Number"
                      inputProps={{}}
                    />
                    {touched.nhs && errors.nhs && (
                      <FormHelperText error id="helper-text-phone-register">
                        {errors.nhs}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="birthday-register">DOB</InputLabel>
                    <DatePickerField name="birthday" />
                    {touched.birthday && errors.birthday && (
                      <FormHelperText error id="helper-text-clinic-register">
                        {errors.birthday}
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
                      color="primaryb"
                      startIcon={<SaveIcon />}
                    >
                      Save Patient
                    </Button>
                  </AnimateButton>
                </Grid>
                <Grid item xs={12}>
                  <AnimateButton>
                    <Button
                      type="button"
                      onClick={() => dispatch(setEditMode(false))}
                      variant="outlined"
                      color="primaryb"
                      fullWidth
                      size="large"
                      startIcon={<KeyboardReturnIcon />}
                    >
                      Return to Patient List
                    </Button>
                  </AnimateButton>
                </Grid>
              </Grid>
            </form>
          )}
        </Formik>
      </Box>
    </>
  );
};

export default Form;
