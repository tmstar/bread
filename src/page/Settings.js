import { useAuth0 } from '@auth0/auth0-react';
import ArrowBack from '@mui/icons-material/ArrowBack';
import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    color: theme.palette.text.primary,
    backgroundImage: 'none',
    boxShadow: 'none',
    borderBottom: '1px solid',
    borderBottomColor: theme.palette.divider,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(0, 1),
  },
  list: {
    flexGrow: 1,
    padding: theme.spacing(0, 1),
  },
}));
function Settings() {
  const classes = useStyles();
  const navigate = useNavigate();
  const { user, logout } = useAuth0();

  const handleClose = () => {
    navigate(-1);
  };

  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleClose}
            edge="start"
            className={classes.menuButton}
            size="large"
          >
            <ArrowBack />
          </IconButton>
          <Typography className={classes.title} variant="h6" noWrap>
            {'設定'}
          </Typography>
        </Toolbar>
      </AppBar>
      <main className={classes.content}>
        <div className={classes.list}>
          <Toolbar />
          <List>
            <ListSubheader color="primary" sx={{ px: 6.3 }}>
              {'アカウント'}
            </ListSubheader>
            <ListItem button onClick={() => logout({ returnTo: window.location.origin })}>
              <ListItemText
                primary={'ログアウト'}
                primaryTypographyProps={{
                  fontWeight: 'medium',
                  variant: 'body1',
                }}
                secondary={`${user.email}`}
                sx={{ px: 4.5 }}
              />
            </ListItem>
          </List>
        </div>
      </main>
    </div>
  );
}

export default Settings;
