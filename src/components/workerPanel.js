import React, { useState, useEffect } from "react";
import { Card, Button, Alert, Container } from "react-bootstrap";
import swal from 'sweetalert';

import { db } from "./../firebase";
import { useAuth } from "../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";
import styles from "./styles.module.css";


export default () => {
	const [orderList, setOrderList] = useState([]);

	const getAllOrders = () => {
		try {
			db.collection("orders").onSnapshot(snap => {
				let data = [];
				snap.forEach(doc => {
					data.push(doc.data())
				});
				setOrderList(data)
			})
		} catch (err) {

		}
	}

	useEffect(()=> {
		getAllOrders();
	},[])

	return (
		<Container>
			<h1>Hellow world</h1>
			{orderList.map(val=> (
				<h1>{val.type}</h1>
			))}
		</Container>
	)
}