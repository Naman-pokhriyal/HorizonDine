require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const socket = require("socket.io");
const cors = require("cors");
const path = require("path");

const tableRoutes = require("./routes/tableRoutes");
const orderRoutes = require("./routes/orderRoutes");
const menuRoutes = require("./routes/menuRoutes");
const custRoutes = require("./routes/custRoutes");

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected!"))
  .catch((err) => console.error("MongoDB connection error: " + err));

const app = express();
app.use(cors());
app.use(express.json());

app.use("/tables", tableRoutes);
app.use("/orders", orderRoutes);
app.use("/menu", menuRoutes);
app.use("/customers", custRoutes);

const server = app.listen(process.env.PORT, "0.0.0.0", () => {
  console.log("Running on Port:", process.env.PORT);
});

const io = socket(server, {
  cors: "*",
  method: ["GET", "POST"],
});

app.set("io", io);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
