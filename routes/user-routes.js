const express = require("express");
const router = express.Router();
const UsersController = require("../controllers/user-controller")


router.post('/user/:username/journal', UsersController.addjournal);

router.get('/user/:username/journal', UsersController.getjournal);

router.delete('/user/:username/journal/:entryId', UsersController.deleteJournalEntry);

router.put('/user/:username/about', UsersController.updateAbout);

router.get('/user/:username/about', UsersController.getAbout);

module.exports = router;
