import React, { useRef, useState } from "react";
import { Form, Button, Card, Alert,Spinner } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";

import styles from "./styles.module.css";

export default function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login, currentUser } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);
      await login(emailRef.current.value, passwordRef.current.value);
      history.push("/");
    } catch {
      setError("Failed to log in");
    }

    setLoading(false);
  }

  return (
    <div style={{background:"black", height:"100vh",display:"flex",justifyContent:"center",alignItems:"center"}}>
      <div className={styles.loginCard}>
        <Card style={{ background: "black" }}>
          <img
            src={`${window.location.origin}/images/logo-black-svg.png`}
            style={{ width: "210px", marginBottom: "50px" }}
          />
          <Card.Body style={{ background: "black" }}>
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
              <Button
                style={{ background: "#4f4f4f", border: "none" }}
                disabled={loading}
                className="w-100"
                type="submit"
              >
                Log In
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
          Need an account?{" "}
          <Link
            className={styles.link}
            to="/signup"
            style={{ color: "#b2afaf", fontWeight: 600 }}
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
