import { useAuth0 } from '@auth0/auth0-react';
import AddIcon from '@mui/icons-material/Add';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Fade from '@mui/material/Fade';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import React from 'react';
import { Navigate } from 'react-router-dom';
import Loader from '../components/routing/Loader';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const Copyright = () => {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://breadlist.ga/" underline="hover">
        {'Bread Labs'}
      </Link>
      {' 2022.'}
    </Typography>
  );
};

export default function Login() {
  const classes = useStyles();
  const { isLoading, isAuthenticated, loginWithRedirect } = useAuth0();

  if (isLoading) return <Loader />;
  if (isAuthenticated) return <Navigate to="/" replace />;

  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ background: 'linear-gradient(to right, #614385, #516395)', width: '100vw', height: '100vh' }}
    >
      <Grid item pb={10}>
        <Container component="main" maxWidth="xs">
          <Fade timeout={3000} in>
            <div className={classes.paper}>
              <Avatar className={classes.avatar}>
                <ShoppingCartIcon />
              </Avatar>
              <Typography variant="h5" align="center" sx={{ py: 2 }}>
                {'Bread. Your lists always at hand.'}
              </Typography>
              <Typography variant="body">{'✓リスト専門のアプリでメモを共有しよう'}</Typography>
              <Typography variant="body">{'✓買い物中でも使いやすいシンプルなデザイン'}</Typography>
              <Typography variant="body" color="success.light">
                {'✓無料で広告なしで使えるアプリ'}
              </Typography>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                className={classes.submit}
                startIcon={<AddIcon />}
                sx={{ color: '#ffffff', bgcolor: '#ffffff33', '&:hover': { bgcolor: '#ffffff4d' } }}
                onClick={() => {
                  loginWithRedirect({
                    screen_hint: 'signup',
                  });
                }}
              >
                {'New List'}
              </Button>
              <Box mt={1}>
                <Copyright />
              </Box>
            </div>
          </Fade>
        </Container>
      </Grid>
    </Grid>
  );
}
