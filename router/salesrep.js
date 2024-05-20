const express = require("express")
const router = express.Router()
const salesRepController = require("../controller/salesrepController");
const auth = require('../middleware/auth')

router.post("/login",salesRepController.loginSalesRep);
router.post("/addSalesRep",auth,salesRepController.addSalesRep);
router.post("/editSalesRep",auth,salesRepController.editSalesRep);
router.get("/getSalesReps",auth,salesRepController.getSalesReps);
router.delete("/deleteSalesRep",auth,salesRepController.deleteSalesRep);

module.exports = router