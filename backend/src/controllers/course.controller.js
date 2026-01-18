/**
 * Course Controller
 * 
 * Handles all course-related business logic
 * - Creating new courses
 * - Fetching all courses
 * - Fetching courses by category
 */

import Course from "../models/course.model.js";
import { createCourseValidation, getCoursesByCategoryValidation } from "../validation/course.validation.js";

/**
 * CREATE A NEW COURSE
 * POST /api/courses
 * 
 * Request body:
 * {
 *   title: string,
 *   category: enum,
 *   description: string,
 *   youtubeLinks: array,
 *   instructor?: string
 * }
 */
const createCourse = async (req, res) => {
  try {
    // Validate request body using Joi
    const { error, value } = createCourseValidation.body.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    // Return validation errors if any
    if (error) {
      const errorMessages = error.details.map((detail) => detail.message);
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errorMessages,
      });
    }

    // Check if course with same title already exists in the category
    const existingCourse = await Course.findOne({
      title: value.title,
      category: value.category,
    });

    if (existingCourse) {
      return res.status(409).json({
        success: false,
        message: "A course with this title already exists in this category",
      });
    }

    // Create new course
    const newCourse = await Course.create(value);

    // Return success response
    return res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: newCourse,
    });
  } catch (error) {
    console.error("Error creating course:", error);

    return res.status(500).json({
      success: false,
      message: "Error creating course",
      error: error.message,
    });
  }
};

/**
 * GET ALL COURSES
 * GET /api/courses
 * 
 * Query parameters (optional):
 * - sortBy: "newest" (default) or "oldest"
 * - limit: number of courses (default: 10)
 * - page: page number for pagination (default: 1)
 */
const getAllCourses = async (req, res) => {
  try {
    const { sortBy = "newest", limit = 10, page = 1 } = req.query;

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Determine sort order
    const sortOrder = sortBy === "oldest" ? 1 : -1;

    // Fetch courses with sorting and pagination
    const courses = await Course.find({ isActive: true })
      .sort({ createdAt: sortOrder })
      .limit(parseInt(limit))
      .skip(skip);

    // Get total count for pagination info
    const totalCourses = await Course.countDocuments({ isActive: true });
    const totalPages = Math.ceil(totalCourses / limit);

    // Return success response
    return res.status(200).json({
      success: true,
      message: "Courses fetched successfully",
      data: courses,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalCourses,
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    console.error("Error fetching courses:", error);

    return res.status(500).json({
      success: false,
      message: "Error fetching courses",
      error: error.message,
    });
  }
};

/**
 * GET COURSES BY CATEGORY
 * GET /api/courses/category/:category
 * 
 * URL parameters:
 * - category: "Computer Skills", "English Communication", or "Basic Math"
 * 
 * Query parameters (optional):
 * - sortBy: "newest" (default) or "oldest"
 * - limit: number of courses (default: 10)
 */
const getCoursesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { sortBy = "newest", limit = 10 } = req.query;

    // Validate category parameter using Joi
    const { error } = getCoursesByCategoryValidation.params.validate(
      { category },
      { abortEarly: false }
    );

    // Return validation error if category is invalid
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    // Determine sort order
    const sortOrder = sortBy === "oldest" ? 1 : -1;

    // Fetch courses by category with sorting
    const courses = await Course.find({
      category,
      isActive: true,
    })
      .sort({ createdAt: sortOrder })
      .limit(parseInt(limit));

    // Return success response
    return res.status(200).json({
      success: true,
      message: `${category} courses fetched successfully`,
      data: courses,
      count: courses.length,
    });
  } catch (error) {
    console.error("Error fetching courses by category:", error);

    return res.status(500).json({
      success: false,
      message: "Error fetching courses",
      error: error.message,
    });
  }
};

/**
 * GET COURSE BY ID
 * GET /api/courses/:id
 * 
 * URL parameters:
 * - id: MongoDB course ID
 */
const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID format",
      });
    }

    // Fetch course by ID
    const course = await Course.findById(id);

    // Check if course exists
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Increment view count
    course.viewCount += 1;
    await course.save();

    // Return success response
    return res.status(200).json({
      success: true,
      message: "Course fetched successfully",
      data: course,
    });
  } catch (error) {
    console.error("Error fetching course:", error);

    return res.status(500).json({
      success: false,
      message: "Error fetching course",
      error: error.message,
    });
  }
};

/**
 * DELETE COURSE (Soft Delete)
 * DELETE /api/courses/:id
 * 
 * URL parameters:
 * - id: MongoDB course ID
 */
const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID format",
      });
    }

    // Find course and soft delete it
    const course = await Course.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    // Check if course exists
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Return success response
    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
      data: course,
    });
  } catch (error) {
    console.error("Error deleting course:", error);

    return res.status(500).json({
      success: false,
      message: "Error deleting course",
      error: error.message,
    });
  }
};

export { createCourse, getAllCourses, getCoursesByCategory, getCourseById, deleteCourse };
