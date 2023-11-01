const express = require("express");
const router = express.Router();
const UsersController = require("../controllers/user-controller")


router.post('/user/:username/journal', UsersController.addjournal);

router.get('/user/:username/journal', UsersController.getjournal);

router.delete('/user/:username/journal/:entryId', UsersController.deleteJournalEntry);

module.exports = router;