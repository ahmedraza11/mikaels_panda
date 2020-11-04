import React, { useRef, useState } from "react";
import { Form, Button, Card, Alert,Spinner } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";

import styles from "./styles.module.css";

export default function Signup() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const { signup, generateUserDocument } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  async function handleSubmit(e) {
    e.preventDefault();
    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Passwords do not match");
    }

    if (emailRef.current.value.split("@")[1] !== "mikaels.com") {
      return setError("Only Mikaels folks are welcome: 😊");
    }

    try {
      setError("");
      setLoading(true);
      let userData = await signup(
        emailRef.current.value,
        passwordRef.current.value
      );
      await generateUserDocument(userData.user);
      history.push("/");
    } catch (err) {
      console.log("Error", err);
      setError("Failed to create an account", err);
    }
    setLoading(false);
  }

  return (
    <>
      <div
        style={{
          background: "black",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div className={styles.loginCard}>
          <Card
            style={{ maxWidth: "400px", margin: "auto", background: "black" }}
          >
            <img
              src={`${window.location.origin}/images/logo-black-svg.png`}
              style={{ width: "210px", margin: "auto" }}
            />
            <Card.Body style={{ marginTop: "40px" }}>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group id="email">
                  <Form.Label style={{ color: "#b2afaf" }}>Email</Form.Label>
                  <Form.Control type="email" ref={emailRef} required />
                </Form.Group>
                <Form.Group id="password">
                  <Form.Label style={{ color: "#b2afaf" }}>Password</Form.Label>
                  <Form.Control type="password" ref={passwordRef} required />
                </Form.Group>
                <Form.Group id="password-confirm">
                  <Form.Label style={{ color: "#b2afaf" }}>
                    Password Confirmation
                  </Form.Label>
                  <Form.Control
                    type="password"
                    ref={passwordConfirmRef}
                    required
                  />
                </Form.Group>
                <Button
                  style={{ background: "#4f4f4f", border: "none" }}
                  disabled={loading}
                  className="w-100"
                  type="submit"
                >
                  Sign Up
                  {loading && (
                    <Spinner
                      animation="grow"
                      variant="light"
                      size="sm"
                      style={{ marginLeft: "10px" }}
                    />
                  )}
                </Button>
              </Form>
            </Card.Body>
          </Card>
          <div className="w-100 text-center mt-2" style={{ color: "#b2afaf" }}>
            Already have an account?{" "}
            <Link
              style={{
                fontWeight: 600,
                color: "#ededed",
                cursor: "pointer",
                textDecoration: "none",
              }}
              to="/login"
            >
              Log In
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
