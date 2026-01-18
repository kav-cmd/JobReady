import Joi from 'joi';
import { callGeminiAPI, validateGeminiConnection } from '../services/gemini.service.js';

/**
 * Validation schema for AI tutor request
 */
const aiTutorSchema = Joi.object({
  courseName: Joi.string()
    .required()
    .messages({
      'string.empty': 'Course name is required',
      'any.required': 'Course name is required'
    }),
  topic: Joi.string()
    .required()
    .messages({
      'string.empty': 'Topic is required',
      'any.required': 'Topic is required'
    }),
  userQuery: Joi.string()
    .optional()
    .messages({
      'string.empty': 'User query cannot be empty'
    }),
  mode: Joi.string()
    .valid('quiz', 'notes', 'doubt')
    .required()
    .messages({
      'any.only': 'Mode must be one of: quiz, notes, doubt',
      'any.required': 'Mode is required'
    })
});

/**
 * AI Tutor Controller - Handle AI-powered learning requests
 */
export const aiTutor = async (req, res) => {
  try {
    // Validate request body
    const { error, value } = aiTutorSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { courseName, topic, userQuery, mode } = value;

    // Call Gemini API to generate content
    const result = await callGeminiAPI(courseName, topic, userQuery || '', mode);

    res.status(200).json(result);
  } catch (error) {
    console.error('AI Tutor Error:', error);

    // Handle specific error types
    if (error.message.includes('API key')) {
      return res.status(500).json({
        success: false,
        message: 'Gemini API is not configured. Please add GEMINI_API_KEY to environment variables.'
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate AI response'
    });
  }
};

/**
 * Health check for AI service
 */
export const healthCheck = async (req, res) => {
  try {
    const result = await validateGeminiConnection();
    
    if (result.success) {
      res.status(200).json({
        success: true,
        message: 'AI Tutor service is operational',
        service: 'gemini-ai'
      });
    } else {
      res.status(503).json({
        success: false,
        message: result.message
      });
    }
  } catch (error) {
    res.status(503).json({
      success: false,
      message: 'AI Tutor service is unavailable'
    });
  }
};

/**
 * Generate Quiz
 * Shorthand endpoint for quiz mode
 */
export const generateQuiz = async (req, res) => {
  try {
    const { error, value } = aiTutorSchema.validate({
      ...req.body,
      mode: 'quiz'
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { courseName, topic } = value;
    const result = await callGeminiAPI(courseName, topic, '', 'quiz');

    res.status(200).json(result);
  } catch (error) {
    console.error('Generate Quiz Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate quiz'
    });
  }
};

/**
 * Generate Notes
 * Shorthand endpoint for notes mode
 */
export const generateNotes = async (req, res) => {
  try {
    const { error, value } = aiTutorSchema.validate({
      ...req.body,
      mode: 'notes'
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { courseName, topic } = value;
    const result = await callGeminiAPI(courseName, topic, '', 'notes');

    res.status(200).json(result);
  } catch (error) {
    console.error('Generate Notes Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate notes'
    });
  }
};

/**
 * Resolve Doubt
 * Shorthand endpoint for doubt mode
 */
export const resolveDoubt = async (req, res) => {
  try {
    const { error, value } = aiTutorSchema.validate({
      ...req.body,
      mode: 'doubt'
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { courseName, topic, userQuery } = value;

    if (!userQuery) {
      return res.status(400).json({
        success: false,
        message: 'User query is required to resolve a doubt'
      });
    }

    const result = await callGeminiAPI(courseName, topic, userQuery, 'doubt');

    res.status(200).json(result);
  } catch (error) {
    console.error('Resolve Doubt Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to resolve doubt'
    });
  }
};

export default {
  aiTutor,
  healthCheck,
  generateQuiz,
  generateNotes,
  resolveDoubt
};
