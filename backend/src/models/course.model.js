/**
 * Course Model
 * 
 * This model represents a vocational course with video content.
 * Each course belongs to a specific category and contains multiple YouTube video links.
 */

import mongoose from "mongoose";

// YouTube Links Schema - Sub-document for storing video information
const youtubeLinksSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Video title is required"],
    trim: true,
    minlength: [3, "Title must be at least 3 characters long"],
  },
  url: {
    type: String,
    required: [true, "Video URL is required"],
    validate: {
      validator: function (v) {
        // Basic YouTube URL validation
        return /^(https?:\/\/)?(www\.)?(youtube|youtu|youtube-nocookie)\.(com|be)\//.test(v);
      },
      message: "Please provide a valid YouTube URL",
    },
  },
  _id: false, // Don't create separate _id for sub-documents
});

// Main Course Schema
const courseSchema = new mongoose.Schema(
  {
    // Course Title
    title: {
      type: String,
      required: [true, "Course title is required"],
      trim: true,
      minlength: [5, "Title must be at least 5 characters long"],
      maxlength: [100, "Title cannot exceed 100 characters"],
    },

    // Course Category - Enum to restrict to specific categories
    category: {
      type: String,
      enum: {
        values: ["Computer Skills", "English Communication", "Basic Math"],
        message: "Category must be one of: Computer Skills, English Communication, or Basic Math",
      },
      required: [true, "Category is required"],
    },

    // Course Description
    description: {
      type: String,
      required: [true, "Course description is required"],
      trim: true,
      minlength: [20, "Description must be at least 20 characters long"],
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },

    // YouTube Video Links
    youtubeLinks: {
      type: [youtubeLinksSchema],
      required: [true, "At least one YouTube link is required"],
      validate: {
        validator: function (v) {
          return v.length > 0;
        },
        message: "At least one YouTube link is required",
      },
    },

    // Additional fields for better course management
    isActive: {
      type: Boolean,
      default: true,
    },

    // View count for analytics
    viewCount: {
      type: Number,
      default: 0,
    },

    // Instructor or creator name (optional)
    instructor: {
      type: String,
      trim: true,
    },
  },
  {
    // Automatically adds createdAt and updatedAt fields
    timestamps: true,
  }
);

// Index for better query performance
courseSchema.index({ category: 1 });
courseSchema.index({ createdAt: -1 });

// Compile and export the model
const Course = mongoose.model("Course", courseSchema);
export default Course;
