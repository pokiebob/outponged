import React, { Component } from "react";
import { Route, NavLink, Switch, Redirect } from "react-router-dom";

//Material UI
import { makeStyles, createMuiTheme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";

import "./Home.css";
import Players from "../Players/Players";

// const useStyles = makeStyles((theme) => ({
//   root: {
//     flexGrow: 1,
//   },
//   menuButton: {
//     marginRight: theme.spacing(2),
//   },
//   title: {
//     flexGrow: 1,
//   },
// }));

const theme = createMuiTheme();

class Home extends Component {
  classes = {
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
  };

  render() {
    return (
      <div>
        {this.renderAppBar()}
        {this.renderNavBar()}
        <Switch>
          <Route path="/players" component={Players} />
        </Switch>
      </div>
    );
  }

  renderAppBar() {
    return (
      <div className={this.classes.root}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              edge="start"
              className={this.classes.menuButton}
              color="inherit"
              aria-label="menu"
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" className={this.classes.title}>
              Home
            </Typography>
            <Button color="inherit">Login</Button>
          </Toolbar>
        </AppBar>
      </div>
    );
  }

  renderNavBar() {
    return (
      <header>
        <div className="Home">
          <nav>
            <ul>
              <li>
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
              </li>
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
      </header>
    );
  }
}

export default Home;
