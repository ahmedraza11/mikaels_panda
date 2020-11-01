import React, { useState, useEffect } from "react";
import { Card, Button, Alert, Container } from "react-bootstrap";
import swal from 'sweetalert';
import moment from 'moment'

import { db } from "./../firebase";
import { useAuth } from "../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";
import styles from "./styles.module.css";


export default () => {
	const [orderList, setOrderList] = useState([]);
	const [loading, setLoading] = useState(true);

	const getAllOrders = () => {
		try {
			db.collection("orders").orderBy('createdAt', 'desc').onSnapshot(snap => {
				let data = [];
				snap.forEach(doc => {
					data.push(doc.data())
				})
				setOrderList(data)
				setLoading(false)
			})
		} catch (err) {
			setLoading(false)
		}
	}

	useEffect(() => {
		getAllOrders();
	}, [])

	return (
		<>
			<header className={styles.workerPanelHeader}>
				<h4>Mikaels Panda</h4>
			</header>
			<Container>
				<div className={styles.orderRowsContainer}>
					<OrderRow loading={loading} orderList={orderList || []} status="pending" title="New" />
					<OrderRow loading={loading} orderList={orderList || []} status="preparing" title="Pending" />
					<OrderRow loading={loading} orderList={orderList || []} status="completed" title="Completed" />
				</div>
			</Container>
		</>
	)
}

const OrderRow = ({ loading, orderList, status, title }) => {
	let filteredList = orderList.filter(val => val.status === status)
	return (
		<div className={styles.orderListContainer}>
			<h5>{title} Orders</h5>
			{(!loading & filteredList.length < 1)
				? <p className={styles.no_orderMsg}><img src="https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/apple/237/male-cook_1f468-200d-1f373.png" width="30px" /> No order's yet 😄</p>
				: loading ? <p>Loading orders ...</p>
					: filteredList.map(val => (
						<div>
							<Card className={styles.order_card}>
								<span className={styles.client_name}>{val?.username}</span>
								<span className={styles.order_time}>{moment(Date(val.createdAt)).startOf('hour').fromNow()}</span>
								<p>{val.type}</p>
							</Card>
						</div>
					))}
		</div>
	)
}