import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import Container from "@material-ui/core/Container";
import Divider from "@material-ui/core/Divider";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import React, { useContext } from "react";
import { FacebookLoginButton, GoogleLoginButton } from "react-social-login-buttons";
import { AuthContext } from "../services/authProvider";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  button: {
    width: "100%",
    margin: theme.spacing(1, 0, 1),
  },
  hr: {
    width: "80%",
    margin: theme.spacing(2),
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(0, 0, 1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignIn({}) {
  const classes = useStyles();
  const { signInWithRedirect } = useContext(AuthContext);

  const signInWithGoogle = () => {
    signInWithRedirect().then((result) => {});
  };

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          アカウントにログイン
        </Typography>
        <div className={classes.button}>
          <GoogleLoginButton onClick={signInWithGoogle}>
            <Typography variant="button" display="block">
              Googleでログイン
            </Typography>
          </GoogleLoginButton>
          <FacebookLoginButton onClick={signInWithGoogle}>
            <Typography variant="button" display="block">
              Facebookでログイン
            </Typography>
          </FacebookLoginButton>
        </div>
        <Divider variant="middle" className={classes.hr} />
        <Typography variant="body2" color="textSecondary" align="center">
          または
        </Typography>
        <form className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            disabled
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            disabled
          />
          <FormControlLabel control={<Checkbox value="remember" color="primary" />} label="Remember me" disabled />
          <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit} disabled>
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Typography variant="body2" color="textSecondary">
                Forgot password?
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="body2" color="textSecondary">
                {"Don't have an account? Sign Up"}
              </Typography>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={4}>
        <Copyright />
      </Box>
    </Container>
  );
}
