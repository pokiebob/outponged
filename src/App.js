import React, { Component } from "react";
import { BrowserRouter } from "react-router-dom";
import { Context } from "./Context";
import Home from "./containers/Layout/Home/Home";

const app = () => {
  const [userContext, setUserContext] = React.useState("");
  return (
    // <BrowserRouter basename="/my-app">
    <BrowserRouter>
      <div className="App">
        <Context.Provider value={[userContext, setUserContext]}>
          <Home />
        </Context.Provider>
      </div>
    </BrowserRouter>
  );
}

export default app;
