const express = require("express");
const router = express.Router();
const itemController = require("../controller/itemController");
const auth = require('../middleware/auth')
const multer = require('multer');
const authSalesRep = require("../middleware/authSalesRep");
const upload = multer();``


router.post("/addItem",auth,upload.single('file'),itemController.addItem);
router.post("/addItemImage",auth,upload.single('file'),itemController.uploadItemImage);
router.post("/editItem",auth,upload.single('file'),itemController.editItem);
router.get("/getAllItems",auth,itemController.getItems);
router.get("/getItemsByCategory",authSalesRep,itemController.getItemsByCategory);
router.get("/getItemsByName",authSalesRep,itemController.getItemsByName);
router.delete("/deleteItem",auth,itemController.deleteItem);

module.exports = router;
