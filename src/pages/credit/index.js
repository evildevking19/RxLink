import { Grid } from '@mui/material';
import PageTitle from 'components/PageTitle';
import Credit from 'components/Credit';

const CreditPage = () => {
  return (
    <>
      <PageTitle title="Credit Management" />
      <Grid container rowSpacing={4.5} columnSpacing={2.75}>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <Credit />
        </Grid>
      </Grid>
    </>
  );
};
export default CreditPage;
