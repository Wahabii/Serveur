const auth = require("../middleware/auth");
const express = require("express");
const router = express.Router();

const userController = require('../controllers/user.controller');


/* get the user by the id inside the token  */
router.get("/me", auth, userController.getUser);

/* get the user by the id inside the token  */
router.get("/:id",auth, userController.getUserById);

/* add user  */
router.post("/register", userController.addUser);

/* delete user by id */
router.delete("/:id",auth, userController.deleteUser);

/* update user by id*/
router.put("/:id",auth, userController.updateUser);

/* get all the users */
router.get("/",auth, userController.getUsers);

/* get all the admin users*/
router.get("/admin", auth, userController.getUserAdmin)

/* get number of collection users*/ 
router.get("/count", userController.getCount)

module.exports = router;


