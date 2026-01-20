/**
 * Video Progress Controller
 * Handles video completion tracking and progress calculation
 */

import VideoProgress from "../models/videoProgress.model.js";
import mongoose from 'mongoose';
import mockDb from '../config/mockDb.js';

// Helper to check if DB is connected
const isDbConnected = () => mongoose.connection.readyState === 1;

// Mark video as completed
export const markVideoCompleted = async (req, res) => {
  try {
    const { courseId, videoId } = req.body;
    const userId = req.user._id || req.user.id; // From authenticated user

    // Validate input
    if (!courseId || !videoId) {
      return res.status(400).json({
        success: false,
        message: "courseId and videoId are required",
      });
    }

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    // Mark video as completed
    let videoProgress;
    if (isDbConnected()) {
      videoProgress = await VideoProgress.markVideoCompleted(
        userId,
        courseId,
        videoId
      );
    } else {
      videoProgress = await mockDb.saveProgress({
        userId,
        courseId,
        videoId,
        completed: true,
        completedAt: new Date()
      });
    }

    return res.status(200).json({
      success: true,
      message: "Video marked as completed",
      data: videoProgress,
    });
  } catch (error) {
    console.error("Error marking video as completed:", error);
    return res.status(500).json({
      success: false,
      message: "Error marking video as completed",
      error: error.message,
    });
  }
};

// Get course progress (total, completed, percentage)
export const getCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user._id || req.user.id;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "courseId is required",
      });
    }

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    let courseProgress;
    if (isDbConnected()) {
      courseProgress = await VideoProgress.getCourseProgress(userId, courseId);
    } else {
      // Mock progress calculation
      const completed = (await mockDb.videoProgress.filter(p => p.userId === userId && p.courseId === courseId && p.completed)).length;
      courseProgress = {
        total: 10, // Mock total
        completed,
        percentage: (completed / 10) * 100
      };
    }

    return res.status(200).json({
      success: true,
      data: courseProgress,
    });
  } catch (error) {
    console.error("Error fetching course progress:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching course progress",
      error: error.message,
    });
  }
};

// Get video completion status
export const getVideoStatus = async (req, res) => {
  try {
    const { courseId, videoId } = req.params;
    const userId = req.user._id || req.user.id;

    if (!courseId || !videoId) {
      return res.status(400).json({
        success: false,
        message: "courseId and videoId are required",
      });
    }

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    let videoStatus;
    if (isDbConnected()) {
      videoStatus = await VideoProgress.getVideoStatus(userId, courseId, videoId);
    } else {
      const progress = await mockDb.getProgress(userId, courseId, videoId);
      videoStatus = {
        completed: progress ? progress.completed : false,
        completedAt: progress ? progress.completedAt : null
      };
    }

    return res.status(200).json({
      success: true,
      data: videoStatus,
    });
  } catch (error) {
    console.error("Error fetching video status:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching video status",
      error: error.message,
    });
  }
};

// Get all completed videos for a course
export const getCompletedVideos = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user._id || req.user.id;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "courseId is required",
      });
    }

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    let completedVideos;
    if (isDbConnected()) {
      completedVideos = await VideoProgress.find({
        userId,
        courseId,
        completed: true,
      });
    } else {
      completedVideos = mockDb.videoProgress.filter(p =>
        p.userId === userId && p.courseId === courseId && p.completed
      );
    }

    return res.status(200).json({
      success: true,
      data: completedVideos,
      count: completedVideos.length,
    });
  } catch (error) {
    console.error("Error fetching completed videos:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching completed videos",
      error: error.message,
    });
  }
};

// Initialize video progress for a course (for new courses/users)
export const initializeCourseVideos = async (req, res) => {
  try {
    const { courseId, videos } = req.body;
    const userId = req.user._id || req.user.id;

    if (!courseId || !Array.isArray(videos)) {
      return res.status(400).json({
        success: false,
        message: "courseId and videos array are required",
      });
    }

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    // Create progress entries for each video if they don't exist
    const operations = videos.map((videoId) => ({
      updateOne: {
        filter: { userId, courseId, videoId },
        update: {
          $setOnInsert: {
            userId,
            courseId,
            videoId,
            completed: false,
            completedAt: null,
          },
        },
        upsert: true,
      },
    }));

    if (isDbConnected()) {
      const result = await VideoProgress.bulkWrite(operations);
      return res.status(200).json({
        success: true,
        message: "Video progress initialized for course",
        data: {
          acknowledged: result.ok,
          upsertedCount: result.upsertedCount,
          modifiedCount: result.modifiedCount,
        },
      });
    } else {
      // Mock initialization
      for (const videoId of videos) {
        await mockDb.saveProgress({
          userId,
          courseId,
          videoId,
          completed: false,
          completedAt: null
        });
      }
      return res.status(200).json({
        success: true,
        message: "Video progress initialized for course (Mock Mode)",
      });
    }
  } catch (error) {
    console.error("Error initializing course videos:", error);
    return res.status(500).json({
      success: false,
      message: "Error initializing course videos",
      error: error.message,
    });
  }
};
