import logger from '#config/logger.js';
import securityMiddleware from '#middleware/security.middleware.js';
import authRoutes from '#routes/auth.routes.js';
import usersRoutes from '#routes/users.routes.js';
import cookieParser from 'cookie-parser';
import express from 'express';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(securityMiddleware);

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

// Users routes
app.use('/api/users', usersRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

export default app;
