require('express-async-errors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const express = require('express');
const corsOptions = require('./src/config/corsOption');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const { logEvents, logger } = require('./src/middlewares/logger');
const errorHandler = require('./src/middlewares/errorHandler');
const connectDB = require('./src/config/db');
const authRoutes = require('./src/routes/authRoutes');
const noteRoutes = require('./src/routes/noteRoutes');
const userRoutes = require('./src/routes/userRoutes');

const PORT = process.env.PORT || 4000;

dotenv.config();

const app = express();

connectDB();

app.use(logger);

app.use(cors(corsOptions));

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
