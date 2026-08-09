import { Request, Response, NextFunction } from 'express';
import { config } from '../config/environment';

interface CustomError extends Error {
  statusCode?: number;
  status?: string;
}

export const globalErrorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode = err.statusCode || 500;
  const status = err.status || 'error';

  res.status(statusCode).json({
    status,
    message: err.message,
    ...(config.nodeEnv === 'development' && { stack: err.stack }),
  });
};