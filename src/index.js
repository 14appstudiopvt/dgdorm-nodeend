// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const helmet = require('helmet');
// const morgan = require('morgan');
// const mongoose = require('mongoose');
// const authRoutes = require('./routes/auth');
// require('dotenv').config();


// const app = express();
// const PORT = process.env.PORT || 3000;

// // MongoDB Connection Options
// const mongooseOptions = {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   serverSelectionTimeoutMS: 2000,
//   directConnection: true
// };

// // Connect to MongoDB
// mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://14appstudiopvt:sm0kFvewjeV22ZI7@cluster0.98baoec.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', mongooseOptions)
//   .then(() => {
//     console.log('MongoDB connected: localhost');
//   })
//   .catch(err => {
//     console.error('MongoDB connection error:', err);
//     process.exit(1);
//   });

// // Middleware
// app.use(helmet()); // Security headers
// app.use(cors()); // Enable CORS
// app.use(morgan('dev')); // Logging
// app.use(express.json()); // Parse JSON bodies
// app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// // Routes
// app.use('/api/auth', authRoutes);

// // Basic route
// app.get('/', (req, res) => {
//   res.json({ message: 'Welcome to the API' });
// });

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ message: 'Something went wrong!' });
// });

// // Start server
// app.listen(PORT, () => {
//   console.log('Server is running on port 3000');
// }); 



// Load environment variables first
require('dotenv').config();

// Import required modules
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');

// Import routes
const authRoutes = require('./routes/auth');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB Connection Configuration
const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4
};

// MongoDB Connection String
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://14appstudiopvt:sm0kFvewjeV22ZI7@cluster0.98baoec.mongodb.net/dgdorm?retryWrites=true&w=majority';

// Connect to MongoDB
const connectDB = async () => {
  try {
    if (!MONGODB_URI) {
      throw new Error('MongoDB URI is not defined');
    }
    await mongoose.connect(MONGODB_URI, mongooseOptions);
    console.log('✅ MongoDB connected successfully');
    console.log(`📍 Database: ${mongoose.connection.name}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.error('Full error:', error);
    // Don't exit process in serverless environment
  }
};

connectDB();

// MongoDB connection event handlers
mongoose.connection.on('connected', () => {
  console.log('🔗 Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('🚨 Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('🔌 Mongoose disconnected from MongoDB');
});

// Security and CORS middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : ['http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3000'],
  credentials: true,
  optionsSuccessStatus: 200
}));

// Logging middleware
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Body parsing middleware
app.use(express.json({ limit: '10mb' })); // Parse JSON bodies with size limit
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Parse URL-encoded bodies

// Request timestamp middleware
app.use((req, res, next) => {
  req.timestamp = new Date().toISOString();
  next();
});

// API Routes
app.use('/api/auth', authRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to the DG Dorm API',
    version: '1.0.0',
    timestamp: req.timestamp,
    environment: process.env.NODE_ENV || 'development'
  });
});

// Health check route
app.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    database: dbStatus
  });
});

// API info route
app.get('/api', (req, res) => {
  res.json({
    message: 'DG Dorm API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      health: '/health'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Handle 404 - Route not found
app.use('*', (req, res) => {
  res.status(404).json({ 
    message: 'Route not found',
    timestamp: req.timestamp,
    requestedUrl: req.originalUrl,
    method: req.method
  });
});

// Graceful shutdown handlers
const gracefulShutdown = async (signal) => {
  console.log(`\n🛑 Received ${signal}. Shutting down gracefully...`);
  
  try {
    // Close MongoDB connection
    await mongoose.connection.close();
    console.log('📦 MongoDB connection closed');
    
    // Exit process
    console.log('✅ Server shutdown complete');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during shutdown:', error);
    process.exit(1);
  }
};

// Listen for termination signals
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('🚨 Uncaught Exception:', err);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('🚨 Unhandled Promise Rejection:', err);
  process.exit(1);
});

// Start server
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

// Export app for testing
module.exports = app;