import { Request, Response } from 'express';

import { noteModel } from '../models/note';
import { userModel } from '../models/user';

// @desc Get all notes
// @route GET /api/notes
// @access Private
const getAllNotes = async (request: Request, response: Response) => {
  // Get all notes from MongoDB
  const notes = await noteModel.find().lean();

  // If no notes
  if (!notes?.length) {
    return response.status(400).json({ message: 'No notes found' });
  }

  // Add username to each note before sending the response
  // See Promise.all with map() here: https://youtu.be/4lqJBBEpjRE
  // You could also do this with a for...of loop
  const notesWithUser = await Promise.all(
    notes.map(async (note) => {
      const user = await userModel.findById(note.user).lean().exec();
      return { ...note, username: user.username };
    })
  );

  response.json(notesWithUser);
};

// @desc Create new note
// @route POST /api/notes
// @access Private
const createNewNote = async (request: Request, response: Response) => {
  const { user, title, text } = request.body;

  // Confirm data
  if (!user || !title || !text) {
    return response.status(400).json({ message: 'All fields are required' });
  }

  // Check for duplicate title
  const duplicate = await noteModel
    .findOne({ title })
    .collation({ locale: 'en', strength: 2 })
    .lean()
    .exec();

  if (duplicate) {
    return response.status(409).json({ message: 'Duplicate note title' });
  }

  // Create and store the new user
  const note = await noteModel.create({ user, title, text });

  if (note) {
    // Created
    return response.status(201).json({ message: 'New note created' });
  } else {
    return response.status(400).json({ message: 'Invalid note data received' });
  }
};

// @desc Update a note
// @route PATCH /api/notes
// @access Private
const updateNote = async (request: Request, response: Response) => {
  const { id, user, title, text, completed } = request.body;

  // Confirm data
  if (!id || !user || !title || !text || typeof completed !== 'boolean') {
    return response.status(400).json({ message: 'All fields are required' });
  }

  // Confirm note exists to update
  const note = await noteModel.findById(id).exec();

  if (!note) {
    return response.status(400).json({ message: 'Note not found' });
  }

  // Check for duplicate title
  const duplicate = await noteModel
    .findOne({ title })
    .collation({ locale: 'en', strength: 2 })
    .lean()
    .exec();

  // Allow renaming of the original note
  if (duplicate && duplicate?._id.toString() !== id) {
    return response.status(409).json({ message: 'Duplicate note title' });
  }

  note.user = user;
  note.title = title;
  note.text = text;
  note.completed = completed;

  const updatedNote = await note.save();

  response.json(`'${updatedNote.title}' updated`);
};

// @desc Delete a note
// @route DELETE /api/notes
// @access Private
const deleteNote = async (request: Request, response: Response) => {
  const { id } = request.body;

  // Confirm data
  if (!id) {
    return response.status(400).json({ message: 'Note ID required' });
  }

  // Confirm note exists to delete
  const note = await noteModel.findById(id).exec();

  if (!note) {
    return response.status(400).json({ message: 'Note not found' });
  }

  const result = await note.deleteOne();

  const reply = `Note '${result.title}' with ID ${result._id} deleted`;

  response.json(reply);
};

export { getAllNotes, createNewNote, updateNote, deleteNote };
