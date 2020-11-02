import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function PrivateRoute({ component: Component, ...rest }) {
  const { currentUser, userObject } = useAuth();
  console.log("++++++",currentUser)
   return (
    <Route
      {...rest}
      render={(props) => {
        return userObject ? <Component {...props} /> : <Redirect to="/login" />;
      }}
    ></Route>
  ) 
}
