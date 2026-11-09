import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { Request, Response } from 'express';
import errorHandler, { NisixError, NisixErrorCode, NisixErrorStatus } from '../src/index';

test('uses the default status for Forbidden and Unauthorized', () => {
  assert.equal(new NisixError(NisixErrorCode.Forbidden).status, NisixErrorStatus.Forbidden);
  assert.equal(new NisixError(NisixErrorCode.Unauthorized).status, NisixErrorStatus.Forbidden);
});

test('uses 409 for DuplicateEntry and respects an explicit status', () => {
  assert.equal(new NisixError(NisixErrorCode.DuplicateEntry).status, NisixErrorStatus.Conflict);
  assert.equal(new NisixError(NisixErrorCode.DuplicateEntry, 455).status, 455);
});

test('passes the original error to the next handler when headers are sent', () => {
  const err = new Error('The stream failed');
  const req = {} as Request;
  const res = { headersSent: true } as Response;
  const forwardedErrors: unknown[] = [];

  errorHandler()(err, req, res, (forwardedError: unknown) => {
    forwardedErrors.push(forwardedError);
  });

  assert.equal(forwardedErrors.length, 1);
  assert.equal(forwardedErrors[0], err);
});
