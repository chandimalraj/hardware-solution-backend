const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const auth = require('../middleware/auth')

router.get("/",auth,userController.getUser);
router.post('/adduser',userController.addUser)
router.post('/addSalesRep',auth,userController.addSalesRep)
router.get('/getAllSalesReps',auth,userController.getSalesReps)

module.exports = router;
