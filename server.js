const express = require("express");
const app = express();
require("dotenv").config();
const sequelize = require("./config/database.js");
const port = process.env.PORT || 8000;
const cors = require('cors');

// Enable CORS for all routes
app.use(cors());
app.use(express.json({ extended: false }));
app.use(express.urlencoded({ extended: false }));

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

app.get('/', (req, res) => {
  res.send('Hello, Hardware Solution!');
})
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/salesrep", salesrepRouter);
app.use("/api/item", itemRouter);
app.use("/api/customer", customerRouter);
app.use("/api/order", orderRouter);

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
