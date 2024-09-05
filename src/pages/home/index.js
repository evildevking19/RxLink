import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Stack, Button, Container, Typography, InputBase, useMediaQuery } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';

import dashboardImage from 'assets/images/main/dashboard.png';
import whyImage1 from 'assets/images/main/why-image1.png';
import whyImage2 from 'assets/images/main/why-image2.png';
import blockchainImage from 'assets/images/main/blockchain.png';
import whatsappImage from 'assets/images/main/whatsapp.png';
import immutableImage from 'assets/images/main/immutable.png';
import choiceImage from 'assets/images/main/choice.png';
import secureImage from 'assets/images/main/secure.png';
import dispenseImage from 'assets/images/main/dispense.png';
import CalendarIcon from 'assets/images/main/icon-calendar.png';
import UnlockIcon from 'assets/images/main/icon-unlock.png';
import SmsIcon from 'assets/images/main/icon-sms.png';
import PhoneIcon from 'assets/images/main/icon-phone.png';
import { LoadingOutlined } from '@ant-design/icons';
// import IpSumLogo1 from 'assets/images/main/iplogo1.png';
// import IpSumLogo2 from 'assets/images/main/iplogo2.png';
// import IpSumLogo3 from 'assets/images/main/iplogo3.png';
// import IpSumLogo4 from 'assets/images/main/iplogo4.png';
// import IpSumLogo5 from 'assets/images/main/iplogo5.png';
// import IpSumLogo6 from 'assets/images/main/iplogo6.png';
// import IpSumLogo7 from 'assets/images/main/iplogo7.png';


import 'font-awesome/css/font-awesome.min.css';
import 'react-datepicker/dist/react-datepicker.css';
import { styled } from '@mui/material/styles';

import { FaqContent, faqItems } from 'pages/faq';
import { formatDate } from 'utils/common';

import { getDetail, dispense } from 'store/reducers/home';
import { confirmAlert } from 'react-confirm-alert';

import ReactDatePicker from 'react-datepicker';
const DatePicker = styled((props) => <ReactDatePicker {...props} />)(() => ({
  border: '0',
  outline: 0,
  marginLeft: '8px',
  fontSize: '14px',
  backgroundColor: 'transparent'
}));

