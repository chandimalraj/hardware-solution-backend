const express = require("express");
const router = express.Router();
const orderController = require("../controller/orderController");
const auth = require('../middleware/auth')
const multer = require('multer');
const authSalesRep = require("../middleware/authSalesRep");
const upload = multer();


router.post("/addOrder",authSalesRep,orderController.addOrder);
router.post("/editOrder",auth,orderController.editOrder);

module.exports = router;
