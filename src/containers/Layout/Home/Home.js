//MUI
import AppBar from "@material-ui/core/AppBar";
import Avatar from '@material-ui/core/Avatar';
import Drawer from "@material-ui/core/Drawer";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
// Icons
import AddIcon from '@material-ui/icons/Add';
import MenuIcon from "@material-ui/icons/Menu";
//
import { Auth, Hub } from 'aws-amplify';
import TableTennis from "mdi-material-ui/TableTennis";
import React, { useContext, useEffect, useState } from "react";
import { Link, Route, Switch, useHistory } from "react-router-dom";
import { API_URL } from "../../../api-url";
import { Context } from "../../../Context";
//Routes
import Clubs from "../Club/Clubs/Clubs";
import ClubProfile from "../Club/Profile/ClubProfile";
import Players from "../Person/Players/Players";
import EditPersonProfile from "../Person/Profile/EditProfile";
import PersonProfile from "../Person/Profile/PersonProfile";
import Post from "../Post/Post";
import tournaments from "../Tournaments/Tournaments";
import Feed from "./Feed/Feed";
import Tournaments from "../Tournaments/Tournaments";
import "./Home.css";
import LogIn from "./LogIn";
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
  },
  small: {
    width: theme.spacing(5),
    height: theme.spacing(5),
  },
  background: {
    width: "100%"
  }
}));

let isLoggedIn = false;

