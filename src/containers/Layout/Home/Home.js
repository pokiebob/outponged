import React, { useContext } from "react";
import { Context } from "../../../Context";
import { useHistory } from "react-router-dom";

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
import Avatar from '@material-ui/core/Avatar';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

// Icons
import TableTennis from "mdi-material-ui/TableTennis";

import "./Home.css";

// Components
import { Route, Link, Switch, Redirect } from "react-router-dom";
import Players from "../Person/Players/Players";
import Clubs from "../Club/Clubs/Clubs";
import PersonProfile from "../Person/Profile/PersonProfile";
import EditPersonProfile from "../Person/Profile/EditProfile";
import ClubProfile from "../Club/Profile/ClubProfile";
import Post from "../Post/Post";
import Feed from "./Feed/Feed";

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
  },
  small: {
    width: theme.spacing(5),
    height: theme.spacing(5),
  },
}));

let isLoggedIn = false;

const home = () => {
  // const forceUpdate = useForceUpdate();
  const classes = useStyles();
  const [userContext, setUserContext] = useContext(Context);
  // const [personDataState, setPersonDataState] = React.useState();
  const renderAppBar = (classes) => {
    const [state, setState] = React.useState({
      isDrawerOpen: false,
      isMenuOpen: false,
    });


    const [awsUser, setAwsUser] = React.useState(null);
    const history = useHistory();
    // const [userContext, setUserContext] = useContext(Context);
    React.useEffect(() => {
      const updateUser = async () => {
        try {
          const info = localStorage;
          const provider = "CognitoIdentityServiceProvider.7jr2f6rahrfv2mbpuqfogivjob."
          const user = info.getItem(provider + "LastAuthUser");
          const userData = JSON.parse(info.getItem(provider + user + ".userData"));
          console.log('info', info);
          console.log('user', user);
          console.log('userData', userData);
          setAwsUser(userData);
        } catch (error) {
          console.log(error);
        }
        // setTimeout(async () => {
          // try {
          //   await Auth.currentSession()
          //     .then((data) => {
          //       console.log('data', data);
          //       if (data) {
          //         const payload = data.getIdToken().payload
          //         setAwsUser(payload);
          //       } else {
          //         console.log('user not received');
          //       }
          //     });
          // } catch (error) {
          //   console.log(error);
          // }
        // },100);
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
      personId: user.UserAttributes[0].Value,
      email: user.UserAttributes[2].Value,
      externalId: {
        awsIdentity: user.UserAttributes[0].Value
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
      // console.log("MONGO response:", resp);
    })
    .then(
      fetch(API_URL.person + user.UserAttributes[0].Value)
        .then(resp => resp.json())
        .then((personData) => {
          setUserContext(personData);
          console.log(personData);
          return personData;
        })
        .then((personData) => {
          if (!personData.firstName || !personData.lastName || personData?.firstName?.length === 0 || personData?.lastName?.length === 0) {
            history.push('/edit-person-profile/' + personData?.personId);
          }
        })
    );
}

if (awsUser && !isLoggedIn) persistAndRefresh(awsUser);

const toggleDrawer = (open) => (event) => {
  if (
    event.type === "keydown" &&
    (event.key === "Tab" || event.key === "Shift")
  ) {
    return;
  }

  setState({ ...state, isDrawerOpen: open });
};

const [anchorEl, setAnchorEl] = React.useState(null);

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

const logInAsGuestUser = () => {
  fetch(API_URL.person + 'd5f3a250-ad24-47dc-a250-3ade9538ba0d')
    .then(resp => resp.json())
    .then((personData) => {
      setUserContext(personData);
      // console.log(personData);
    });
}

const renderPostButton = () => {
  // if (awsUser) {
  return (
    <IconButton
      aria-label="Post"
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
            onClick={() => {
              setUserContext();
              Auth.signOut();
            }}>
            Sign Out
          </MenuItem>
          <MenuItem
            component={Link} to={"/person-profile/" + userContext?.personId}
          >
            View Profile
          </MenuItem>
        </Menu>
      </div>
    )
  } else {
    return (
      <div>
        <IconButton
          onClick={handleClick}
          aria-controls="customized-menu"
          aria-haspopup="true"
        >
          <Avatar className={classes.small} />
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
            horizontal: 'center'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center'
          }}
        >
          <MenuItem
            onClick={() => {
              Auth.federatedSignIn();
            }}>
            Login or Create Account
          </MenuItem>
          <MenuItem
            onClick={() => {
              logInAsGuestUser();
            }}
          >
            Login as Guest User
          </MenuItem>
        </Menu>
      </div>
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




const renderPostPage = () => {
  // console.log('renderPostPage userContext', userContext);
  if (userContext) {
    return (
      <Route path="/post" component={Post} />
    );
  } else {
    return (
      <Route path="/post" >
        Please Log In
      </Route>
    );
  }
  // return (
  //   <Route path="/post" component={Post} />
  // );
}

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
      {renderPostPage()}
    </Switch>

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
