import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import config from './src/configs/config.js';
import Logging from './src/library/Logging.js';
import routes from './src/routes/index.js';

const app = express();

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined'));

// routes
app.use('/api/v1', routes);

mongoose
  .connect(config.db.MONGODB_URL)
  .then(() => {
    Logging.success('Connect database Successfully!');

    app.listen(config.server.PORT, () => {
      Logging.success(`App start at PORT ${config.server.PORT}`);
    });
  })
  .catch(() => {
    Logging.error('Connect database fail!');
  });
