const express = require("express");
const router = express.Router();
const itemController = require("../controller/itemController");
const auth = require('../middleware/auth')
const multer = require('multer');
const upload = multer();``


router.post("/addItem",auth,upload.single('file'),itemController.addItem);
router.post("/addItemImage",auth,upload.single('file'),itemController.uploadItemImage);
router.post("/editItem",auth,upload.single('file'),itemController.editItem);
router.get("/getAllItems",auth,itemController.getItems);
router.get("/getItemsByCategory",auth,itemController.getItemsByCategory);

module.exports = router;
