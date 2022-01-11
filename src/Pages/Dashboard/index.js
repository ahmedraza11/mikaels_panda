import React, { useState, useEffect } from "react";
import { Container, Button } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import swal from "sweetalert";
import clsx from "classnames";

import { useAuth } from "../../Contexts/AuthContext";
import { LoaderScreen } from "./../../Components/index";
import { db, auth } from "./../../firebase";
import { CardItem, colorsArr } from "./utils";
import styles from "./styles.module.scss";
import { WorkerPanel } from "./../";

const EmployeeDashboard = () => {
  const [error, setError] = useState("");
  const [appStatus, setAppStatus] = useState("Offline");
  const [ordersDialog, setOrdersDialog] = useState(false);
  const [clickedItem, setClickedItem] = useState("");
  const [itemsList, setItemList] = useState([]);
  const { userObject, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  console.log("orders", orders);

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

  const getAppStatus = () => {
    try {
      db.collection("app")
        .doc("mikaels_panda")
        .onSnapshot(function (doc) {
          setAppStatus(doc.data().status);
        });
    } catch (err) {}
  };

  const getItems = () => {
    try {
      db.collection("items")
        .get()
        .then((snap) => {
          let data = [];
          snap.forEach((doc) => {
            var color = colorsArr[Math.floor(Math.random() * colorsArr.length)];
            data.push({
              id: doc.id,
              ...doc.data(),
              type: doc.data().title,
              backgroundColor: color,
            });
          });
          setItemList(data);
        });
    } catch (err) {}
  };

  const getPendingOrder = () => {
    try {
      db.collection("orders")
        .where("order_by", "==", userObject?.uid)
        .where("status", "!=", "completed")
        .onSnapshot((snap) => {
          let data = [];
          snap.forEach((doc) => {
            data.push({ id: doc.id, ...doc.data() });
          });
          setOrders(data);
        });
    } catch (err) {}
  };

  useEffect(() => {
    getAppStatus();
    getItems();
    getPendingOrder();
  }, []);

  const createOrder = async (type, uid) => {
    setError("");
    swal(`Are you sure you want to order for ${type}?`, {
      buttons: ["Cancel", "Ok"],
    }).then((confirmed) => {
      if (confirmed) {
        if (userObject.displayName) {
          try {
            db.collection("users")
              .doc(uid)
              .get()
              .then((doc) => {
                setClickedItem(type);
                const { verified } = doc.data();
                db.collection("orders")
                  .where("order_by", "==", uid)
                  .where("status", "==", "pending")
                  .get()
                  .then((docs) => {
                    let data = [];
                    docs.forEach((val) => {
                      data.push(val.data());
                    });
                    if (verified) {
                      if (data.length < 2) {
                        setClickedItem(type);
                        db.collection("orders")
                          .add({
                            type: type,
                            createdAt: new Date(),
                            order_by: uid,
                            username: userObject.displayName,
                            status: "pending",
                          })
                          .then(() => {
                            setClickedItem("");
                            swal("Order Successfully created!", "", "success");
                          })
                          .catch((err) => {
                            setClickedItem("");
                            alert("Error Error!", err);
                          });
                      } else {
                        swal(
                          "Order Limit Exeption ♨️",
                          "Your orders are > than 3, await till your orders resolved 🤪"
                        );
                        setClickedItem("");
                      }
                    } else {
                      swal(
                        "Sorry! You are not verified user!",
                        "Kindly contact your admin for being verified",
                        "error"
                      );
                      setClickedItem("");
                    }
                  });
              });
          } catch {
            setClickedItem("");
            setError("Failed to log out");
          }
        } else {
          swal(
            "For what name should I know you? 🤔",
            "Kindly update you profile name",
            "error"
          );
        }
      }
    });
  };

  return (
    <>
      <div
        className={clsx(styles.dashboard_container, {
          [styles.ordersDialog]: ordersDialog,
        })}
      >
        <div className={styles.dashboard_header}>
          <img src={`${window.location.origin}/images/opt_logo.png`} />
        </div>
        <Container className={styles.dashboard_inner_container}>
          <div className={styles.mainContainer}>
            <div className={styles.portalStatusContainer}>
              <p className={styles.portalStatusText}>
                Portal is {appStatus}{" "}
                <div
                  className={
                    appStatus == "Online"
                      ? styles.onlineCircle
                      : styles.offlineCircle
                  }
                />
              </p>
              <Button onClick={() => setOrdersDialog(true)}>
                Orders {orders.length}
              </Button>
            </div>
            <h3>
              Hi 👋{" "}
              {userObject && userObject.displayName
                ? userObject.displayName
                : "Buddy"}
              , What you'd like to have:
            </h3>
            <div className={styles.order_cards_container}>
              {itemsList.map((val, idx) =>
                appStatus == "Online" ? (
                  <CardItem
                    createOrder={createOrder}
                    key={idx}
                    val={val}
                    userObject={userObject}
                    clickedItem={clickedItem}
                  />
                ) : (
                  <CardItem key={idx} val={val} dumbed />
                )
              )}
            </div>
          </div>
        </Container>
        <footer className={styles.footer}>
          <img
            src={`${window.location.origin}/images/opt_logo.png`}
            style={{ width: "103px" }}
          />
          <div className={styles.bottomBar}>
            <Link className={styles.footer_btn} to="/update-profile">
              Update Profile
            </Link>
            <span className={styles.footer_btn} onClick={handleLogout}>
              Log Out
            </span>
          </div>
        </footer>
      </div>
      {ordersDialog && (
        <div className={styles.ordersDialogContent}>
          <div className={styles.innerContainer}>
            <img
              src={`${window.location.origin}/images/output-onlinegiftools.gif`}
            />
            <h3>Order Status</h3>
            {orders.map((x) => {
              return (
                <div
                  className={clsx(
                    styles.item,
                    {
                      [styles.itemPending]: x.status == "pending",
                    },
                    { [styles.itemPreparing]: x.status == "preparing" }
                  )}
                >
                  <p>{x.type}</p> <p>{x.status}</p>
                </div>
              );
            })}
            <span onClick={() => setOrdersDialog(false)}>Close</span>
          </div>
        </div>
      )}
    </>
  );
};

export const Dashboard = () => {
  const [currentUser, setCurrentUser] = useState();
  const [userObject, setUserObject] = useState();
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    let unSubUserSnap;
    setLoader(true);
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUserObject(user);
      if (user) {
        unSubUserSnap = db
          .collection("users")
          .where("user_id", "==", user.uid)
          .onSnapshot((snap) =>
            snap.forEach((val) => {
              setCurrentUser(val.data());
              setLoader(false);
            })
          );
      }
      setLoader(false);
    });

    return () => {
      unsubscribe();
      unSubUserSnap();
    };
  }, []);

  if (loader || !currentUser) {
    return <LoaderScreen />;
  } else {
    return currentUser?.role == "employee" ? (
      <EmployeeDashboard />
    ) : (
      <WorkerPanel />
    );
  }
};
