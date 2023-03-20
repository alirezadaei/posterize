import express from 'express';

import {
  getAllNotes,
  createNewNote,
  updateNote,
  deleteNote,
} from '../controllers/noteController';
import { verifyJWT } from '../middlewares/verifyJWT';

const router = express.Router();

router.use(verifyJWT);

router
  .route('/')
  .get(getAllNotes)
  .post(createNewNote)
  .patch(updateNote)
  .delete(deleteNote);

export { router };
