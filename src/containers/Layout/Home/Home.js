import React from "react";
import { Route, Link, NavLink, Switch, Redirect } from "react-router-dom";

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

// Icons
import TableTennis from "mdi-material-ui/TableTennis";

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

// {index % 2 === 0 ? <mdiTableTennis /> : <MailIcon />}

const renderNavList = () => {
  return (
    <List>
      <ListItem button key={"Home"}>
        <TableTennis />
        {/* <ListItemText primary={"Home"} href="/home/" /> */}
        <Link to="/home/">Home</Link>
      </ListItem>

      <ListItem button key={"Players"} href="/players/">
        <TableTennis />
        <Link to="/players/">Players</Link>
      </ListItem>

      <ListItem button key={"Coaches"}>
        <TableTennis />
        <Link to="/coaches/">Coaches</Link>
      </ListItem>

      <ListItem button key={"Clubs"}>
        <TableTennis />
        <Link to="/clubs/">Clubs</Link>
      </ListItem>

      <ListItem button key={"Tournaments"}>
        <TableTennis />
        <Link to="/tournaments/">Tournaments</Link>
      </ListItem>
    </List>
  );
};

export default home;
