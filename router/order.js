const express = require("express");
const router = express.Router();
const orderController = require("../controller/orderController");
const auth = require('../middleware/auth')
const multer = require('multer');
const authSalesRep = require("../middleware/authSalesRep");
const upload = multer();

router.post("/addOrder",authSalesRep,orderController.addOrder);
router.post("/editOrder",auth,orderController.editOrder);
router.get("/getOrders",authSalesRep,orderController.getOrders);
router.get("/getItemsByOrder",authSalesRep,orderController.getItemsByOrder);
router.get("/getOrdersByCustomerCode",auth,orderController.getOrdersByCustomerCode);
router.get("/getOrdersBySalesRep",auth,orderController.getOrdersBySalesRep);



module.exports = router;
