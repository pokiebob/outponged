import React, { Component } from "react";
import { Route, NavLink, Switch, Redirect } from "react-router-dom";

import "./Home.css";

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
            </ul>
          </nav>
        </header>
      </div>
    );
  }
}

export default Home;
