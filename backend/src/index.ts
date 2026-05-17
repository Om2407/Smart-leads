import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import authRoutes from './routes/auth';
import leadsRoutes from './routes/leads';
import { errorHandler, notFound } from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'OK', message: 'Smart Leads API running' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadsRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
const start = async (): Promise<void> => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 Health: http://localhost:${PORT}/health`);
  });
};

start();
