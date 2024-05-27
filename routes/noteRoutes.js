const express = require('express');
const router = express.Router();
const notesConntroller = require('../controllers/notesController');
const verifyJWT = require('../middleware/verifyJWT');

router.use(verifyJWT)

router.route('/')
    .get(notesConntroller.getAllNotes)
    .post(notesConntroller.createNewNote)
    .patch(notesConntroller.updateNote)
    .delete(notesConntroller.deleteNote)

module.exports = router;