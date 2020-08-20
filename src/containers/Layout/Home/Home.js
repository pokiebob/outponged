import React, { Component } from "react";
import { Route, NavLink, Switch, Redirect } from "react-router-dom";

import "./Home.css";
import Posts from "../../Blog/Posts/Posts";

class Home extends Component {
  render() {
    return (
      <div className="Home">
        <header>
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
        </header>
        <Switch>
          <Route path="/players" component={Posts} />
        </Switch>
      </div>
    );
  }
}

export default Home;
