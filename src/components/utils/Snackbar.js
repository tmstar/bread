import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import SnackbarMui from '@mui/material/Snackbar';

export const Snackbar = (props) => {
  return (
    <SnackbarMui
      autoHideDuration={3000}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      sx={{ bottom: { xs: 90, sm: 30 } }}
      {...props}
    />
  );
};

export const SnackbarButton = (props) => {
  return (
    <Button size="small" {...props}>
      <Box sx={{ fontWeight: 'bold', color: '#A769CB' }}>{props.label}</Box>
    </Button>
  );
};
