# Express Error Handler

A customizable error handler for Express applications, providing structured error responses with support for TypeScript.

## Installation

To install the package, use npm:

```bash
npm install @nisix/express-error-handler
```

## Usage

### Importing the Error Handler

First, import the error handler into your Express application:

```typescript
import express from 'express';
import nisixErrorHandler from '@nisix/express-error-handler';

const app = express();

// Your routes and middleware here

// Use the error handler as the last middleware
app.use(nisixErrorHandler({ debug: true }));
```

### Creating Custom Errors

You can create custom errors using the `NisixError` class. This allows you to specify error codes and additional metadata:

```typescript
import { NisixError, NisixErrorCode, NisixErrorStatus } from '@nisix/express-error-handler';

app.get('/example', (req, res, next) => {
  try {
    // Predefined error. Status will be used 404
    throw new NisixError(NisixErrorCode.NotFound);
    // Additional data in response.
    throw new NisixError(NisixErrorCode.NotFound, undefined, { additionalMetadata: 123 });
    // Override default status code for NotFound.
    throw new NisixError(NisixErrorCode.NotFound, 405, { additionalMetadata: 123 });
    // Use built-in status code.
    throw new NisixError(NisixErrorCode.NotFound, NisixErrorStatus.BadRequest);
    // Use custom error with 400 status.
    throw new NisixError('Custom_Code_Goes_Here', NisixErrorStatus.BadRequest);
  } catch (error) {
    next(error);
  }
});
```

### Error Codes

The error handler supports a wide range of HTTP status codes, including:

- `BadRequest` (400)
- `Unauthorized` (401)
- `Forbidden` (403)
- `NotFound` (404)
- `InternalServerError` (500)
- And many more...

Refer to the `NisixErrorCode` enum for a complete list of supported error codes.

## Configuration

The error handler can be configured with the following options:

- `debug`: A boolean indicating whether to include stack traces in error responses. Defaults to `true` in non-production environments.

## Example

Here's a complete example of using the error handler in an Express application:

```typescript
import express from 'express';
import nisixErrorHandler, { NisixError, NisixErrorCode } from '@nisix/express-error-handler';

const app = express();

app.get('/example', (req, res, next) => {
  try {
    // Simulate an error
    throw new NisixError(NisixErrorCode.NotFound, NisixErrorStatus.NotFound, { resource: 'Example' });
  } catch (error) {
    next(error);
  }
});

// Use the error handler
app.use(nisixErrorHandler({ debug: true }));

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
```

## License

This project is licensed under the MIT License.
