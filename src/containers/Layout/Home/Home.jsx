import { TextField } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import CircularProgress from "@mui/material/CircularProgress";
import Drawer from "@mui/material/Drawer";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { makeStyles } from "../../../makeStyles";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import Autocomplete from "@mui/material/Autocomplete";
import { fetchUserAttributes, getCurrentUser, signInWithRedirect, signOut } from "aws-amplify/auth";
import { Hub } from "aws-amplify/utils";
import React, { useContext, useEffect, useState } from "react";
import { Link, Route, Switch, useHistory, useLocation } from "react-router-dom";
import { API_URL } from "../../../api-url";
import { Context } from "../../../Context";
import ComingSoon from "./ComingSoon";
import Clubs from "../Club/Clubs/Clubs";
import ClubProfile from "../Club/Profile/ClubProfile";
import Players from "../Person/Players/Players";
import EditPersonProfile from "../Person/Profile/EditProfile";
import PersonProfile from "../Person/Profile/PersonProfile";
import Post from "../Post/Post";
import Tournaments from "../Tournaments/Tournaments";
import Feed from "./Feed/Feed";
import { Redirect } from "react-router-dom";

let isLoggedIn = false;

const useStyles = makeStyles((theme) => ({
  grow: { flexGrow: 1 },
  menuButton: { marginRight: theme.spacing(2) },
  appBar: { background: "#ba0018" },
  title: {
    display: "none",
    [theme.breakpoints.up("sm")]: { display: "block" },
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.25)" },
    marginRight: theme.spacing(1),
    marginLeft: 0,
    // width: "100%",
    minWidth: 0,
    flexGrow: 1,
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(3),
      width: "320px",
      maxWidth: "100%",
      flexGrow: 0,
    },
  },
  inputRoot: { color: "inherit" },
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("md")]: { display: "flex" },
  },
  sectionMobile: {
    display: "flex",
    [theme.breakpoints.up("md")]: { display: "none" },
  },
  small: { width: theme.spacing(5), height: theme.spacing(5) },
  extraSmall: { width: theme.spacing(3), height: theme.spacing(3) },
  centeredListItem: {
    justifyContent: "center",
    textAlign: "center",
  },

  drawerContent: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    // justifyContent: "center",
    alignItems: "center",
  },
}));

const useSearchTextInputStyles = makeStyles((theme) => ({
  root: {
    "& .MuiFilledInput-root": {
      backgroundColor: "rgba(255, 255, 255, -.85)",
      color: "white",
      width: "100%",
      maxWidth: "100%",
      paddingTop: 0,
      fontSize: "0.9rem",
      [theme.breakpoints.down("sm")]: {
        fontSize: "0.8rem", // even smaller on very small devices
      },
    },
    "& .MuiFilledInput-root:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.01)",
      "@media (hover: none)": { backgroundColor: "rgb(232, 241, 250)" },
    },
    "& .MuiFilledInput-root.Mui-focused": {
      backgroundColor: "rgba(255, 255, 255, 0.01)",
      color: "white",
    },
    "& .MuiInputBase-input": {
      fontSize: "inherit",
      [theme.breakpoints.down("sm")]: {
        fontSize: "0.8rem",
      },
    },
    "& .MuiInputBase-input::placeholder": {
      fontSize: "inherit",
      opacity: 0.8,
    },
  },
  searchBar: { flexWrap: "nowrap" },
  searchIcon: { paddingLeft: 3, paddingTop: 6 },
}));

