import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// material-ui
import { Grid, Box, Typography } from '@mui/material';

import GroupIcon from 'assets/images/dashboard/patients.png';
import SendIcon from 'assets/images/dashboard/pcount.png';
import DoneAllIcon from 'assets/images/dashboard/vcount.png';

import Prescription from 'pages/prescription';
import Patient from 'pages/patient';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';
import Credit from 'components/Credit';

import { getStatistic } from 'store/reducers/dashboard';
// ==============================|| DASHBOARD - DEFAULT ||============================== //

const DashboardDefault = () => {
  const dispatch = useDispatch();
  const { patients, prescriptions, verifys, chart } = useSelector((state) => state.dashboard);

  const [page, setPage] = useState(true);
  useEffect(() => {
    dispatch(getStatistic());
  }, []);
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Grid container rowSpacing={4.5} columnSpacing={2.75}>
        {/* row 1 */}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <AnalyticEcommerce title="Patients" count={patients + ''} icon={<img src={GroupIcon} alt="" />} chart={chart?.patient} />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <AnalyticEcommerce
            title="Total prescription count"
            count={prescriptions + ''}
            icon={<img src={SendIcon} alt="" />}
            chart={chart?.prescription}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <AnalyticEcommerce
            title="Total verify count"
            count={verifys + ''}
            icon={<img src={DoneAllIcon} alt="" />}
            chart={chart?.dispense}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <Credit />
        </Grid>
      </Grid>
      <div>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: 2,
            mb: 1,
            alignItems: 'center',
            zIndex: 1000
          }}
        >
          <Typography
            sx={{ cursor: 'pointer' }}
            component="span"
            variant="h4"
            color={page ? 'textPrimary' : 'textSecondary'}
            onClick={() => setPage(true)}
          >
            Prescription Management
          </Typography>
          <Box
            sx={{
              borderLeft: '1px solid #aaa',
              height: '20px'
            }}
          ></Box>
          <Typography
            sx={{ cursor: 'pointer' }}
            component="span"
            variant="h4"
            color={page ? 'textSecondary' : 'textPrimary'}
            onClick={() => setPage(false)}
          >
            Patient Management
          </Typography>
        </Box>
        <Box sx={{ zIndex: 100 }}>{page ? <Prescription noTitle={true} /> : <Patient noTitle={true} />}</Box>
      </div>
    </Box>
  );
};

export default DashboardDefault;
