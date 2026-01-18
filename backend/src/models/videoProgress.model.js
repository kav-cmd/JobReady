/**
 * Video Progress Model
 * Tracks user's video completion for courses
 */

import mongoose from "mongoose";

const videoProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    courseId: {
      type: String,
      required: true,
      index: true,
    },
    videoId: {
      type: String,
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
      index: true,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    watchDuration: {
      type: Number, // in seconds
      default: 0,
    },
    totalDuration: {
      type: Number, // in seconds
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure one entry per user-course-video combination
videoProgressSchema.index({ userId: 1, courseId: 1, videoId: 1 }, { unique: true });

// Static method to mark video as completed
videoProgressSchema.statics.markVideoCompleted = async function (
  userId,
  courseId,
  videoId
) {
  try {
    const videoProgress = await this.findOneAndUpdate(
      {
        userId,
        courseId,
        videoId,
      },
      {
        completed: true,
        completedAt: new Date(),
      },
      {
        upsert: true,
        new: true,
        runValidators: true,
      }
    );

    return videoProgress;
  } catch (error) {
    if (error.code === 11000) {
      // Handle duplicate key error gracefully
      return await this.findOne({ userId, courseId, videoId });
    }
    throw error;
  }
};

// Static method to get course progress
videoProgressSchema.statics.getCourseProgress = async function (userId, courseId) {
  try {
    const videoProgress = await this.find({
      userId,
      courseId,
    });

    const totalVideos = videoProgress.length;
    const completedVideos = videoProgress.filter((vp) => vp.completed).length;
    const completionPercentage =
      totalVideos > 0 ? Math.round((completedVideos / totalVideos) * 100) : 0;

    return {
      courseId,
      totalVideos,
      completedVideos,
      completionPercentage,
      videos: videoProgress,
    };
  } catch (error) {
    throw error;
  }
};

// Static method to get video completion status
videoProgressSchema.statics.getVideoStatus = async function (userId, courseId, videoId) {
  try {
    const videoProgress = await this.findOne({
      userId,
      courseId,
      videoId,
    });

    return (
      videoProgress || {
        userId,
        courseId,
        videoId,
        completed: false,
        completedAt: null,
      }
    );
  } catch (error) {
    throw error;
  }
};

export default mongoose.model("VideoProgress", videoProgressSchema);
