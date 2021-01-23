const auth = require("../middleware/auth");
const express = require("express");
const router = express.Router();

const serviceController = require('../controllers/service.controller');





/* update and increment service by id*/
router.put("/:id", auth , serviceController.updateUser);




router.post("/register", auth, serviceController.addService);




module.exports = router;