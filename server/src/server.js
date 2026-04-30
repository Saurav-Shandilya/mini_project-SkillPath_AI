import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

import authRoutes from './routes/authRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import communityRoutes from './routes/communityRoutes.js';
import userRoutes from './routes/userRoutes.js';
import jobRoutes from './routes/jobRoutes.js';

const app = express();

// ✅ UPDATED ALLOWED ORIGINS
const allowedOrigins = [
  "http://34.203.150.60:3000",
  "http://skillpathai.in",
  "https://skillpathai.in",
  "http://www.skillpathai.in",
  "https://www.skillpathai.in"
];

// ✅ CLEAN & CORRECT CORS
app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (Postman, mobile apps, etc.)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("❌ Blocked by CORS:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// ✅ Middleware
app.use(express.json());

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);

// ✅ Health check
app.get('/', (req, res) => {
  res.send('SkillPath AI API is running...');
});

// ✅ Config
const PORT = process.env.PORT || 3000; // ⚠️ keep 3000 (your nginx uses this)
const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongodb:27017/skillpath-ai';

// ✅ Error handler
app.use((err, req, res, next) => {
  console.error('SERVER ERROR:', err.stack);
  res.status(500).json({
    message: 'Internal Server Error'
  });
});

// ✅ Start server
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected');
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch(err => console.error('MongoDB connection error:', err));