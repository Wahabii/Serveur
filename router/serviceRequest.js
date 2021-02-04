
const auth = require("../middleware/auth");
const express = require("express");
const router = express.Router();

const serviceRequestController = require('../controllers/serviceRequest.controller');



/* add serviceRequest by User */
router.post("/register", auth, serviceRequestController.addServiceRequest)








module.exports = router;