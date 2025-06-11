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
  maxPoolSize: 1,
  minPoolSize: 0,
  serverSelectionTimeoutMS: 120000, // 2 minutes
  socketTimeoutMS: 180000, // 3 minutes
  connectTimeoutMS: 120000, // 2 minutes
  retryWrites: true,
  retryReads: true,
  w: 'majority',
  wtimeoutMS: 120000, // 2 minutes
  heartbeatFrequencyMS: 10000, // 10 seconds
  maxIdleTimeMS: 60000 // 1 minute
};

// MongoDB Connection String
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://14appstudiopvt:sm0kFvewjeV22ZI7@cluster0.98baoec.mongodb.net/dgdorm?retryWrites=true&w=majority';

// Global variable to track connection status
let isConnected = false;
let retryCount = 0;
const MAX_RETRIES = 5; // Increased retries

// Connect to MongoDB with retry logic
const connectDB = async () => {
  if (isConnected) {
    console.log('Using existing database connection');
    return;
  }

  try {
    if (!MONGODB_URI) {
      throw new Error('MongoDB URI is not defined');
    }

    // Set mongoose options
    mongoose.set('bufferCommands', false); // Disable command buffering
    mongoose.set('bufferTimeoutMS', 120000); // Set buffer timeout to 2 minutes

    await mongoose.connect(MONGODB_URI, mongooseOptions);
    isConnected = true;
    retryCount = 0; // Reset retry count on successful connection
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    isConnected = false;
    
    // Implement retry logic with longer delays
    if (retryCount < MAX_RETRIES) {
      retryCount++;
      const delay = 2000 * retryCount; // 2s, 4s, 6s, 8s, 10s
      console.log(`Retrying connection (${retryCount}/${MAX_RETRIES}) after ${delay/1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return connectDB();
    }
    
    throw error;
  }
};

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection middleware with longer timeout
app.use(async (req, res, next) => {
  try {
    const connectionPromise = connectDB();
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Connection timeout')), 120000) // 2 minutes timeout
    );
    
    await Promise.race([connectionPromise, timeoutPromise]);
    next();
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({
      success: false,
      message: 'Database connection error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Root route - must be before other routes
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the DG Dorm API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Health check route
app.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    database: dbStatus,
    isConnected,
    retryCount,
    connectionOptions: {
      serverSelectionTimeoutMS: mongooseOptions.serverSelectionTimeoutMS,
      socketTimeoutMS: mongooseOptions.socketTimeoutMS,
      connectTimeoutMS: mongooseOptions.connectTimeoutMS
    }
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

// API Routes
app.use('/api/auth', authRoutes);

// 404 handler - must be after all routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path
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

// Export the Express app for Vercel serverless functions
module.exports = app;