const home = () => {
  const classes = useStyles();
  const searchClasses = useSearchTextInputStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchOptions, setSearchOptions] = useState([]);
  const searchLoading = searchOpen && searchOptions.length === 0;
  const [userContext, setUserContext] = useContext(Context);
  const [awsUser, setAwsUser] = useState(null);
  const history = useHistory();
  const location = useLocation();
  const [state, setState] = useState({
    isDrawerOpen: false,
    isMenuOpen: false,
  });
  const [hasPersisted, setHasPersisted] = useState(false);

  useEffect(() => {
    let active = true;
    if (!searchLoading) return undefined;
    fetch(API_URL.person)
      .then((resp) => resp.json())
      .then((users) => {
        if (active) setSearchOptions([...users]);
      });
    return () => {
      active = false;
    };
  }, [searchLoading]);

  useEffect(() => {
    if (!searchOpen) setSearchOptions([]);
  }, [searchOpen]);

  useEffect(() => {
    const updateUser = async () => {
      try {
        const user = await getCurrentUser();
        const attributes = await fetchUserAttributes();
        // console.log("[AUTH] Cognito session found:", user);
        setAwsUser({ ...user, attributes });
        if (location.pathname === "/") history.push("/home/");
      } catch (error) {
        // console.log("[AUTH] No Cognito session found", error);
      }
    };
    const stopListening = Hub.listen("auth", updateUser);
    updateUser();
    return stopListening;
  }, []);

  useEffect(() => {
    // console.log("[STATE] awsUser changed:", awsUser);
  }, [awsUser]);

  const handleLogIn = async () => {
    const currentUser = await getCurrentUser().catch(() => null);
    // console.log("[handleLogIn] currentUser:", currentUser);
    if (!currentUser) {
      //   console.log("[handleLogIn] no session → federated sign-in");
      await signInWithRedirect();
    } else {
      //   console.log("[handleLogIn] already signed in");
    }
  };

  const persistAndRefresh = (user) => {
    const email = user?.attributes?.email || user.email || null;
    // console.log("[persistAndRefresh] extracted email:", email);

    if (!email) {
      console.error(
        "[persistAndRefresh] Could not find email in user object:",
        user
      );
      return;
    }

    const post = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    };

    fetch(API_URL.person, post)
      .then((resp) => resp.json())
      .then((resp) => {
        fetch(API_URL.person + resp.personId + "/?page=home")
          .then((resp) => resp.json())
          .then((personData) => {
            setUserContext(personData);
            if (!personData.firstName || !personData.lastName) {
              history.push("/edit-person-profile/" + personData?.personId);
            }
          });
      });
  };

  useEffect(() => {
    // console.log("[STATE] userContext changed:", userContext);
  }, [userContext]);

  // if (awsUser && !isLoggedIn) persistAndRefresh(awsUser);
  useEffect(() => {
    if (awsUser && !userContext && !hasPersisted) {
      persistAndRefresh(awsUser);
      setHasPersisted(true);
    }
  }, [awsUser, userContext, hasPersisted]);

  const renderAppBar = () => {
    const toggleDrawer = (open) => (event) => {
      if (
        event.type === "keydown" &&
        (event.key === "Tab" || event.key === "Shift")
      )
        return;
      setState({ ...state, isDrawerOpen: open });
    };
    const handleClick = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);
    const navigateToUserProfile = (personId) =>
      history.push("/person-profile/" + personId);
    const renderNavList = () => (
      <div className={classes.drawerContent}>
        <List>
          <ListItem
            button
            component={Link}
            to="/home/"
            onClick={toggleDrawer(false)}
            className={classes.centeredListItem}
          >
            <Typography variant="body1" align="center">
              Home
            </Typography>
          </ListItem>
          <ListItem
            button
            component={Link}
            to="/players/"
            onClick={toggleDrawer(false)}
            className={classes.centeredListItem}
          >
            <Typography variant="body1" align="center">
              Players
            </Typography>
          </ListItem>
          <ListItem
            button
            component={Link}
            to="/coaches/"
            onClick={toggleDrawer(false)}
            className={classes.centeredListItem}
          >
            <Typography variant="body1" align="center">
              Coaches
            </Typography>
          </ListItem>
          <ListItem
            button
            component={Link}
            to="/clubs/"
            onClick={toggleDrawer(false)}
            className={classes.centeredListItem}
          >
            <Typography variant="body1" align="center">
              Clubs
            </Typography>
          </ListItem>
          <ListItem
            button
            component={Link}
            to="/tournaments/"
            onClick={toggleDrawer(false)}
            className={classes.centeredListItem}
          >
            <Typography variant="body1" align="center">
              Tournaments
            </Typography>
          </ListItem>
        </List>
      </div>
    );

    const renderPostButton = () => {
      if (!userContext) return null;
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
    };

    const renderSearchBar = () => (
      <div className={classes.search}>
        <Autocomplete
          id="asynchronous-demo"
          forcePopupIcon={false}
          options={searchOptions}
          loading={searchLoading}
          open={searchOpen}
          onOpen={() => setSearchOpen(true)}
          onClose={() => setSearchOpen(false)}
          getOptionLabel={(user) =>
            user.firstName && user.lastName
              ? `${user.firstName} ${user.lastName}`
              : "Guest User"
          }
          renderOption={(props, user) => (
            <Grid
              {...props}
              container
              onClick={() => navigateToUserProfile(user.personId)}
            >
              <Avatar src={user.pictureUrl} className={classes.menuButton} />
              {user.firstName && user.lastName
                ? `${user.firstName} ${user.lastName}`
                : "Guest User"}
            </Grid>
          )}
          //   sx={{ width: 300 }}
          renderInput={(params) => (
            <Grid
              container
              className={searchClasses.searchBar}
              alignItems="flex-end"
            >
              <Grid item>
                <SearchIcon className={searchClasses.searchIcon} />
              </Grid>
              <Grid item style={{ flex: 1 }}>
                <TextField
                  {...params}
                  placeholder="Search for users..."
                  variant="filled"
                  className={searchClasses.root}
                  size="small"
                  InputProps={{
                    ...params.InputProps,
                    disableUnderline: true,
                    endAdornment: (
                      <>
                        {searchLoading ? (
                          <CircularProgress color="inherit" size={20} />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              </Grid>
            </Grid>
          )}
        />
      </div>
    );

    const renderLoginButton = () => {
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
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "center" }}
              disablePortal
            >
              <MenuItem disabled>
                {userContext.firstName && userContext.lastName
                  ? `${userContext.firstName} ${userContext.lastName}`
                  : "Enter Profile Info"}
              </MenuItem>
              <MenuItem
                component={Link}
                to="/home/"
                onClick={() => {
                  setUserContext();
                  isLoggedIn = false;
                  signOut();
                  window.location.reload(false);
                }}
              >
                Sign Out
              </MenuItem>
              <MenuItem
                component={Link}
                to={`/person-profile/${userContext.personId}`}
              >
                View Profile
              </MenuItem>
              <MenuItem
                component={Link}
                to={`/edit-person-profile/${userContext.personId}`}
              >
                Edit Profile
              </MenuItem>
            </Menu>
          </div>
        );
      } else {
        return (
          <Button color="inherit" onClick={handleLogIn}>
            Log In
          </Button>
        );
      }
    };

    return (
      <div className={classes.grow}>
        <AppBar
          position="static"
          className={classes.appBar}
          sx={{ backgroundColor: "#ba0018" }}
        >
          <Toolbar>
            <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component={Link}
              to="/home/"
              className={classes.title}
              variant="h6"
              noWrap
              style={{ color: "inherit", textDecoration: "none" }}
            >
              OutPonged
            </Typography>

            {renderSearchBar()}
            <div className={classes.grow} />
            <div className={classes.sectionDesktop}>
              {renderPostButton()}
              {renderLoginButton()}
            </div>
            <div className={classes.sectionMobile}>
              {renderPostButton()}
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

  const renderSignedOutPost = () => (
    <Box
      sx={{
        maxWidth: 520,
        mx: "auto",
        mt: 4,
        px: 3,
        py: 4,
        textAlign: "center",
      }}
    >
      <Typography variant="h6" gutterBottom>
        Log in to create a post
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 2 }}>
        Posting is available to signed-in OutPonged members.
      </Typography>
      <Button variant="contained" onClick={handleLogIn}>
        Log In
      </Button>
    </Box>
  );

  // if (userContext) {
  return (
    <div>
      {renderAppBar()}
      <Switch>
        <Route path="/home/" component={Feed} />
        <Route path="/players/" component={Players} />
        <Route path="/clubs/" render={() => <ComingSoon page="Clubs" />} />
        <Route path="/coaches/" render={() => <ComingSoon page="Coaches" />} />
        <Route path="/person-profile/" component={PersonProfile} />
        <Route path="/edit-person-profile/" component={EditPersonProfile} />
        <Route path="/club-profile/" component={ClubProfile} />
        <Route path="/tournaments/" component={Tournaments} />
        <Route
          path="/post"
          render={() => (userContext ? <Post /> : renderSignedOutPost())}
        />
        <Redirect exact from="/" to="/home/" />
      </Switch>
    </div>
  );

  // } else {
  //     return (
  //         <div>
  //             <LogIn handleLogIn={handleLogIn} />
  //         </div>
  //     );
  // }
};

export default home;
