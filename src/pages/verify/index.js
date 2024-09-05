import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { Box, Button, Container, Typography, InputBase, Grid, Stack } from '@mui/material';

import { confirmAlert } from 'react-confirm-alert';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// import KeyIcon from '@mui/icons-material/Key';
// import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { getDetail, reset, dispense } from 'store/reducers/home';
import './verify.css';
import 'react-datepicker/dist/react-datepicker.css';
// import imgMain from 'assets/images/main/main-bg.jpg';
import { formatDate, formatDate2Object } from 'utils/common';
import { styled } from '@mui/material/styles';
import { LoadingOutlined } from '@ant-design/icons';
import dispenseImage from 'assets/images/main/dispense.png';
import UnlockIcon from 'assets/images/main/icon-unlock.png';
import CalendarIcon from 'assets/images/main/icon-calendar.png';

const DatePicker = styled((props) => <ReactDatePicker {...props} />)(() => ({
  border: 0,
  outline: 0,
  marginLeft: '8px',
  fontSize: '14px'
}));
const Verify = () => {
  const dispatch = useDispatch();
  const { paramsId, paramsDob } = useParams();
  const { prescription, dispensing } = useSelector((state) => state.home);

  const [search, setSearch] = useState(paramsId ?? '');
  const [dob, setDob] = useState(paramsDob ? formatDate2Object(paramsDob) : '');
  const handleVerify = () => {
    if (search && dob) dispatch(getDetail({ id: search, dob: formatDate(dob) }));
  };
  const handleDispense = () => {
    confirmAlert({
      title: 'Confirm to Dispense',
      message:
        'Refusal of a valid prescription may result in regulatory action. It is a criminal offense to misuse this software application. Do not enter token code if you do not have permission to access the information from the patient or their chosen representative.',
      buttons: [
        {
          label: 'Yes',
          onClick: () =>
            dispatch(
              dispense({
                id: prescription.rid,
                dob: prescription.patient.birthday
              })
            )
        },
        {
          label: 'No'
        }
      ]
    });
  };
  // const handleKeyDown = (e) => {
  //   if (e.keyCode === 13) {
  //     handleVerify();
  //   }
  // };

  // const handleDobChange = (date) => {
  //   setDob(date);
  // };

  useEffect(() => {
    if (paramsId && paramsDob) {
      dispatch(getDetail({ id: paramsId, dob: paramsDob }));
    } else {
      if (prescription) {
        dispatch(reset());
      }
    }
  }, [paramsId, paramsDob]);

  return (
    <>
      <section className="verify">
        <Box component="section" sx={{ mt: 5 }} id="dispense-section">
        <Container maxWidth="lg">
          <Grid container spacing={10}>
            <Grid item sm={7} xs={12}>
              <img src={dispenseImage} alt="choice" className="full-width" />
            </Grid>
            <Grid item sm={5} xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
              <Stack spacing={4} sx={{ maxWidth: '500px' }} >
                <Typography color="#272727" fontSize="35px" lineHeight={1}>
                  Dispense
                  <br />
                  Prescription
                </Typography>
                <Typography color="textSecondary" fontSize="15px">
                  RX-Link empower pharmacists with a platform for precise prescription dispensing, prioritizing accuracy and patient safety.
                  Our comprehensive process includes meticulous medication preparation and thorough counseling on usage and potential side
                  effects. Trust our platform for a seamless and secure prescription fulfillment experience.
                </Typography>
                <Box
                  id="dispense-form"
                  sx={{
                    margin: '0 auto',
                    maxWidth: '500px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                    mt: 4
                  }}
                >
                  <label htmlFor="rid">Prescription ID: </label>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      py: 1.5,
                      px: 3,
                      mb: 1,
                      borderRadius: 3,
                      gap: 1,
                      backgroundColor: '#EDF2FA'
                    }}
                  >
                    <img src={UnlockIcon} alt="" />
                    <InputBase
                      id="rid"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      sx={{ ml: 1, flex: 1 }}
                      placeholder="RX236H"
                      inputProps={{ 'aria-label': 'RX236H' }}
                    />
                  </Box>
                  <label htmlFor="dob">Patient DOB: </label>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      py: 1.5,
                      px: 3,
                      mb: 1,
                      borderRadius: 3,
                      gap: 1,
                      backgroundColor: '#EDF2FA'
                    }}
                  >
                    <img src={CalendarIcon} alt="" />
                    <DatePicker
                      selected={dob}
                      onChange={(date) => setDob(date)}
                      scrollableYearDropdown
                      showYearDropdown
                      yearDropdownItemNumber={100}
                      placeholderText="09-02-2024"
                      dateFormat="dd-MM-yyyy"
                    />
                  </Box>
                  <Button
                    variant="contained"
                    size="large"
                    color="primary"
                    onClick={handleVerify}
                    sx={{ height: '53px', borderRadius: 3, boxShadow: '10px 10px 10px #afd3ff' }}
                  >
                    Find Your prescription
                  </Button>
                  {prescription && (
                    <Button
                      disabled={prescription.dispense}
                      variant="outlined"
                      size="large"
                      color="primary"
                      onClick={handleDispense}
                      startIcon={dispensing ? <LoadingOutlined /> : <></>}
                    >
                      {prescription.dispense ? 'Dispensed' : 'Dispense'}
                    </Button>
                  )}
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>
      </section>
      {prescription && (
        <Container maxWidth="md" sx={{ p: 4, mt: 4 }}>
          <object data={`/${prescription.pdf}`} type="application/pdf" width="100%" height="100%" id="e-prescription">
            E-prescription
          </object>
        </Container>
      )}
    </>
  );
};
export default Verify;
