"use client"; // Ensures the component is treated as a client-side component

import {
  Box,
  Stack,
  Typography,
  Button,
  Modal,
  TextField,
} from "@mui/material"; // Importing Material-UI components for layout and UI elements

import { firestore } from "@/firebase"; // Importing Firestore instance from the Firebase configuration

import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
} from "firebase/firestore"; // Importing Firestore methods for interacting with the database

import { useEffect, useState } from "react"; // Importing React hooks for state management and side effects

// Custom styles for the modal window
const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "#f5f5f5",
  border: "1px solid #ccc",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  gap: 2,
  borderRadius: "8px",
};

// Custom styles for the buttons
const buttonStyle = {
  borderRadius: "20px",
  fontWeight: "bold",
};

// Custom styles for each inventory item box
const inventoryItemStyle = {
  minHeight: "150px",
  borderRadius: "8px",
  padding: "10px 20px",
  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
};

export default function Home() {
  const [inventory, setInventory] = useState([]); // State for storing the inventory items
  const [open, setOpen] = useState(false); // State for controlling the modal's open/close status
  const [itemName, setItemName] = useState(""); // State for storing the name of the new item to be added

  // Function to open the modal
  const handleOpen = () => setOpen(true);
  // Function to close the modal
  const handleClose = () => setOpen(false);

  // Function to add an item to the inventory
  const addItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item); // Create a reference to the document for the item
    const docSnap = await getDoc(docRef); // Fetch the document to check if it already exists
    if (docSnap.exists()) {
      const { quantity } = docSnap.data(); // If the item exists, get its current quantity
      await setDoc(docRef, { quantity: quantity + 1 }); // Increment the quantity by 1
      await updateInventory(); // Update the inventory state
      return;
    } else {
      await setDoc(docRef, { quantity: 1 }); // If the item doesn't exist, create it with quantity 1
    }
    await updateInventory(); // Update the inventory state
  };

  // Function to remove an item from the inventory
  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item); // Create a reference to the document for the item
    const docSnap = await getDoc(docRef); // Fetch the document to check if it exists
    if (docSnap.exists()) {
      const { quantity } = docSnap.data(); // If the item exists, get its current quantity
      if (quantity === 1) {
        await deleteDoc(docRef); // If the quantity is 1, delete the document
      } else {
        await setDoc(docRef, { quantity: quantity - 1 }); // Otherwise, decrement the quantity by 1
      }
    }
    await updateInventory(); // Update the inventory state
  };

  // Function to fetch and update the inventory items from Firestore
  const updateInventory = async () => {
    const snapshot = query(collection(firestore, "inventory")); // Create a query to get all documents from the inventory collection
    const docs = await getDocs(snapshot); // Fetch all the documents
    const inventoryList = []; // Initialize an array to store the inventory items
    docs.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data() }); // Push each item (with its name and quantity) to the array
    });
    setInventory(inventoryList); // Update the inventory state with the fetched items
  };

  // useEffect hook to update the inventory when the component mounts
  useEffect(() => {
    updateInventory();
  }, []);

  return (
    <Box
      width="100vw"
      height="100vh"
      display={"flex"}
      justifyContent={"center"}
      flexDirection={"column"}
      alignItems={"center"}
      gap={2}
      bgcolor={"#e0f7fa"} // Setting the background color of the page
    >
      <Modal
        open={open} // Controls whether the modal is open or not
        onClose={handleClose} // Function to close the modal
        aria-labelledby="modal-modal-title" // Accessibility labels
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          {" "}
          {/* Apply custom styles to the modal box */}
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            gutterBottom
          >
            Add Item
          </Typography>
          <Stack width="100%" direction={"row"} spacing={2}>
            <TextField
              id="outlined-basic"
              label="Item"
              variant="outlined"
              fullWidth
              value={itemName} // Bind the TextField value to the itemName state
              onChange={(e) => setItemName(e.target.value)} // Update itemName when the input changes
            />
            <Button
              variant="contained"
              color="primary"
              sx={buttonStyle}
              onClick={() => {
                addItem(itemName); // Call addItem function with the itemName
                setItemName(""); // Reset the itemName state
                handleClose(); // Close the modal
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Button
        variant="contained"
        color="secondary"
        sx={buttonStyle}
        onClick={handleOpen} // Open the modal when the button is clicked
      >
        Add New Item
      </Button>
      <Box border={"1px solid #333"} borderRadius="8px" overflow="hidden">
        <Box
          width="800px"
          height="100px"
          bgcolor={"#0288d1"}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Typography variant={"h2"} color={"#fff"} textAlign={"center"}>
            Inventory Items
          </Typography>
        </Box>
        <Stack
          width="800px"
          height="300px"
          spacing={2}
          overflow={"auto"}
          padding={2}
        >
          {inventory.map(({ name, quantity }) => (
            <Box
              key={name}
              width="100%"
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}
              bgcolor={"#ffffff"}
              sx={inventoryItemStyle}
            >
              <Typography variant={"h4"} color={"#333"} textAlign={"center"}>
                {name.charAt(0).toUpperCase() + name.slice(1)}{" "}
                {/* Capitalize the first letter of the item name */}
              </Typography>
              <Typography variant={"h5"} color={"#555"} textAlign={"center"}>
                Quantity: {quantity} {/* Display the quantity of the item */}
              </Typography>
              <Button
                variant="contained"
                color="error"
                onClick={() => removeItem(name)} // Remove the item when the button is clicked
              >
                Remove
              </Button>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
