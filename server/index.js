import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Import database and routes
import { initDatabase } from './database/init.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import institutionRoutes from './routes/institutions.js';
import internshipRoutes from './routes/internships.js';
import dashboardRoutes from './routes/dashboard.js';
import { authenticateToken } from './middleware/auth.js';
import { setupSocketHandlers } from './sockets/handlers.js';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: false
}));

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Create uploads directory if it doesn't exist
import fs from 'fs';
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Socket.IO setup
setupSocketHandlers(io);

// Make io available to routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', authenticateToken, userRoutes);
app.use('/api/institutions', authenticateToken, institutionRoutes);
app.use('/api/internships', authenticateToken, internshipRoutes);
app.use('/api/dashboard', authenticateToken, dashboardRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Internship Reservation System API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      users: '/api/users',
      institutions: '/api/institutions',
      internships: '/api/internships',
      dashboard: '/api/dashboard'
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.originalUrl,
    method: req.method
  });
});

// Global error handling
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(isDevelopment && { stack: err.stack })
  });
});

const PORT = process.env.PORT || 3001;

// Initialize database and start server
const startServer = async () => {
  try {
    console.log('🚀 Starting Internship Reservation System Backend...');
    console.log(`📂 Working directory: ${process.cwd()}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    
    // Initialize database
    console.log('📊 Initializing database...');
    await initDatabase();
    console.log('✅ Database initialized successfully');
    
    // Start server
    server.listen(PORT, () => {
      console.log('🎉 Server started successfully!');
      console.log(`📡 API Server: http://localhost:${PORT}`);
      console.log(`🔍 Health Check: http://localhost:${PORT}/api/health`);
      console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
      console.log(`🔌 Socket.IO enabled`);
      console.log('📋 Available endpoints:');
      console.log('   - GET  /api/health');
      console.log('   - POST /api/auth/login');
      console.log('   - POST /api/auth/register/student');
      console.log('   - POST /api/auth/register/institution');
      console.log('');
      console.log('💡 Default admin account:');
      console.log('   Email: admin@sistema.com');
      console.log('   Password: admin123');
      console.log('');
      console.log('🔄 Server is ready to accept connections!');
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('📴 SIGTERM received, shutting down gracefully');
      server.close(() => {
        console.log('✅ Process terminated');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      console.log('📴 SIGINT received, shutting down gracefully');
      server.close(() => {
        console.log('✅ Process terminated');
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('⚠️ Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('⚠️ Uncaught Exception:', error);
  process.exit(1);
});

// Start the server
startServer();

export { io };