import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import masterRouter from './routes';
import { notFoundHandler } from './middlewares/notFoundMiddleware';
import { globalErrorHandler } from './middlewares/errorMiddleware';
import { config } from './config/environment';

const app: Application = express();

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (config.corsOrigins.includes(origin)) {
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