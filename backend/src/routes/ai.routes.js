import express from 'express';
import {
  aiTutor,
  healthCheck,
  generateQuiz,
  generateNotes,
  resolveDoubt,
  youtubeSummary
} from '../controllers/ai.controller.js';

const router = express.Router();

/**
 * POST /api/ai/tutor
 * Main AI Tutor endpoint - supports all modes (quiz, notes, doubt)
 * 
 * Request body:
 * {
 *   "courseName": "Data Entry Specialist",
 *   "topic": "Keyboard Shortcuts",
 *   "userQuery": "How to use Ctrl+Z?",  // Optional, required for "doubt" mode
 *   "mode": "quiz|notes|doubt"
 * }
 */
router.post('/tutor', aiTutor);

/**
 * POST /api/ai/quiz
 * Generate quiz/MCQs for a topic
 * 
 * Request body:
 * {
 *   "courseName": "Data Entry Specialist",
 *   "topic": "Keyboard Shortcuts"
 * }
 */
router.post('/quiz', generateQuiz);

/**
 * POST /api/ai/notes
 * Generate short study notes for a topic
 * 
 * Request body:
 * {
 *   "courseName": "Data Entry Specialist",
 *   "topic": "Keyboard Shortcuts"
 * }
 */
router.post('/notes', generateNotes);

/**
 * POST /api/ai/doubt
 * Resolve student doubts/questions
 * 
 * Request body:
 * {
 *   "courseName": "Data Entry Specialist",
 *   "topic": "Keyboard Shortcuts",
 *   "userQuery": "How do I use keyboard shortcuts efficiently?"
 * }
 */
router.post('/doubt', resolveDoubt);

/**
 * POST /api/ai/summarize
 * POST /api/ai/youtube-summary
 * Generate AI summary for YouTube video
 * 
 * Request body:
 * {
 *   "youtubeUrl": "https://youtube.com/watch?v=...",
 *   "youtubeId": "video_id",  // Alternative to youtubeUrl
 *   "title": "Video Title",    // Optional
 *   "language": "en"           // Optional: en, hi, kn, hinglish
 * }
 */
router.post('/summarize', youtubeSummary);
router.post('/youtube-summary', youtubeSummary);

/**
 * GET /api/ai/health
 * Health check for AI service
 */
router.get('/health', healthCheck);

export default router;
