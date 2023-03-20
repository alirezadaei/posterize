require('express-async-errors');
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import { logEvents, logger } from './src/middlewares/logger';
import { errorHandler } from './src/middlewares/errorHandler';
import { connectDB } from './src/config/db';
import { router as authRoutes } from './src/routes/authRoutes';
import { router as noteRoutes } from './src/routes/noteRoutes';
import { router as userRoutes } from './src/routes/userRoutes';

const PORT = process.env.PORT || 4000;

dotenv.config();

const app = express();

connectDB();

app.use(logger);

app.use(cors({ credentials: true, optionsSuccessStatus: 200 }));

app.use(express.json());

app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notes', noteRoutes);

app.use(errorHandler);

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

mongoose.connection.on('error', (err) => {
  console.log(err);
  logEvents(
    `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
    'mongoErrLog.log'
  );
});