const Home = () => {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  const dispatch = useDispatch();
  const { prescription, dispensing } = useSelector(state => state.home);
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [dob, setDob] = useState('');

  const handleFindPrescription = () => {
    if (search && dob) handleVerify()
  };
  const handleVerify = () => {
    if (search && dob) dispatch(getDetail({ id: search, dob: formatDate(dob) }));
  };

  const goToDispenseSection = () => {
    const element = document.getElementById('dispense-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
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

  const openOutlookEmail = () => {
    var recipient = 'support@rx-link.co.uk'; // Enter the recipient email address
    var mailtoLink = 'mailto:' + encodeURIComponent(recipient);
    window.location.href = mailtoLink;
  };

  const openPhoneLink = () => {
    var phoneNumber = '+44 (0) 330 113 7894'; // Replace with your phone number
    var phoneLink = 'tel:' + encodeURIComponent(phoneNumber);

    window.location.href = phoneLink;
  };

  return (
    <>
      <section>
        <Container maxWidth={false} align="center">
          <Typography variant={isMobile ? 'h2' : 'h1'} component="h1" sx={{ mt: 8 }} align="center">
            BlockChain Backed
            <br /> E-Prescriptions
          </Typography>
          <Typography fontSize="20px" sx={{ mt: 2 }} align="center">
            Welcome to Rx-Link! Our advanced blockchain technology, and whatsapp integration <br />
            completely revolutionises e-prescriptions.
            <strong> Sign-up today for free to get started.</strong>
          </Typography>
          <Button
            rounded="full"
            onClick={() => navigate('/auth/login')}
            variant="contained"
            color="primary"
            sx={{
              mt: 4,
              fontSize: '20px',
              boxShadow: '10px 10px 10px #afd3ff'
            }}
          >
            Create A Free Account
          </Button>
          <Button
            rounded="full"
            className="btn-goto-dispense"
            onClick={() => goToDispenseSection()}
            variant="contained"
            color="primary"
            sx={{
              mt: 4,
              fontSize: '20px',
              boxShadow: '10px 10px 10px #afd3ff'
            }}
            startIcon={<ArrowRightAltIcon style={{ fontSize: '20px' }} />}
          >
            Dispense Prescription
          </Button>
        </Container>
      </section>
      <section>
        <Container maxWidth={false} sx={{ padding: '0!important' }}>
          <Grid container align="center">
            <Grid item xs={12}>
              <img src={dashboardImage} alt="Screenshots" className="full-width" />
            </Grid>
          </Grid>
        </Container>
      </section>

      {/* <Box component="section" sx={{ mt: 10 }}>
        <Container maxWidth="md">
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 8, justifyContent: 'space-between', flexDirection: isMobile ? 'column' : 'row' }}>
              <div className="ipsum-logo">
                <img src={IpSumLogo1} alt="" />
              </div>
              <div className="ipsum-logo">
                <img src={IpSumLogo2} alt="" />
              </div>
              <div className="ipsum-logo">
                <img src={IpSumLogo3} alt="" />
              </div>
              <div className="ipsum-logo">
                <img src={IpSumLogo4} alt="" />
              </div>
              <div className="ipsum-logo">
                <img src={IpSumLogo5} alt="" />
              </div>
              <div className="ipsum-logo">
                <img src={IpSumLogo6} alt="" />
              </div>
              <div className="ipsum-logo">
                <img src={IpSumLogo7} alt="" />
              </div>
            </Box>
          </Grid>
        </Container>
      </Box> */}

      <Box component="section" sx={{ mt: 8 }}>
        <Container maxWidth="lg">
          <Grid container spacing={8}>
            <Grid item sm={7} xs={12}>
              <Stack
                spacing={2}
                sx={{
                  backgroundImage: `url(${whyImage1}), linear-gradient(to bottom, #E0E7EE, rgba(153, 153, 153, 0.5))`,
                  backgroundSize: 'cover',
                  padding: '280px 60px 60px 60px',
                  borderRadius: '65px'
                }}
              >
                <Typography variant="h2">Why Use Rx-Link?</Typography>
                <Typography component="p" color="textSecondary">
                  Rx-Link is your prescription for a modern and secure healthcare journey. Say goodbye to paper prescriptions and hello to
                  an eco-friendly and efficient experience, all powered by blockchain technology. Our platform lets you connect effortlessly
                  with your patients through WhatsApp, Email, and SMS, ensuring speedy communication and enhancing patient engagement.
                </Typography>
                <Typography component="p" color="textSecondary">
                  {`We take security seriously with our fraud-resistant blockchain technology, guaranteeing the authenticity of prescriptions.
                Rx-Link simplifies your workflow, saving you time and energy. Plus, our electronic prescriptions are accepted at pharmacies
                nationwide, offering maximum convenience. And the best part? It's cost-effective, so you can focus on delivering quality
                care without breaking the bank. Join us on the path to a greener, more efficient, and secure healthcare future with Rx-Link!`}
                </Typography>
                <div>
                  <Button
                    rounded="full"
                    onClick={() => navigate('/auth/login')}
                    variant="contained"
                    color="primary"
                    sx={{ boxShadow: '10px 10px 10px #afd3ff' }}
                  >
                    Get Started
                  </Button>
                </div>
              </Stack>
            </Grid>
            <Grid item sm={5} xs={12} sx={{ display: 'flex', alignItems: 'end' }}>
              <Stack spacing={4} sx={{ padding: 0 }}>
                <img src={whyImage2} alt="Screenshots" className="full-width" />
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Box component="section" sx={{ mt: 12 }}>
        <Container maxWidth="lg">
          <Grid container spacing={10}>
            <Grid item sm={6} xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Stack spacing={4} sx={{ display: 'flex', justifyContent: 'center' }}>
                <Typography variant={isMobile ? 'titleM' : 'title'}>
                  Blockchain-
                  <br />
                  Backed Security
                </Typography>
                <Typography color="textSecondary" variant="description">
                  In an era where data security is paramount, RX-Link stands out by integrating blockchain technology into our ePrescription
                  service. This not only guarantees the authenticity of each prescription but also ensures that once a prescription has been
                  dispensed, it cannot be reused or tampered with. Experience peace of mind knowing that your prescriptions are protected by
                  the most secure technology available.
                </Typography>
              </Stack>
            </Grid>
            <Grid item sm={6} xs={12}>
              <Box sx={{ px: 12, py: 16, backgroundColor: '#EBEFF5', borderRadius: '30px', display: 'flex', justifyContent: 'center' }}>
                <img src={blockchainImage} alt="blockchain" />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Box component="section" sx={{ mt: 12 }}>
        <Container maxWidth="lg">
          <Grid container spacing={10}>
            <Grid item xs={12} sm={6}>
              <img src={whatsappImage} alt="whatsapp" className="full-width" />
            </Grid>
            <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: 'center', aligItems: 'center' }}>
              <Stack spacing={4} sx={{ px: isMobile ? 0 : 8, display: 'flex', justifyContent: 'center', aligItems: 'center' }}>
                <Typography variant={isMobile ? 'titleM' : 'title'}>Seamless Integration with WhatsApp</Typography>
                <Typography variant="description">
                  Understanding the need for ease and accessibility, RX-Link uniquely offers prescription delivery through WhatsApp. This
                  feature allows for instant, direct, and user-friendly communication with patients, making the prescription process as
                  convenient as possible. Now, patients can receive their prescriptions right at their fingertips, ready to be presented at
                  their chosen pharmacy.
                </Typography>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Box component="section" sx={{ mt: 12 }}>
        <Container maxWidth="lg">
          <Grid container spacing={10}>
            <Grid item sm={6} xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
              <Stack spacing={4}>
                <Typography variant={isMobile ? 'titleM' : 'title'}>
                  Immutable Records
                  <br /> For Unmatched Reliability
                </Typography>
                <Typography variant="description">
                  {`Our platform's immutability is at the core of our service. Once a prescription is dispensed, its record is permanent and
                  unalterable, thanks to our robust blockchain technology. This ensures a single-use, fraud-proof system that pharmacists
                  and patients can trust, eliminating the risk of prescription duplication or forgery.`}
                </Typography>
              </Stack>
            </Grid>
            <Grid item sm={6} xs={12}>
              <img src={immutableImage} alt="immutable" className="full-width" />
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Box component="section" sx={{ mt: 12 }}>
        <Container maxWidth="lg">
          <Grid container spacing={10}>
            <Grid item sm={6} xs={12}>
              <img src={choiceImage} alt="choice" className="full-width" />
            </Grid>
            <Grid item sm={6} xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
              <Stack spacing={4}>
                <Typography variant={isMobile ? 'titleM' : 'title'}>
                  Your Prescription,
                  <br />
                  Your Choice
                </Typography>
                <Typography variant="description">
                  {`With RX-Link, patients have the freedom to choose where they fulfill their prescriptions. Whether at a local independent pharmacy or any UK and EU pharmacy, our service ensures that your prescription is accepted everywhere. Our system is designed for universal compatibility, offering you flexibility and peace of mind.`}
                </Typography>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Box component="section" sx={{ mt: 12 }}>
        <Container maxWidth="lg">
          <Grid container spacing={6}>
            <Grid item sm={6} xs={12} sx={{ display: 'flex', alignItems: 'center', pr: 6 }}>
              <Stack spacing={4}>
                <Typography variant={isMobile ? 'titleM' : 'title'}>
                  Secure Prescription
                  <br />
                  via WhatsApp
                </Typography>
                <Typography variant="description">
                  {`Introducing the new WhatsApp functionality for RX-Link, our cutting-edge online e-prescription security site! Now, staying connected with your healthcare providers and securely managing your electronic prescriptions is easier than ever. With the RX-Link WhatsApp feature, you can receive instant notifications about prescription updates, securely chat with your healthcare team, and even receive important alerts about medication reminders. Our commitment to user-friendly innovations ensures a seamless and secure experience for all your e-prescription needs. Stay informed, stay connected, and enjoy the convenience of managing your health at your fingertips with RX-Link on WhatsApp!`}
                </Typography>
              </Stack>
            </Grid>
            <Grid item sm={6} xs={12}>
              <img src={secureImage} alt="choice" className="full-width" />
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Box component="section" sx={{ mt: 12 }} id="dispense-section">
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
                    onClick={handleFindPrescription}
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
        {prescription && !prescription.dispense && (
          <Container maxWidth="lg" sx={{ p: 4, mt: 4 }}>
            <object data={`${window.location.protocol}//${window.location.hostname}:8080/${prescription.pdf}`} type="application/pdf" width="100%" height="100%" id="e-prescription">
              E-prescription
            </object>
          </Container>
        )}
      </Box>

      <Box component="section" sx={{ mt: 12 }} id="faq-section">
        <Container maxWidth="lg">
          <Grid container>
            <Grid item xs={12}>
              <Typography variant={isMobile ? 'titleM' : 'title'}>
                Frequently Asked
                <br />
                Questions.
              </Typography>
              <hr style={{ border: '1px dashed #ddd', margin: '40px 0' }} />
            </Grid>
            <Grid item sm={4} xs={12}>
              <Typography fontSize="20px" color="#888">
                You have questions
                <br />
                We have answers
              </Typography>
            </Grid>
            <Grid item sm={8} xs={12}>
              <FaqContent items={faqItems} />
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Box component="section" sx={{ mt: 12 }} id="contactinfo-section">
        <Container maxWidth="lg">
          <Grid container spacing={2}>
            <Grid item sm={8} xs={12}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: isMobile ? 'column' : 'row',
                  gap: 2,
                  justifyContent: 'space-between',
                  alignItems: isMobile ? 'start' : 'center',
                  backgroundColor: '#EDF2FA',
                  borderRadius: '20px',
                  px: 6,
                  py: 6
                }}
              >
                <Box sx={{ maxWidth: '500px' }}>
                  <Typography fontSize="35px" color="#333" sx={{ lineHeight: 1 }}>
                    Get Started with RX-Link
                  </Typography>
                  <Typography fontSize="12px" color="#999" sx={{ mt: 2 }}>
                    {`Discover a new level of convenience and security in managing prescriptions. Whether you're a prescriber looking to
                streamline your practice or a pharmacy aiming to enhance patient trust and satisfaction, RX-Link is your solution. Try us
                now and see the difference that secure, immutable, and convenient ePrescription delivery can make.`}
                  </Typography>
                </Box>
                <div>
                  <Button
                    rounded="full"
                    onClick={() => navigate('/auth/login')}
                    variant="contained"
                    color="primary"
                    size="large"
                    sx={{ boxShadow: '10px 10px 10px #afd3ff', minWidth: '150px' }}
                  >
                    Get Started
                  </Button>
                </div>
              </Box>
            </Grid>
            <Grid item sm={4} xs={12}>
              <Stack spacing={2}>
                <Box
                  onClick={() => openOutlookEmail()}
                  sx={{
                    backgroundColor: '#E7EBF1',
                    px: 3.5,
                    py: 3,
                    borderRadius: '15px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <Stack spacing={1}>
                    <div>
                      <img src={SmsIcon} alt="" />
                    </div>
                    <span>support@rx-link.co.uk</span>
                  </Stack>
                  <ArrowRightAltIcon style={{ fontSize: '30px' }} />
                </Box>
                <Box
                  onClick={() => openPhoneLink()}
                  sx={{
                    backgroundColor: '#E7EBF1',
                    px: 3.5,
                    py: 3,
                    borderRadius: '15px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <Stack spacing={1}>
                    <div>
                      <img src={PhoneIcon} alt="" />
                    </div>

                    <span>+44 (0) 330 113 7894</span>
                  </Stack>
                  <ArrowRightAltIcon style={{ fontSize: '30px' }} />
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};
export default Home;
