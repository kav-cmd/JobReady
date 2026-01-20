import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import aiRoutes from './routes/ai.routes.js';
import courseRoutes from './routes/course.routes.js';
import videoProgressRoutes from './routes/videoProgress.routes.js';
import { isLlamaConfigured } from './services/llama.service.js';

dotenv.config();

// Fail loudly if Groq API key is missing
const checkGroqConfig = () => {
  const apiKey = process.env.LLAMA_API_KEY;
  const apiUrl = process.env.LLAMA_API_URL;
  const model = process.env.LLAMA_MODEL;
  
  if (!apiKey || !apiUrl || !model) {
    console.error('❌ [SERVER] Groq API configuration is missing!');
    console.error('   Required environment variables:');
    console.error('   - LLAMA_API_KEY');
    console.error('   - LLAMA_API_URL');
    console.error('   - LLAMA_MODEL');
    console.error('   Please set these in your .env file and restart the server.');
    process.exit(1);
  }
  
  if (!isLlamaConfigured()) {
    console.error('❌ [SERVER] Groq API configuration is invalid!');
    process.exit(1);
  }
  
  console.log('✅ [SERVER] Groq API configuration validated');
};

checkGroqConfig();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/progress', videoProgressRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
