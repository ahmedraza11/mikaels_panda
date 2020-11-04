import React from "react"
import { Container } from "react-bootstrap"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"


import { AuthProvider,useAuth } from "../contexts/AuthContext"
import UpdateProfile from "./UpdateProfile"
import PrivateRoute from "./PrivateRoute"
import WorkerPanel from "./workerPanel"
import Dashboard from "./Dashboard"
import Signup from "./Signup"
import Login from "./Login"

function App() {
  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh" }}
    >
      <div className="w-100" style={{height:"100vh"}} >
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
  )
}

export default App
