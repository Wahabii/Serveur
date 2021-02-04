const auth = require("../middleware/auth");
const express = require("express");
const router = express.Router();

const categorieController = require('../controllers/categorie.controller');




/* add categorie */
router.post("/register", auth , categorieController.addCategorie);

/* affected categorie by partner */
router.post("/affected", auth,categorieController.affectCategorie);

/* get all the categories */
router.get("/", auth , categorieController.getCategories);



module.exports = router;


