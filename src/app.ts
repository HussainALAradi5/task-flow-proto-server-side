import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import masterRouter from './routes';
import { notFoundHandler } from './middlewares/notFoundMiddleware';
import { globalErrorHandler } from './middlewares/errorMiddleware';

const app: Application = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Mount API Routes
app.use('/api', masterRouter);

// Health check test route
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'TaskFlowProto TypeScript API is running...' });
});

// Error Handling Pipeline
app.use(notFoundHandler);
app.use(globalErrorHandler);

export default app;