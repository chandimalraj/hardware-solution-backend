const express = require("express");
const router = express.Router();
const customerController = require("../controller/customerController");
const auth = require("../middleware/auth");
const authSalesRep = require("../middleware/authSalesRep")
const multer = require("multer");
const upload = multer();

router.post("/addCustomer", auth, customerController.addCustomer);
router.post("/editCustomer", auth, customerController.editCustomer);
router.get("/getCustomers", authSalesRep, customerController.getCustomers);
router.get("/getCustomersByName", authSalesRep, customerController.getCustomersByName);
router.delete("/deleteCustomer", auth, customerController.deleteCustomer);
module.exports = router;
