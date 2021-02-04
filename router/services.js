const auth = require("../middleware/auth");
const express = require("express");
const router = express.Router();

const serviceController = require('../controllers/service.controller');





/* update and increment service by id*/
router.put("/:id", auth , serviceController.updateUser);

/* add service */

router.post("/register", auth, serviceController.addService);

/* send SMS */
router.post("/send",serviceController.sendSMS);

module.exports = router;