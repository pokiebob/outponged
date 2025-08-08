import React, { Component } from "react";
import { BrowserRouter } from "react-router-dom";
import { Context } from "./Context";
import Home from "./containers/Layout/Home/Home";
import { Amplify, Storage } from 'aws-amplify';
import awsconfig from './aws-exports';

Amplify.configure({
  ...awsconfig,
  Storage: {
    AWSS3: {
      bucket: 'outponged-post',
      region: 'us-east-1',
    },
  },
});

const app = () => {
  const [userContext, setUserContext] = React.useState("");
  return (
    // <BrowserRouter basename="/my-app">
    <BrowserRouter>
      <div className="App" >
        <Context.Provider value={[userContext, setUserContext]}>
          <Home />
        </Context.Provider>
      </div>
    </BrowserRouter>
  );
}

export default app;
