import {Express} from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import compression from 'compression';
import helmet from 'helmet';
import passport from 'passport';

// winston logger stream
import {stream} from './logger';

const isDev = process.env.NODE_ENV === 'development';
const isProd = process.env.NODE_ENV === 'production';
const isTest = process.env.NODE_ENV === 'test';

export const middlewaresConfig = (app: Express): void => {
  if (isProd) {
    app.use(compression());
    app.use(helmet());
    app.use(morgan('combined'));
  }

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(passport.initialize());

  if (isDev || isTest) {
    app.use(morgan('dev', {stream}));
  }
};
