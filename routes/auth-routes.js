const express = require("express");
const router = express.Router();
const UsersController = require("../controllers/user-controller")

// Signup route
router.post('/signup', UsersController.signup);
  
  
router.post('/login', UsersController.login);
  

router.get('/logout', UsersController.logout);
  
  
router.get('/is-logged-in', UsersController.isloggedin);

module.exports = router

