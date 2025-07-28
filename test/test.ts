import express, { Express } from 'express';
import errorHandler, { NisixError, NisixErrorCode, NisixErrorStatus } from '../src/index';

const app: Express = express();

app.get('/custom-error', (req, res, next) => {
  throw new NisixError('Test Error', NisixErrorStatus.BadRequest, { test: 'test' });
});

app.get('/unauthorized', (req, res, next) => {
  // When specific error code is provided then no need to set the code.
  throw new NisixError(NisixErrorCode.Unauthorized);
});
app.get('/unauthorized-custom-status-code', (req, res, next) => {
  // When specific error code is provided then no need to set the code.
  throw new NisixError(NisixErrorCode.Unauthorized, 455);
});

app.get('/not-found', (req, res, next) => {
  // When specific error code is provided then no need to set the code.
  throw new NisixError(NisixErrorCode.NotFound);
});

app.use(errorHandler({ debug: true }));

app.listen(3000, () => console.log('Server running on port 3000'));
