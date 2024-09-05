import { useState } from 'react';
import { Grid, Box, Container, Typography } from '@mui/material';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
// import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AddIcon from '@mui/icons-material/Add';
// import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import RemoveIcon from '@mui/icons-material/Remove';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import './faq.css';
export let faqItems = [
  {
    title: 'Do I need to register to dispense an Rx-Link token code provided by a patient?',
    content: "No registration is needed. Simply click the 'Dispense Rx-Link' button on this page to proceed."
  },
  {
    title: 'Do I have to pay to dispense a prescription?',
    content:
      'No, using Rx-Link is free for pharmacies. You will charge the patient a dispensing fee, which is your standard rate for dispensing a private prescription, at the time of service. Rx-Link does not charge pharmacies to use our service.'
  },
  {
    title: 'Are Rx-Link token codes valid throughout the UK, including Scotland, Wales, and Northern Ireland?',
    content:
      'Yes, electronically signed private prescriptions are accepted across the entire UK, including Scotland, Wales, and Northern Ireland. This contrasts with NHS electronic prescriptions, which are restricted to being issued and dispensed within their specific devolved jurisdictions.'
  },
  {
    title: 'How can I verify the authenticity of prescriptions?',
    content:
      'Our electronic prescriptions feature a BlockChain backed Electronic Signature, meeting the regulatory standards outlined in Regulation 219(5) of the Human Medicines Regulations 2012. You should conduct standard verification checks before dispensing any medication. Additionally, all prescribers are certified in the UK, EU, or EEA at the time they join Rx-Link.'
  },
  {
    title: 'Is there a fee for dispensing Rx-Link prescriptions?',
    content:
      "Yes, fees should be collected for dispensing Rx-Link prescriptions, similar to how you would handle paper private prescriptions or according to your organization's policy."
  },
  {
    title: "What if the dispense button isn't functioning?",
    content:
      "Should the 'Mark as Dispensed' button be unresponsive, trying a different web browser is recommended. Rx-Link's pharmacy dispensing page does not support Internet Explorer; Google Chrome is advised for an optimal experience."
  },
  {
    title: 'I accidentally marked a prescription as dispensed without supplying the medication.',
    content:
      'If a prescription was mistakenly marked as dispensed without providing the medication to the patient, preventing them from obtaining it elsewhere, contact our support team immediately through the Help desk form or by calling our support number, and we will assist you.'
  }
];
faqItems = faqItems.map((item, index) => {
  return { ...item, id: index };
});

const Accordion = styled((props) => <MuiAccordion disableGutters elevation={0} square {...props} />)(() => ({
  backgroundColor: 'transparent',
  marginBottom: '20px',
  borderBottom: '1px dashed rgb(221, 221, 221)!important',
  padding: '0',
  color: 'black',
  '&:not(:last-child)': {
    borderBottom: 0
  },
  '& .MuiButtonBase-root': {
    padding: '0'
  },
  '&::before': {
    height: 0
  },
  '& .MuiAccordionDetails-root': {
    padding: '0 0 25px 0'
  },
  '& .MuiAccordionSummary-content': {
    margin: '0 0 20px 0',
    paddingRight: '100px'
  }
}));

const AccordionSummary = styled((props) => <MuiAccordionSummary expandIcon={<RemoveIcon />} {...props} />)(() => ({
  flexDirection: 'row-reverse',
  display: '-webkit-box',

  '& p': {
    color: 'rgb(52, 53, 59, 0.9)',
    letterSpacing: '-1.25px',
    fontSize: '25px',
    fontWeight: '400'
  }
}));

const AccordionDetails = styled(MuiAccordionDetails)(() => ({
  '& p': {
    fontSize: '18px',
    color: 'rgb(52, 53, 59, 0.6)',
    letterSpacing: '-0.9px'
  }
}));

export const FaqContent = ({ items }) => {
  const [toggles, setToggles] = useState({});
  const toggleAccordion = (accordionId) => (_, newExpanded) => {
    setToggles({ ...toggles, [accordionId]: newExpanded });
  };
  return (
    <div>
      {items.map((item) => (
        <Accordion key={item.id} onChange={toggleAccordion(item.id)}>
          <AccordionSummary
            expandIcon={toggles[item.id] ? <RemoveIcon sx={{ color: '#34353B' }} /> : <AddIcon sx={{ color: '#34353B' }} />}
          >
            <Typography>{item.title}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>{item.content}</Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
};
FaqContent.propTypes = {
  items: PropTypes.array.isRequired
};
const Faq = () => {
  return (
    <>
      <Box component="section" sx={{ padding: '20px 0', marginTop: '20px' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6}>
              <FaqContent items={faqItems.filter((_, index) => index < faqItems.length / 2)} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FaqContent items={faqItems.filter((_, index) => index >= faqItems.length / 2)} />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default Faq;
