import { Request, Response, NextFunction } from 'express';

import AppError from '@shared/errors/AppError';

export default function globalExceptionHandler(
  err: Error,
  req: Request,
  res: Response,
  _: NextFunction,
): Response {
  if (err instanceof AppError) {
    return res.status(err.statusCode).send({
      status: 'Error',
      message: err.message,
    });
  }

  console.log(err);

  return res.status(500).send({
    status: 'Error',
    message: 'Internal server error',
  });
}
