const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// Security middleware
app.use(helmet());
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// CORS configuration
// Accept the configured FRONTEND_URL, plus allow other local IPs during development by
// echoing the request origin when it's safe. This prevents the server sending a fixed
// value like 'http://localhost:3000' which would fail when the client is accessed via
// an IP such as 10.5.0.2:3000 (common when using devices on the network or WSL).
const allowedFrontend = process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : ['http://localhost:3000'];

app.use(cors({
  origin: function (origin, callback) {
    // Allow non-browser requests like curl or server-side (no origin)
    if (!origin) return callback(null, true);

    // If the origin exactly matches an allowed frontend URL, accept it
    if (allowedFrontend.indexOf(origin) !== -1) {
      return callback(null, true);
    }

    // During development, allow same-host IP addresses on port 3000 (e.g., http://10.5.0.2:3000)
    if (process.env.NODE_ENV !== 'production') {
      try {
        const url = new URL(origin);
        if (url.port === '3000' && (url.hostname === 'localhost' || /^10\.|^192\.168\.|^127\./.test(url.hostname))) {
          return callback(null, true);
        }
      } catch (e) {
        // malformed origin - reject
      }
    }

    console.warn(`CORS blocked for origin: ${origin}`);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Ensure preflight requests are answered quickly
app.options('*', cors());

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
app.use(morgan('combined'));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/question-paper-generator', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Connected to MongoDB');
})
.catch((error) => {
  console.error('❌ MongoDB connection error:', error);
  process.exit(1);
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/documents', require('./routes/documents'));
app.use('/api/papers', require('./routes/papers'));
app.use('/api/upload', require('./routes/upload'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
