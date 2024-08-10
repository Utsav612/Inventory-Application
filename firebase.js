import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB7314t_UrZF9MJDwf5sXintjxQcqA6iw8",
  authDomain: "inventory-management-90901.firebaseapp.com",
  projectId: "inventory-management-90901",
  storageBucket: "inventory-management-90901.appspot.com",
  messagingSenderId: "784080888659",
  appId: "1:784080888659:web:97645de0d108538b8e77a6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
export { app, firestore };
