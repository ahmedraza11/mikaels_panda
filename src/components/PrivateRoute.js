import React from "react"
import { Route, Redirect } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

export default function PrivateRoute({ component: Component, ...rest }) {
  const { currentUser, userObject } = useAuth()
  console.log("Currrrrrrrrrrrrrrrrrent Userrrrr", currentUser)
  console.log("Currrrrrrrrrrrrrrrrrent Userrrrr", userObject)

  return (
    <Route
      {...rest}
      render={props => {
        return userObject ? <Component {...props} /> : <Redirect to="/login" />
      }}
    ></Route>
  )
}
