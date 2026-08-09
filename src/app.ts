import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import masterRouter from './routes';

const app: Application = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Mount API Routes
app.use('/api', masterRouter);

// Test Route
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'TaskFlowProto TypeScript API is running...' });
});

// 404 Handler
app.all('*', (req: Request, res: Response): void => {
  res.status(404).json({ status: 'error', message: `Can't find ${req.originalUrl} on this server!` });
});

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction): void => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    status: err.status || 'error',
    message: err.message,
  });
});

export default app;