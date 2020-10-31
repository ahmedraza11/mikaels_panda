import firebase from "firebase/app"
import "firebase/auth"
import "firebase/firestore"

const app = firebase.initializeApp({
  apiKey: "AIzaSyCfUdBIk__19y79WA0SatHt5rl0_-aGLPg",
  authDomain: "mikaelspanda-31e58.firebaseapp.com",
  databaseURL: "https://mikaelspanda-31e58.firebaseio.com",
  projectId: "mikaelspanda-31e58",
  storageBucket: "mikaelspanda-31e58.appspot.com",
  messagingSenderId: "969732078502",
  appId: "1:969732078502:web:312efb2b06c7982c2ded67",
  measurementId: "G-7ZS4K5ZSTR"
})

export const auth = app.auth()
export const db = app.firestore()
export default app
