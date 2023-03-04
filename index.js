import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import config from './src/configs/config.js';
import Logging from './src/library/Logging.js';
import routes from './src/routes/index.js';

const app = express();

if (config.server.NODE_ENV && config.server.NODE_ENV === 'development') {
  app.use(
    cors({
      origin: 'http://localhost:3000',
      credentials: true,
    })
  );
  app.use(morgan('dev'));
} else {
  app.use(
    cors({
      origin: 'https://yshop.vercel.app',
      credentials: true,
    })
  );
  app.use(morgan('combined'));
}

app.disable('x-powered-by');

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use('/api/v1', routes);

//route not found
app.all('*', (req, res) =>
  res.status(404).json({ status: 404, msg: 'Resource Not Found!' })
);

// connect database
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
