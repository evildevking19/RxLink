// ==============================|| OVERRIDES - BUTTON ||============================== //

export default function Button(theme) {
  const disabledStyle = {
    '&.Mui-disabled': {
      backgroundColor: theme.palette.grey[200]
    }
  };

  return {
    MuiButton: {
      defaultProps: {
        disableElevation: true
      },
      styleOverrides: {
        root: {
          fontWeight: 400
        },
        contained: {
          ...disabledStyle,
          paddingLeft: '36px!important',
          paddingRight: '36px!important'
        },
        outlined: {
          ...disabledStyle
        }
      },
      variants: [
        {
          props: { rounded: 'full' },
          style: {
            borderRadius: '999px'
          }
        }
      ]
    }
  };
}
