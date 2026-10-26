import { Request, Response, NextFunction } from 'express';
import { config } from '../config/environment';

interface CustomError extends Error {
  statusCode?: number;
  status?: string;
  name: string;
  code?: number;
}

export const globalErrorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode = err.name === 'CastError' ? 400 : err.code === 11000 ? 409 : err.statusCode || 500;
  const status = err.status || 'error';

  res.status(statusCode).json({
    status,
    message: err.name === 'CastError'
      ? 'Invalid resource identifier'
      : err.code === 11000
        ? 'A resource with the same unique value already exists'
        : statusCode >= 500 && config.nodeEnv === 'production'
          ? 'Internal server error'
          : err.message,
    ...(config.nodeEnv === 'development' && { stack: err.stack }),
  });
};
