const express = require("express");
const app = express();
require("dotenv").config();
const sequelize = require("./config/database.js");
const port = process.env.PORT || 8000;

app.use(express.json({ extended: false }));
app.use(express.urlencoded({ extended: false }));

// Enable CORS for all requests
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE,OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, auth-token"
  );
  next();
});

const User = require("./models/user.model");
const Salesrep = require("./models/salesrep.model");
const Item = require("./models/item.model");
const Customer = require("./models/customer.model");
const OrderItems = require("./models/order_items.model");

const userRouter = require("./router/user");
const salesrepRouter = require("./router/salesrep");
const authRouter = require("./router/auth");
const itemRouter = require("./router/item");
const customerRouter = require("./router/customer");
const orderRouter = require("./router/order");

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/salesrep", salesrepRouter);
app.use("/api/item", itemRouter);
app.use("/api/customer", customerRouter);
app.use("/api/order", orderRouter);

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
