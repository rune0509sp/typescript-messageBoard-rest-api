import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import {constants} from './configs/constants';
import {middlewaresConfig} from './configs/middlewares';
import {errorMiddleware} from './middlewares';
import {AppRouter} from './AppRouter';

// Routes controllers
import './controllers/UserController';
import './controllers/PostController';

// export express app
export const app = express();

app.set('port', constants.PORT || 3000);

middlewaresConfig(app);

// solve CORS error
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers',
    'Content-Type, Authorization');
  next();
});

// Router
app.use(AppRouter.getInstance());

// error middleware
app.use(errorMiddleware);

