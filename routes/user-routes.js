const express = require("express");
const router = express.Router();
const UsersController = require("../controllers/user-controller")


app.post('/user/:username/journal', UsersController.addjournal);

app.get('/user/:username/journal', UsersController.getjournal);
