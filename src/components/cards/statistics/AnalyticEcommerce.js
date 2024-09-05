import PropTypes from 'prop-types';

// material-ui
import { Box, Stack, Typography } from '@mui/material';

// project import
import MainCard from 'components/MainCard';

import Chart, { useChart } from 'components/chart';

// ==============================|| STATISTICS - ECOMMERCE CARD  ||============================== //
const AnalyticEcommerce = ({ title, count, icon, chart }) => {
  const series = chart ? chart : [];
  const colors = ['#2555c0', '#319bfb', '#b3daff', '#d1e9ff'];
  const chartOptions = useChart({
    // Yaxis
    yaxis: {
      min: chart ? chart[0] : 0
    },
    colors: [colors[1]],
    fill: {
      type: 'gradient',
      gradient: {
        colorStops: [
          { offset: 0, color: colors[2], opacity: 1 },
          { offset: 100, color: colors[3], opacity: 1 }
        ]
      }
    },
    chart: {
      animations: {
        enabled: true
      },
      sparkline: {
        enabled: true
      }
    },
    tooltip: {
      x: {
        show: false
      },
      y: {
        formatter: (value) => value,
        title: {
          formatter: () => ''
        }
      },
      marker: {
        show: false
      }
    }
  });
  // console.log(Chart, chartOptions, series);
  return (
    <MainCard contentSX={{ p: 2.25, display: 'flex', gap: 2, justifyContent: 'space-between' }}>
      <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6" color="textPrimary">
            {title}
          </Typography>
          <Box sx={{ width: '40px' }}>{icon}</Box>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
          <Stack spacing={0.5}>
            <Typography variant="h3" color="inherit" component="span">
              {count}
            </Typography>
            {/* <Typography color="textSecondary" component="span">
              Compared to last month
            </Typography> */}
          </Stack>
          <Chart dir="ltr" type="area" series={[{ data: series }]} options={chartOptions} width={160} height={80} />
        </Box>
      </Box>
    </MainCard>
  );
};

AnalyticEcommerce.propTypes = {
  color: PropTypes.string,
  title: PropTypes.string,
  count: PropTypes.string,
  percentage: PropTypes.number,
  isLoss: PropTypes.bool,
  extra: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  icon: PropTypes.element,
  chart: PropTypes.array
};

AnalyticEcommerce.defaultProps = {
  color: 'primary'
};

export default AnalyticEcommerce;
