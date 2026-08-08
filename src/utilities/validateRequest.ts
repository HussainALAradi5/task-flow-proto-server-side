import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError, ZodIssue } from 'zod';

/**
 * Generic middleware to validate incoming requests against a schema.
 */
export const validateRequest = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Validates body, query, and params dynamically
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          status: 'error',
          message: 'Validation failed',
          // Explicitly typing 'e' as ZodIssue fixes the TypeScript error
          errors: error.issues.map((e: ZodIssue) => ({ 
            field: e.path.join('.'), 
            message: e.message 
          }))
        });
        return;
      }
      next(error);
    }
  };
};