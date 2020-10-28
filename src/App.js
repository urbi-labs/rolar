import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";

import PrivateRoute from "./components/PrivateRoute";
import Home from "./components/Home";
import Login from "./components/Login";

function App() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <PrivateRoute exact path="/" component={Home} />
      <Redirect to="login" />
    </Switch>
  );
}

export default App;
