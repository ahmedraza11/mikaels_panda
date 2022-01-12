import React, { useState, useEffect, useRef } from "react";
import { Button, Container, Modal, Form } from "react-bootstrap";
import { useHistory } from "react-router-dom";

import { useAuth } from "../../Contexts/AuthContext";
import styles from "./styles.module.scss";
import { OrderRow } from "./utils";
import { db } from "../../firebase";

export const WorkerPanel = () => {
  const [orderList, setOrderList] = useState([]);
  const [appStatus, setAppStatus] = useState("Offline");
  const [loading, setLoading] = useState(true);
  const [menuDialog, setMenuDialog] = useState(false);
  const [todayMenu, setTodayMenu] = useState("");
  const { logout } = useAuth();
  const audioRef = useRef();
  const history = useHistory();

  const handleCloseMenuDialog = () => setMenuDialog(false);
  const handleOpenMenuDialog = () => setMenuDialog(true);

  const play = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

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
        setAppStatus(doc.data()?.status);
        setTodayMenu(doc.data()?.todayMenu);
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
    };
  }, []);

  const handleAddMenu = (menu) => {
    try {
      db.collection("app")
        .doc("mikaels_panda")
        .update({
          todayMenu: menu,
        })
        .then(() => {
          handleCloseMenuDialog();
        });
    } catch (err) {}
  };

  return (
    <Container className={styles.workPanel_container}>
      <audio ref={audioRef}>
        {/* <source
          src="https://res.cloudinary.com/duhaflump/video/upload/v1604329046/simple_message.mp3"
          type="audio/mpeg"
        /> */}
      </audio>
      <div className={styles.dashboard_header}>
        <img src={`${window.location.origin}/images/opt_logo.png`} />
      </div>
      <h4>Today's menu: {todayMenu}</h4>
      <Button onClick={handleOpenMenuDialog} style={{ marginBottom: 10 }}>
        Add today's menu
      </Button>
      <Button variant="danger" onClick={() => handleAddMenu("")}>
        Remove
      </Button>
      <MenuDialog
        open={menuDialog}
        handleClose={handleCloseMenuDialog}
        handleSave={handleAddMenu}
      />
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
      </div>
      <footer>
        <img src={`${window.location.origin}/images/opt_logo.png`} />
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
      </footer>
    </Container>
  );
};

const MenuDialog = ({ open, handleClose, handleSave }) => {
  const [menu, setMenu] = useState("");
  return (
    <Modal show={open} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Today's menu</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Control
          value={menu}
          onChange={(e) => setMenu(e.target.value)}
          type="text"
          placeholder="Enter today's menu"
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button
          disabled={menu == ""}
          variant="primary"
          onClick={() => handleSave(menu)}
        >
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
