import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/index.js';
import routes from './routes/index.js';

const app = express();
const PORT = process.env.PORT ?? 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', routes);

// Root
app.get('/', (req, res) => {
  res.json({ message: 'Resume AI API' });
});

// Connect to MongoDB (optional); start server either way so upload/analyze work without DB
const start = async () => {
  try {
    await connectDB();
  } catch (err) {
    console.warn('Running without MongoDB. Upload and analyze will work; save/fetch resume and company fit will fail until MongoDB is available.');
  }
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} (${process.env.NODE_ENV ?? 'development'})`);
  });
};

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
