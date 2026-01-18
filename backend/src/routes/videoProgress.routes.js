/**
 * Video Progress Routes
 * Endpoints for tracking video completion
 */

import express from 'express';
import * as videoProgressController from '../controllers/videoProgress.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// Mark video as completed (POST)
router.post("/video", verifyToken, videoProgressController.markVideoCompleted);

// Get course progress (GET)
router.get("/course/:courseId", verifyToken, videoProgressController.getCourseProgress);

// Get specific video status (GET)
router.get("/video/:courseId/:videoId", verifyToken, videoProgressController.getVideoStatus);

// Get all completed videos for a course (GET)
router.get("/completed/:courseId", verifyToken, videoProgressController.getCompletedVideos);

// Initialize course videos (POST)
router.post("/initialize", verifyToken, videoProgressController.initializeCourseVideos);

export default router;
