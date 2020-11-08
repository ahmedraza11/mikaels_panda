import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { Login, Signup, UpdateProfile, Dashboard } from "./../index";
import { AuthProvider } from "../../Contexts/AuthContext";
import { PrivateRoute } from "./../../Components";

const App = () => {
  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh" }}
    >
      <div className="w-100" style={{ height: "100vh" }}>
        <Router>
          <AuthProvider>
            <Switch>
              <PrivateRoute exact path="/" component={Dashboard} />
              <PrivateRoute path="/update-profile" component={UpdateProfile} />
              <Route path="/signup" component={Signup} />
              <Route path="/login" component={Login} />
            </Switch>
          </AuthProvider>
        </Router>
      </div>
    </div>
  );
};

export default App;
