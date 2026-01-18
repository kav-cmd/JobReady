/**
 * Course Validation
 * 
 * Joi validation schemas for course operations
 */

import Joi from "joi";

// Validation for creating a new course
const createCourseValidation = {
  body: Joi.object({
    title: Joi.string()
      .required()
      .trim()
      .min(5)
      .max(100)
      .messages({
        "string.empty": "Course title is required",
        "string.min": "Title must be at least 5 characters long",
        "string.max": "Title cannot exceed 100 characters",
      }),

    category: Joi.string()
      .required()
      .valid("Computer Skills", "English Communication", "Basic Math")
      .messages({
        "any.only": "Category must be one of: Computer Skills, English Communication, or Basic Math",
        "string.empty": "Category is required",
      }),

    description: Joi.string()
      .required()
      .trim()
      .min(20)
      .max(1000)
      .messages({
        "string.empty": "Course description is required",
        "string.min": "Description must be at least 20 characters long",
        "string.max": "Description cannot exceed 1000 characters",
      }),

    youtubeLinks: Joi.array()
      .items(
        Joi.object({
          title: Joi.string()
            .required()
            .trim()
            .min(3)
            .messages({
              "string.empty": "Video title is required",
              "string.min": "Video title must be at least 3 characters",
            }),
          url: Joi.string()
            .required()
            .uri()
            .custom((value, helpers) => {
              // Validate YouTube URL
              if (!/^(https?:\/\/)?(www\.)?(youtube|youtu|youtube-nocookie)\.(com|be)\//.test(value)) {
                return helpers.error("any.invalid");
              }
              return value;
            })
            .messages({
              "string.empty": "Video URL is required",
              "any.invalid": "Please provide a valid YouTube URL",
            }),
        })
      )
      .min(1)
      .required()
      .messages({
        "array.min": "At least one YouTube link is required",
        "array.base": "youtubeLinks must be an array",
      }),

    instructor: Joi.string()
      .trim()
      .optional()
      .messages({
        "string.base": "Instructor must be a string",
      }),
  }),
};

// Validation for category parameter in URL
const getCoursesByCategoryValidation = {
  params: Joi.object({
    category: Joi.string()
      .required()
      .valid("Computer Skills", "English Communication", "Basic Math")
      .messages({
        "any.only": "Invalid category. Must be one of: Computer Skills, English Communication, or Basic Math",
      }),
  }),
};

export { createCourseValidation, getCoursesByCategoryValidation };
