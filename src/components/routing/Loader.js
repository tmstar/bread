import Grid from '@mui/material/Grid';
import React from 'react';
import Lottie from 'react-lottie';
import * as animationData from './79794-world-locations.json';

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: animationData,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice',
  },
};

function Loader() {
  return (
    <Grid container spacing={0} direction="column" alignItems="center" justifyContent="center" style={{ minHeight: '100vh' }}>
      <Grid item pb={10}>
        <Lottie options={defaultOptions} />
      </Grid>
    </Grid>
  );
}
export default Loader;