const home = () => {
  // const forceUpdate = useForceUpdate();
  const classes = useStyles();
  const [userContext, setUserContext] = useContext(Context);
  const [awsUser, setAwsUser] = useState(null);
  const history = useHistory();
  const [state, setState] = useState({
    isDrawerOpen: false,
    isMenuOpen: false,
  });
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    const ga = window.gapi && window.gapi.auth2 ?
      window.gapi.auth2 :
      null;

    // console.log(ga);
    if (!ga) createScript();
  });

  useEffect(() => {

    const updateUser = async () => {
      try {
        await Auth.currentAuthenticatedUser()
          .then((data) => {
            // console.log('data', data);
            if (data) {
              // const payload = data.getIdToken().payload
              // setAwsUser(payload);
              setAwsUser(data);
            } else {
              console.log('user not received, logging in as guest');
              logInAsGuestUser();
            }
          });
      } catch (error) {
        console.log('Auth.currentAuthenticatedUser()', error, awsUser);
      }
    }
    Hub.listen('auth', updateUser) // listen for login/signup events
    updateUser() // check manually the first time because we won't get a Hub event
    return () => Hub.remove('auth', updateUser) // cleanup
  }, []);

  const persistAndRefresh = (user) => {
    isLoggedIn = true;
    const post = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: user.email
      })
    }

    fetch(API_URL.person, post)
      .then(resp => resp.json())
      .then((resp) => {
        // console.log("MONGO response:", resp);
        fetch(API_URL.person + resp.personId)
          .then(resp => resp.json())
          .then((personData) => {
            setUserContext(personData);
            // console.log(personData);
            return personData;
          })
          .then((personData) => {
            if (!personData.firstName || !personData.lastName || personData?.firstName?.length === 0 || personData?.lastName?.length === 0) {
              history.push('/edit-person-profile/' + personData?.personId);
            }
          })
      }
      );
  }

  if (awsUser && !isLoggedIn) persistAndRefresh(awsUser);

  const renderAppBar = (classes) => {




    const toggleDrawer = (open) => (event) => {
      if (
        event.type === "keydown" &&
        (event.key === "Tab" || event.key === "Shift")
      ) {
        return;
      }

      setState({ ...state, isDrawerOpen: open });
    };

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
      setAnchorEl(null);
    };

    const renderNavList = () => {
      return (
        <List>
          <ListItem button component={Link} to="/home/" onClick={toggleDrawer(false)}>
            <TableTennis />
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

    const logInAsGuestUser = () => {
      fetch(API_URL.person + 'd5f3a250-ad24-47dc-a250-3ade9538ba0d')
        .then(resp => resp.json())
        .then((personData) => {
          setUserContext(personData);
        });
    }

    const renderPostButton = () => {
      // if (awsUser) {
      return (
        <IconButton
          aria-label="Post"
          title="New Post"
          color="inherit"
          component={Link}
          to="/post/"
        >
          <AddIcon />
        </IconButton>
      );
      // }

    }

    const renderLoginButton = () => {
      // console.log('userContext', userContext);
      if (userContext) {
        return (
          <div>
            <IconButton
              onClick={handleClick}
              aria-controls="customized-menu"
              aria-haspopup="true"
            >
              <Avatar src={userContext.pictureUrl} className={classes.small} />
            </IconButton>
            <Menu
              id="customized-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
              getContentAnchorEl={null}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'center'
              }}
            >
              <MenuItem disabled={true}>
                {
                  userContext.firstName && userContext.lastName ?
                    `${userContext?.firstName} ${userContext?.lastName}` : 'Enter Profile Info'
                }
              </MenuItem>
              <MenuItem
                component={Link} to={"/home/"}
                onClick={() => {
                  setUserContext();
                  isLoggedIn = false;
                  Auth.signOut();
                  window.location.reload(false);
                }}>
                Sign Out
              </MenuItem>
              <MenuItem
                component={Link} to={"/person-profile/" + userContext?.personId}
              >
                View Profile
              </MenuItem>
              <MenuItem
                component={Link} to={"/edit-person-profile/" + userContext?.personId}
              >
                Edit Profile
              </MenuItem>
            </Menu>
          </div>
        )
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




  const renderPostPage = () => {
    // console.log('renderPostPage userContext', userContext);
    if (userContext) {
      return (
        <Route path="/post" component={Post} />
      );
    }
  }

  const handleLogIn = async () => {
    // Auth.federatedSignIn({provider: 'Google'});
    const ga = window.gapi.auth2.getAuthInstance();
    if (!ga.isSignedIn.get()) {
      ga.signIn().then(
        googleUser => {
          getAWSCredentials(googleUser);
        },
        err => {
          console.log(err);
        }
      );
    } else {
      // console.log(ga.currentUser.get());
      await Auth.signOut().then(
        getAWSCredentials(ga.currentUser.get()));
    }

  }

  const getAWSCredentials = async (googleUser) => {
    const id_token = googleUser.Zb.id_token;
    const expires_at = googleUser.Zb.expires_at;
    const user = {
      email: googleUser.Rs.Ct,
      name: googleUser.Rs.Qe
    }

    // const { id_token, expires_at } = googleUser.getAuthResponse();
    // const profile = googleUser.getBasicProfile();
    // let user = {
    //   email: profile.getEmail(),
    //   name: profile.getName()
    // };

    await Auth.federatedSignIn(
      'google',
      { token: id_token, expires_at },
      user
    ).then((credentials) => {
      // console.log('credentials', credentials)
    }
    );
  }

  const createScript = () => {
    // load the Google SDK
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/platform.js';
    script.async = true;
    script.onload = initGapi;
    document.body.appendChild(script);
  }

  const initGapi = () => {
    // init the Google SDK client
    const g = window.gapi;
    g.load('auth2', function () {
      g.auth2.init({
        client_id: '935856095530-b68opn4gva9dm1rhgtrt9j5lo9io23e3.apps.googleusercontent.com',
        // authorized scopes
        scope: 'profile email openid'
      });
    });
  }

  if (userContext) {

    return (
      <div>
        {renderAppBar(classes)}
        <Switch>
          <Route path="/home" component={Feed} />
          <Route path="/players" component={Players} />
          <Route path="/clubs" component={Clubs} />
          <Route path="/person-profile" component={PersonProfile} />
          <Route path="/edit-person-profile" component={EditPersonProfile} />
          <Route path="/club-profile" component={ClubProfile} />
          <Route path="/tournaments" component={Tournaments} />
          {renderPostPage()}
        </Switch>

      </div>
    );
  } else {
    // rendering the app bar makes the call to aws and mongo
    return (
      <div >
        <LogIn handleLogIn={handleLogIn} />
      </div>
    );
  }
}


export default home;
