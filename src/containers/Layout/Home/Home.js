import React from "react";
import { Route, Link, Switch } from "react-router-dom";

//Material UI
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import AddIcon from '@material-ui/icons/Add';

// Icons
import TableTennis from "mdi-material-ui/TableTennis";

import "./Home.css";

// Components
import Players from "../Person/Players/Players";
import Clubs from "../Club/Clubs/Clubs";
import PersonProfile from "../Person/Profile/PersonProfile";
import EditPersonProfile from "../Person/Profile/EditProfile";
import ClubProfile from "../Club/Profile/ClubProfile";

//Amplify
import { Auth, Hub } from 'aws-amplify';
import { API_URL } from "../../../api-url";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  appBar: {
    background: '#ba0018'
  }
}));

const home = () => {
  const classes = useStyles();

  return (
    <div>
      {renderAppBar(classes)}
      <Switch>
        <Route path="/players" component={Players} />
        <Route path="/clubs" component={Clubs} />
        <Route path="/person-profile" component={PersonProfile} />
        <Route path="/edit-person-profile" component={EditPersonProfile} />
        <Route path="/club-profile" component={ClubProfile} />
      </Switch>

    </div>
  );
};

const renderAppBar = (classes) => {
  var isLoggedIn = false;
  const [state, setState] = React.useState({
    isDrawerOpen: false,
  });

  const [user, setUser] = React.useState(null);
  React.useEffect(() => {
    const updateUser = async () => {
      try {
        await Auth.currentAuthenticatedUser()
          .then((data) => {
            setUser(data);
          })
      } catch {
        setUser(null)
      }
    }
    Hub.listen('auth', updateUser) // listen for login/signup events
    updateUser() // check manually the first time because we won't get a Hub event
    return () => Hub.remove('auth', updateUser) // cleanup
  }, []);
  console.log('user', user);

  const insertPerson = () => {
    if (user) {
      const post = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personId: user.attributes.sub,
          email: user.attributes.email,
          externalId: {
            awsIdentity: user.attributes.sub
          },
          role: {
            player: false,
            coach: false
          },
          links: {
            persons: {
            },
            clubs: {
            }
          }
        })
      }

      fetch(API_URL.person, post)
        .then(resp => resp.json())
        .then((resp) => {
          console.log("MONGO response:", resp);
        });
      isLoggedIn = true;
    }

  }

  if (!isLoggedIn) insertPerson();

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, isDrawerOpen: open });
  };

  const renderNavList = () => {
    return (
      <List>
        <ListItem button component={Link} to="/home/" onClick={toggleDrawer(false)}>
          <TableTennis />
          {/* <ListItemText primary={"Home"} href="/home/" /> */}
          Home
        </ListItem>

        <ListItem button component={Link} to="/players/" onClick={toggleDrawer(false)}>
          <TableTennis />
          Players
        </ListItem>

        <ListItem button component={Link} to="/coaches/" onClick={toggleDrawer(false)}>
          <TableTennis />
          Coaches
        </ListItem>

        <ListItem button component={Link} to="/clubs/" onClick={toggleDrawer(false)}>
          <TableTennis />
          Clubs
        </ListItem>

        <ListItem button component={Link} to="/tournaments/" onClick={toggleDrawer(false)}>
          <TableTennis />
          Tournaments
        </ListItem>
      </List>
    );
  };

  const renderPostButton = () => {
    if (user) {
      return (
        <IconButton aria-label="Post" color="inherit">
          <AddIcon />
        </IconButton>
      )
    }

  }

  const renderLoginButton = () => {

    if (user) {
      return (
        <Button
          color="inherit"
          onClick={() => {
            Auth.signOut();
          }}>
          Sign Out
        </Button>
      )
    } else {
      return (
        <Button
          color="inherit"
          onClick={() => {
            Auth.federatedSignIn();
          }}>
          Login
        </Button>
      );
    }
  }

  return (
    <div className={classes.root}>
      <AppBar position="static" className={classes.appBar}>
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            OutPonged
          </Typography>
          {renderPostButton()}
          {renderLoginButton()}

        </Toolbar>
      </AppBar>
      <Drawer open={state.isDrawerOpen} onClose={toggleDrawer(false)}>
        {renderNavList()}
      </Drawer>
    </div>
  );
};

// const renderDrawer = () => {
//   <React.Fragment>
//     <Drawer open={true}></Drawer>
//   </React.Fragment>;
// };

// {index % 2 === 0 ? <mdiTableTennis /> : <MailIcon />}

export default home;
