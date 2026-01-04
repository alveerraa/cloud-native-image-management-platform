/**
 * Cloud-Native Image Upload Platform - Backend Server
 * Handles image uploads to AWS S3 with production-ready error handling
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const uploadRoutes = require('./routes/upload');

// Load environment variables
dotenv.config();

const app = express();

/**
 * IMPORTANT CHANGE:
 * We moved from 5000 → 5001 to avoid port conflicts
 */
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint (used by Docker)
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'image-platform-backend'
  });
});

// API routes
app.use('/api', uploadRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Cloud Image Platform API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      upload: 'POST /api/upload',
      images: 'GET /api/images'
    }
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Backend server running on port ${PORT}`);
  console.log(`📦 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`☁️  AWS Region: ${process.env.AWS_REGION || 'us-east-1'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});
