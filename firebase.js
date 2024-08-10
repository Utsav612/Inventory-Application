import { initializeApp } from "firebase/app"; // Importing the function to initialize the Firebase app
import { getFirestore } from "firebase/firestore"; // Importing the function to get the Firestore instance

// Firebase configuration object containing keys and identifiers for your app
const firebaseConfig = {
  apiKey: "", // API key for accessing Firebase services
  authDomain: "inventory-management-90901.firebaseapp.com", // Domain for Firebase authentication
  projectId: "inventory-management-90901", // Unique identifier for your Firebase project
  storageBucket: "inventory-management-90901.appspot.com", // Cloud storage bucket URL
  messagingSenderId: "784080888659", // Sender ID for Firebase Cloud Messaging
  appId: "1:784080888659:web:97645de0d108538b8e77a6", // Unique identifier for your Firebase app
};

// Initialize Firebase with the configuration object
const app = initializeApp(firebaseConfig); // Initialize the Firebase app and get the app instance
const firestore = getFirestore(app); // Initialize Firestore and get the Firestore instance

// Export the app and Firestore instance for use in other parts of the application
export { app, firestore };
