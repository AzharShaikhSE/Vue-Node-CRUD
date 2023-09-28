// Import necessary modules
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

// Initialize express app
const app = express();

// Set the port for the server
const port = process.env.PORT || 3000;

// Use cors and bodyParser middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection URL and database name
const mongoURL = "mongodb://localhost:27017";
const dbName = "test";

// MongoDB client reference
let db;

// Create Instance of MongoClient for mongodb
const client = new MongoClient(mongoURL);

// Connect to database
client
  .connect()
  .then(() => {
    console.log("Connected Successfully");
    db = client.db(dbName); // Save the database connection
  })
  .catch((error) => console.log("Failed to connect", error));

// Define a route to retrieve all orders
app.get("/api/orders", (req, res) => {
  db.collection("orders")
    .find({})
    .toArray()
    .then(orders => {
      res.json(orders);
    })
    .catch(err => {
      console.error("Error fetching orders:", err);
      res.status(500).json({ error: "Internal Server Error" });
    });
});

// Define a route to create a new order
app.post("/api/orders", (req, res) => {
  const newOrder = req.body;
  db.collection("orders")
    .insertOne(newOrder)
    .then(result => {
      res.json("Successfully created order");
    })
    .catch(err => {
      console.error("Error creating order:", err);
      res.status(500).json({ error: "Internal Server Error" });
    });
});

// Define a route to update an existing order
app.put("/api/orders/:id", (req, res) => {
  const orderId = req.params.id;
  const updatedOrder = req.body;
  db.collection("orders")
    .updateOne({ orderId: orderId }, { $set: updatedOrder })
    .then(result => {
      res.json(updatedOrder);
    })
    .catch(err => {
      console.error("Error updating order:", err);
      res.status(500).json({ error: "Internal Server Error" });
    });
});

// Define a route to delete an order
app.delete("/api/orders/:id", (req, res) => {
  const orderId = req.params.id;
  db.collection("orders")
    .deleteOne({ orderId: orderId })
    .then(result => {
      res.json({ message: "Order deleted" });
    })
    .catch(err => {
      console.error("Error deleting order:", err);
      res.status(500).json({ error: "Internal Server Error" });
    });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
