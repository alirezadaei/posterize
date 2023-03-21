const express = require('express');

const {
  getAllNotes,
  createNewNote,
  updateNote,
  deleteNote,
} = require('../controllers/noteController');
const verifyJWT = require('../middlewares/verifyJWT');

const noteRouter = express.Router();

noteRouter.use(verifyJWT);

noteRouter
  .route('/')
  .get(getAllNotes)
  .post(createNewNote)
  .patch(updateNote)
  .delete(deleteNote);

module.exports = noteRouter;
