/**
 * Course Routes
 * 
 * All course-related API endpoints
 */

import express from "express";
import { createCourse, getAllCourses, getCoursesByCategory, getCourseById, deleteCourse } from "../controllers/course.controller.js";

const router = express.Router();

/**
 * @route   POST /api/courses
 * @desc    Create a new course
 * @access  Public
 * @body    { title, category, description, youtubeLinks, instructor? }
 */
router.post("/", createCourse);

/**
 * @route   GET /api/courses
 * @desc    Get all active courses with pagination
 * @access  Public
 * @query   { sortBy?, limit?, page? }
 */
router.get("/", getAllCourses);

/**
 * @route   GET /api/courses/category/:category
 * @desc    Get courses by category
 * @access  Public
 * @params  { category: "Computer Skills" | "English Communication" | "Basic Math" }
 * @query   { sortBy?, limit? }
 */
router.get("/category/:category", getCoursesByCategory);

/**
 * @route   GET /api/courses/:id
 * @desc    Get a specific course by ID
 * @access  Public
 * @params  { id: MongoDB course ID }
 */
router.get("/:id", getCourseById);

/**
 * @route   DELETE /api/courses/:id
 * @desc    Delete (soft delete) a course
 * @access  Public (should be protected in production)
 * @params  { id: MongoDB course ID }
 */
router.delete("/:id", deleteCourse);

export default router;
