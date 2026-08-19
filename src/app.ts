import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import masterRouter from './routes';
import { notFoundHandler } from './middlewares/notFoundMiddleware';
import { globalErrorHandler } from './middlewares/errorMiddleware';

const app: Application = express();

// CORS — must be before any routes
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (curl, Postman, server-to-server)
    if (!origin) return callback(null, true);
    const allowed = [
      'http://localhost:4200',
      'http://localhost:4300',
      'http://localhost:3000',
    ];
    if (allowed.includes(origin) || origin.startsWith('http://localhost:')) {
      return callback(null, true);
    }
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount API Routes
app.use('/api', masterRouter);

// Health check
app.get('/', (_req: Request, res: Response) => {
  res.json({ message: 'TaskFlowProto API is running' });
});

// Error Handling
app.use(notFoundHandler);
app.use(globalErrorHandler);

export default app;