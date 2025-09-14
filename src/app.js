import express from 'express';
import cookieParser from 'cookie-parser';
import logger from '#config/logger.js';
import authRoutes from '#routes/auth.routes.js';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.get('/', (req, res) => {
  logger.info('Hello from Acquisition!');
  res.json({ message: 'Acquisitions API Server is running!' });
});

app.get('/health', (req, res) => {
  logger.info('Health check requested');
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.get('/api', (req, res) => {
  res.json({ message: 'API is working' });
});

// Auth routes
app.use('/api/auth', authRoutes);

export default app;
