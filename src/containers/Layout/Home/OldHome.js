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
import TextField from "@material-ui/core/TextField";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
// Icons
import AddIcon from '@material-ui/icons/Add';
import MenuIcon from "@material-ui/icons/Menu";
import Autocomplete from "@material-ui/lab/Autocomplete";
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
import Tournaments from "../Tournaments/Tournaments";
import Feed from "./Feed/Feed";
import "./Home.css";
import LogIn from "./LogIn";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    // paddingRight: theme.spacing(2),
  },
  appBar: {
    background: '#ba0018'
  },
  small: {
    width: theme.spacing(5),
    height: theme.spacing(5),
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.25)'
    },
    minWidth: 300,
    // marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "auto",
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
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

    const renderSearchBar = () => {
      const top100Films = [
        { title: "The Shawshank Redemption", year: 1994 },
        { title: "The Godfather", year: 1972 },
        { title: "The Godfather: Part II", year: 1974 },
        { title: "The Dark Knight", year: 2008 },
        { title: "12 Angry Men", year: 1957 },
        { title: "Schindler's List", year: 1993 },
        { title: "Pulp Fiction", year: 1994 },
        { title: "The Lord of the Rings: The Return of the King", year: 2003 },
        { title: "The Good, the Bad and the Ugly", year: 1966 },
        { title: "Fight Club", year: 1999 },
        { title: "The Lord of the Rings: The Fellowship of the Ring", year: 2001 },
        { title: "Star Wars: Episode V - The Empire Strikes Back", year: 1980 },
        { title: "Forrest Gump", year: 1994 },
        { title: "Inception", year: 2010 },
        { title: "The Lord of the Rings: The Two Towers", year: 2002 },
        { title: "One Flew Over the Cuckoo's Nest", year: 1975 },
        { title: "Goodfellas", year: 1990 },
        { title: "The Matrix", year: 1999 },
        { title: "Seven Samurai", year: 1954 },
        { title: "Star Wars: Episode IV - A New Hope", year: 1977 },
        { title: "City of God", year: 2002 },
        { title: "Se7en", year: 1995 },
        { title: "The Silence of the Lambs", year: 1991 },
        { title: "It's a Wonderful Life", year: 1946 },
        { title: "Life Is Beautiful", year: 1997 },
        { title: "The Usual Suspects", year: 1995 },
        { title: "Léon: The Professional", year: 1994 },
        { title: "Spirited Away", year: 2001 },
        { title: "Saving Private Ryan", year: 1998 },
        { title: "Once Upon a Time in the West", year: 1968 },
        { title: "American History X", year: 1998 },
        { title: "Interstellar", year: 2014 },
        { title: "Casablanca", year: 1942 },
        { title: "City Lights", year: 1931 },
        { title: "Psycho", year: 1960 },
        { title: "The Green Mile", year: 1999 },
        { title: "The Intouchables", year: 2011 },
        { title: "Modern Times", year: 1936 },
        { title: "Raiders of the Lost Ark", year: 1981 },
        { title: "Rear Window", year: 1954 },
        { title: "The Pianist", year: 2002 },
        { title: "The Departed", year: 2006 },
        { title: "Terminator 2: Judgment Day", year: 1991 },
        { title: "Back to the Future", year: 1985 },
        { title: "Whiplash", year: 2014 },
        { title: "Gladiator", year: 2000 },
        { title: "Memento", year: 2000 },
        { title: "The Prestige", year: 2006 },
        { title: "The Lion King", year: 1994 },
        { title: "Apocalypse Now", year: 1979 },
        { title: "Alien", year: 1979 },
        { title: "Sunset Boulevard", year: 1950 },
        {
          title:
            "Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb",
          year: 1964
        },
        { title: "The Great Dictator", year: 1940 },
        { title: "Cinema Paradiso", year: 1988 },
        { title: "The Lives of Others", year: 2006 },
        { title: "Grave of the Fireflies", year: 1988 },
        { title: "Paths of Glory", year: 1957 },
        { title: "Django Unchained", year: 2012 },
        { title: "The Shining", year: 1980 },
        { title: "WALL·E", year: 2008 },
        { title: "American Beauty", year: 1999 },
        { title: "The Dark Knight Rises", year: 2012 },
        { title: "Princess Mononoke", year: 1997 },
        { title: "Aliens", year: 1986 },
        { title: "Oldboy", year: 2003 },
        { title: "Once Upon a Time in America", year: 1984 },
        { title: "Witness for the Prosecution", year: 1957 },
        { title: "Das Boot", year: 1981 },
        { title: "Citizen Kane", year: 1941 },
        { title: "North by Northwest", year: 1959 },
        { title: "Vertigo", year: 1958 },
        { title: "Star Wars: Episode VI - Return of the Jedi", year: 1983 },
        { title: "Reservoir Dogs", year: 1992 },
        { title: "Braveheart", year: 1995 },
        { title: "M", year: 1931 },
        { title: "Requiem for a Dream", year: 2000 },
        { title: "Amélie", year: 2001 },
        { title: "A Clockwork Orange", year: 1971 },
        { title: "Like Stars on Earth", year: 2007 },
        { title: "Taxi Driver", year: 1976 },
        { title: "Lawrence of Arabia", year: 1962 },
        { title: "Double Indemnity", year: 1944 },
        { title: "Eternal Sunshine of the Spotless Mind", year: 2004 },
        { title: "Amadeus", year: 1984 },
        { title: "To Kill a Mockingbird", year: 1962 },
        { title: "Toy Story 3", year: 2010 },
        { title: "Logan", year: 2017 },
        { title: "Full Metal Jacket", year: 1987 },
        { title: "Dangal", year: 2016 },
        { title: "The Sting", year: 1973 },
        { title: "2001: A Space Odyssey", year: 1968 },
        { title: "Singin' in the Rain", year: 1952 },
        { title: "Toy Story", year: 1995 },
        { title: "Bicycle Thieves", year: 1948 },
        { title: "The Kid", year: 1921 },
        { title: "Inglourious Basterds", year: 2009 },
        { title: "Snatch", year: 2000 },
        { title: "3 Idiots", year: 2009 },
        { title: "Monty Python and the Holy Grail", year: 1975 }
      ];

      return (
        <div className={classes.search}>
          <Autocomplete
            id="combo-box-demo"
            options={top100Films}
            getOptionLabel={(option) => option.title}
            renderInput={(params) =>
              <TextField
                {...params}
                size="small"
                // variant="outlined"
                label="Search for users..."
              />
            }
          />
        </div>
      );
    }

    const renderLoginButton = () => {
      // console.log('userContext', userContext);
      if (userContext) {
        return (
          <div >
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
            {renderSearchBar()}
            <div className={classes.root} />
            <div className={classes.sectionDesktop}>
              {renderPostButton()}
              {renderLoginButton()}
            </div>
            <div className={classes.sectionMobile}>
              {/* {renderPostButton()} */}
              {renderLoginButton()}
            </div>

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
