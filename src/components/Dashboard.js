import React, { useState } from "react";
import { Card, Button, Alert, Container } from "react-bootstrap";
import swal from 'sweetalert';

import { db } from "./../firebase";
import { useAuth } from "../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";
import styles from "./styles.module.css";

const items = [
  {
    title: "Chai | Tea",
    type: "tea",
    backgroundColor: "#00cec9",
  },
  {
    title: "Coffee",
    type: "coffee",
    backgroundColor: "#ff7675",
  },
  {
    title: "Black Coffee",
    type: "black_coffee",
    backgroundColor: "#00b894",
  },
  {
    title: "Green tea",
    type: "green_tea",
    backgroundColor: "#a29bfe",
  },
  {
    title: "Come to me",
    type: "come",
    backgroundColor: "#e17055",
  },
];

export default function Dashboard() {
  const [error, setError] = useState("");
  const { userObject, logout } = useAuth();
  const history = useHistory();

  async function handleLogout() {
    setError("");
    try {
      await logout();
      history.push("/login");
    } catch {
      setError("Failed to log out");
    }
  }

  const createOrder = async (type, uid) => {
    setError("");
    try {
      db.collection("users").doc(uid).get().then(doc => {
        const { verified } = doc.data();
        db.collection("orders").where("order_by", "==", uid).where("status", "==", "pending").get().then(docs => {
          let data = [];
          docs.forEach(val => {
            data.push(val.data())
          });
          if (verified) {
            if(data.length < 10) {
              db.collection("orders")
              .add({
                type: type,
                createdAt: new Date(),
                order_by: uid,
                status: "pending",
              })
              .then(() => {
                swal("Order Successfully created!", "", "success");
              }).catch(err => {
                alert("Error Error!", err);
              })
            }else {
              swal("Order Limit Exeption ♨️", "Your orders are > than 3, await till your orders resolved 🤪");
            }
          } else {
            swal("Sorry! You are not verified user!", "Kindly contact your admin for being verified", "error");
          }
        })
      })
    } catch {
      setError("Failed to log out");
    }

  };
  console.log("userObjectuserObject", userObject)

  return (
    <>
      <Container>
        <div className={styles.mainContainer}>
          <h3>Hi 👋 {userObject && userObject.displayName ? userObject.displayName : "Buddy"}!, What you'd like to have:</h3>
          <div className={styles.cardContainer}>
            {items.map((val, idx) => (
              <Card
                style={{ width: "18rem", backgroundColor: val.backgroundColor }}
                className={styles.card}
                key={idx}
                onClick={() => createOrder(val.type, userObject.uid)}
              >
                <div className={styles.cardBody}>
                  <h3>{val.title}</h3>
                </div>
              </Card>
            ))}
          </div>
        </div>
        <div className={styles.bottomBar}>
          <Link to="/update-profile" className="btn btn-primary mr-3">
            Update Profile
          </Link>
          <div className="text-center">
            <Button
              style={{ background: "#ff7675", border: "none" }}
              onClick={handleLogout}
            >
              Log Out
            </Button>
          </div>
        </div>
      </Container>
    </>
  );
}
