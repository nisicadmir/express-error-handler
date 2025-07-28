import express, { Express } from 'express';
import errorHandler from '../src/index';

const app: Express = express();

app.get('/error', (req, res, next) => {
  const err = new Error('Test Error') as any;
  err.status = 400;
  next(err);
});

app.use(errorHandler({ debug: true }));

app.listen(3000, () => console.log('Server running on port 3000'));
