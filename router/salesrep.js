const express = require("express")
const router = express.Router()
const salesRepController = require("../controller/salesrepController");

router.post("/login",salesRepController.loginSalesRep);

module.exports = router