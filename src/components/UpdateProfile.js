import React, { useRef, useState } from "react";
import { Form, Button, Card, Alert, Spinner } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";

import styles from "./styles.module.css";

export default function UpdateProfile() {
  const displayNameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const {
    userObject,
    updatePassword,
    updateEmail,
    updateDisplayName,
  } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  function handleSubmit(e) {
    e.preventDefault();
    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Passwords do not match");
    }

    const promises = [];
    setLoading(true);
    setError("");

    if (emailRef.current.value !== userObject.email) {
      promises.push(updateEmail(emailRef.current.value));
    }
    if (passwordRef.current.value) {
      promises.push(updatePassword(passwordRef.current.value));
    }

    if (displayNameRef.current.value) {
      promises.push(updateDisplayName(displayNameRef.current.value));
    }

    Promise.all(promises)
      .then(() => {
        history.push("/");
      })
      .catch(() => {
        setError("Failed to update account");
      })
      .finally(() => {
        setLoading(false);
      });
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
              style={{ width: "210px", margin: "auto", marginBottom: "30px" }}
            />
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group id="displayName">
                  <Form.Label style={{ color: "#b2afaf" }}>
                    Display Name
                  </Form.Label>
                  <Form.Control
                    type="text"
                    ref={displayNameRef}
                    required
                    defaultValue={userObject.displayName}
                  />
                </Form.Group>
                <Form.Group id="email">
                  <Form.Label style={{ color: "#b2afaf" }}>Email</Form.Label>
                  <Form.Control
                    type="email"
                    ref={emailRef}
                    required
                    defaultValue={userObject.email}
                  />
                </Form.Group>
                <Form.Group id="password">
                  <Form.Label style={{ color: "#b2afaf" }}>Password</Form.Label>
                  <Form.Control
                    type="password"
                    ref={passwordRef}
                    placeholder="Leave blank to keep the same"
                  />
                </Form.Group>
                <Form.Group id="password-confirm">
                  <Form.Label style={{ color: "#b2afaf" }}>
                    Password Confirmation
                  </Form.Label>
                  <Form.Control
                    type="password"
                    ref={passwordConfirmRef}
                    placeholder="Leave blank to keep the same"
                  />
                </Form.Group>
                <Button
                  style={{ background: "#4f4f4f", border: "none" }}
                  disabled={loading}
                  className="w-100"
                  type="submit"
                >
                  Update
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
          <div className="w-100 text-center mt-2">
            <Link
              style={{
                color: "#b2afaf",
                cursor: "pointer",
                textDecoration: "none",
              }}
              to="/"
            >
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
