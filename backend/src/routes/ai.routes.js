import express from 'express';
import {
  aiTutor,
  healthCheck,
  generateQuiz,
  generateNotes,
  resolveDoubt
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
 * GET /api/ai/health
 * Health check for AI service
 */
router.get('/health', healthCheck);

export default router;
