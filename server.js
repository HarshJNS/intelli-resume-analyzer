const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const { MongoMemoryServer } = require('mongodb-memory-server');

// Verify MongoDB Connection
const connectDB = async () => {
  let MONGODB_URI = process.env.MONGODB_URI;
  try {
    // If not provided or local, start an in-memory DB so the user doesn't need to install MongoDB locally
    if (!MONGODB_URI || MONGODB_URI.includes('localhost')) {
      const mongod = await MongoMemoryServer.create();
      MONGODB_URI = mongod.getUri();
      console.log('⚡ Started In-Memory MongoDB Server:', MONGODB_URI);
    }
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
  }
};

connectDB();

// Routes Configuration
const resumeRoutes = require('./routes/resume.routes');

app.use('/api/resume', resumeRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => res.status(200).json({ status: 'ok', message: 'Backend is running' }));

// Serve React App
app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error', details: err.message });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
