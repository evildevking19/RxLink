import { Typography, Box } from '@mui/material';

const PageTitle = ({ title }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        gap: 2,
        mb: 1,
        alignItems: 'center'
      }}
    >
      <Typography component="span" variant="h4" color="textPrimary">
        {title}
      </Typography>
      {/* {subTitle && (
        <Box
          sx={{
            borderLeft: '1px solid #aaa',
            height: '20px'
          }}
        ></Box>
      )}
      <Typography component="span" variant="h4" color="textSecondary">
        {subTitle}
      </Typography> */}
    </Box>
  );
};
export default PageTitle;
