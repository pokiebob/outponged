import React from "react";
import { Route, NavLink, Switch, Redirect } from "react-router-dom";

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
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import MailIcon from "@material-ui/icons/Mail";

import "./Home.css";
import Players from "../Players/Players";

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
}));

const home = () => {
  const classes = useStyles();

  return (
    <div>
      {renderAppBar(classes)}
      {renderNavBar(classes)}
      <Switch>
        <Route path="/players" component={Players} />
      </Switch>
    </div>
  );
};

const renderAppBar = (classes) => {
  const [state, setState] = React.useState({
    isDrawerOpen: false,
  });

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, isDrawerOpen: open });
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
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
          <Button color="inherit">Login</Button>
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

const renderNavList = () => {
  return (
    <List>
      {["Home", "Players", "Coaches", "Clubs", "Tournaments"].map(
        (text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>
              {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        )
      )}
    </List>
  );
};

const renderNavBar = () => {
  return (
    <div className="Home">
      <nav>
        <ul>
          <li>{navHome()}</li>
          <li>
            <NavLink
              to={{
                pathname: "/players/",
              }}
            >
              Players
            </NavLink>
          </li>
          <li>
            <NavLink
              to={{
                pathname: "/coaches/",
              }}
            >
              Coaches
            </NavLink>
          </li>
          <li>
            <NavLink
              to={{
                pathname: "/clubs/",
              }}
            >
              Clubs
            </NavLink>
          </li>
          <li>
            <NavLink
              to={{
                pathname: "/tournaments/",
              }}
            >
              Tournaments
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

const navHome = () => {
  return (
    <NavLink
      to="/home/"
      exact
      activeClassName="my-active"
      activeStyle={{
        color: "#fa923f",
        textDecoration: "underline",
      }}
    >
      Home
    </NavLink>
  );
};

export default home;
