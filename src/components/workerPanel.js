import React, { useState, useEffect,useRef } from "react";
import { Card, Button, Alert, Container } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import swal from "sweetalert";
import moment from "moment";

import { db } from "./../firebase";
import { useAuth } from "../contexts/AuthContext";
import styles from "./styles.module.css";

export default () => {
  const [orderList, setOrderList] = useState([]);
  const [appStatus, setAppStatus] = useState("Offline");
  const [loading, setLoading] = useState(true);
  const { userObject, logout } = useAuth();
  const audioRef = useRef();
  const history = useHistory();

  const play = () => {
    if(audioRef.current){
      
      audioRef.current.play();
    }
    // document.getElementById("audio").play();
  }

  console.log("orderListorderList",orderList)
  const getAllOrders = () => {
    return db
      .collection("orders")
      .orderBy("createdAt", "desc")
      .onSnapshot((snap) => {
        let data = [];
        snap.forEach((doc) => {
          data.push({ id: doc.id, ...doc.data() });
        });
        setOrderList(data);
        play();
        setLoading(false);
      });
  };

 

  const getAppStatus = () => {
    return db
      .collection("app")
      .doc("mikaels_panda")
      .onSnapshot(function (doc) {
        setAppStatus(doc.data().status);
      });
  };

  const handleAppStatus = () => {
    try {
      db.collection("app")
        .doc("mikaels_panda")
        .update({
          status: appStatus == "Online" ? "Offline" : "Online",
        })
        .then(() => {});
    } catch (err) {}
  };

  async function handleLogout() {
    try {
      await logout();
      history.push("/login");
    } catch {}
  }

  useEffect(() => {
    getAppStatus();
    getAllOrders();
    return () => {
      getAppStatus();
      getAllOrders();  
    }
  }, []);

  return (
    <>
      <header className={styles.workerPanelHeader}>
        <h4>Mikaels Panda</h4>
        <div className={styles.workerPanelHeaderBtnContainer}>
          <button
            className={styles.workerPanelHeaderBtnContainerLogoutBtn}
            onClick={handleLogout}
          >
            Log Out
          </button>
          <button
            onClick={handleAppStatus}
            className={
              appStatus == "Online"
                ? styles.appOnlineStatusBtn
                : styles.appOffileStatusBtn
            }
          >
            {appStatus} <div></div>
          </button>
        </div>
      </header>
      <audio ref={audioRef}>
        <source
          src="https://res.cloudinary.com/duhaflump/video/upload/v1604329046/simple_message.mp3"
          type="audio/mpeg"
        />
      </audio>
      <Container>
        <div className={styles.orderRowsContainer}>
          <OrderRow
            loading={loading}
            orderList={orderList || []}
            status="pending"
            title="New"
          />
          <OrderRow
            loading={loading}
            orderList={orderList || []}
            status="preparing"
            title="Preparing"
          />
          <OrderRow
            loading={loading}
            orderList={orderList || []}
            status="completed"
            title="Completed"
          />
        </div>
      </Container>
    </>
  );
};

const OrderRow = ({ loading, orderList, status, title }) => {
  let filteredList = orderList.filter((val) => val.status === status);

  const handleBtnClick = (item, status) => {
    try {
      db.collection("orders")
        .doc(item.id)
        .update({ updatedAt: new Date(), status: status })
        .then((res) => {});
    } catch (err) {}
  };

  return (
    <div className={styles.orderListContainer}>
      <h5>{title} Orders</h5>
      <div className={styles.orderListInnerContainer}>
        {!loading & (filteredList.length < 1) ? (
          title === "New" ? (
            <p className={styles.no_orderMsg}>
              <img
                src="https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/apple/237/male-cook_1f468-200d-1f373.png"
                width="30px"
              />{" "}
              No order's yet 😄:hellow
            </p>
          ) : (
            <p className={styles.no_orderMsg}>No {title} Orders.</p>
          )
        ) : loading ? (
          <p>Loading orders ...</p>
        ) : (
          filteredList.map((val, idx) => (
            <div style={{ display: "flex" }} key={idx}>
              <Card
                className={styles.order_card}
                style={
                  status == "preparing"
                    ? { background: "#ffeaa7" }
                    : status == "completed"
                    ? { background: "#00b894" }
                    : { background: "#fff" }
                }
              >
                <span className={styles.client_name}>{val?.username}</span>
                <span className={styles.order_time}>
                  {moment(val.createdAt.toDate()).calendar()}
                </span>
                <p>{val.type}</p>
              </Card>
              <div className={styles.orderRow_btnContainer}>
                {status == "pending" ? (
                  <button
                    onClick={() => handleBtnClick(val, "preparing")}
                    className={styles.orderRowBtn}
                  >
                    Start
                  </button>
                ) : status == "preparing" ? (
                  <button
                    onClick={() => handleBtnClick(val, "completed")}
                    className={styles.orderRowBtn}
                  >
                    Done
                  </button>
                ) : (
                  <span />
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
