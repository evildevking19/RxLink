import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { confirmAlert } from 'react-confirm-alert';

import { Box, Button, InputBase, Stack, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';

import MainCard from 'components/MainCard';

import { getCreditInformation, buyCredit } from 'store/reducers/credit';

import CreditCardIcon from 'assets/images/dashboard/credit.png';
// import CreditCardIcon from '@mui/icons-material/CreditCard';

const unitAmount = 1;
const CreditModal = ({ onClose, onBuyCredit }) => {
  const [amount, setAmount] = useState(1);
  return (
    <Stack
      sx={{
        border: '1px solid #eee',
        boxShadow: '0 0 20px #eee',
        padding: '20px 30px',
        borderRadius: '5px',
        gap: 2,
        backgroundColor: 'white'
      }}
    >
      <Typography variant="h6">Are you sure to buy credit?</Typography>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: 1,
          alignItems: 'center',
          backgroundColor: 'white'
        }}
      >
        <InputBase
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          type="number"
          inputProps={{ min: 1, max: 100 }}
          placeholder="Amount"
          sx={{ border: '1px solid #bbb', padding: '0px 10px', borderRadius: '9px' }}
        />
        <Stack direction="row" spacing={1}>
          <Button
            size="small"
            variant="contained"
            color="primary"
            onClick={() => {
              onBuyCredit(amount * unitAmount);
              onClose();
            }}
          >
            Buy Credit
          </Button>
          <Button size="small" variant="outlined" color="primary" onClick={onClose}>
            Cancel
          </Button>
        </Stack>
      </Box>
    </Stack>
  );
};

const Credit = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { status, credit, price, currency, link } = useSelector((state) => state.credit);

  const onBuyCredit = (amount) => {
    dispatch(buyCredit(amount));
  };
  const handleBuyCredit = () => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return <CreditModal onClose={onClose} onBuyCredit={onBuyCredit} />;
      }
    });
  };

  useEffect(() => {
    dispatch(getCreditInformation());
  }, []);

  useEffect(() => {
    if (link && status === 'success') {
      window.open(link, "_blank");
      setLoading(false);
    }
  }, [link, status]);

  useEffect(() => {
    if (status == 'pending-buy') {
      setLoading(true);
    }
  }, [status]);
  return (
    <MainCard contentSX={{ p: 2.25, display: 'flex', gap: 2, justifyContent: 'space-between' }}>
      <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6" color="textPrimary">
            {`Credits (${price * unitAmount} ${currency.toUpperCase()} per ${unitAmount} credits)`}
          </Typography>
          <Box sx={{ width: '40px' }}>
            <img src={CreditCardIcon} alt="" />
          </Box>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
          <Stack spacing={0.5}>
            <Typography variant="h3" color="inherit" component="span">
              {credit}
            </Typography>
          </Stack>

          <Box sx={{ display: 'flex', gap: 1, width: '160px', height: '80px', justifyContent: 'end', alignItems: 'end' }}>
            <LoadingButton loading={loading} variant="contained" color="primaryb" onClick={handleBuyCredit}>
              Buy Credit
            </LoadingButton>
          </Box>
        </Box>
      </Box>
    </MainCard>
  );
};
export default Credit;
