import Joi from 'joi';
import { generateTutorContent, generateYouTubeSummary, validateAIConnection, SUPPORTED_LANGUAGES } from '../services/ai.service.js';

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
    .optional()
    .messages({
      'any.only': 'Mode must be one of: quiz, notes, doubt'
    }),
  language: Joi.string()
    .valid(...SUPPORTED_LANGUAGES)
    .optional()
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

    const { courseName, topic, userQuery, mode = 'doubt', language = 'en' } = value;

    // Call Groq API to generate content
    const result = await generateTutorContent({ courseName, topic, userQuery: userQuery || '', mode, language });

    res.status(200).json(result);
  } catch (error) {
    console.error('[AI Tutor Controller] Error:', error);

    // Handle specific error types
    if (error.message.includes('API') || error.message.includes('configured')) {
      return res.status(500).json({
        success: false,
        message: 'Groq API is not configured. Please set LLAMA_API_KEY, LLAMA_API_URL, and LLAMA_MODEL in your .env file.'
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
    const result = await validateAIConnection();
    
    if (result.success) {
      res.status(200).json({
        success: true,
        message: 'AI Tutor service is operational',
        service: 'groq',
        provider: result.provider || 'groq'
      });
    } else {
      res.status(503).json({
        success: false,
        message: result.message || 'AI service is not configured'
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

    const { courseName, topic, language = 'en' } = value;
    const result = await generateTutorContent({ courseName, topic, userQuery: '', mode: 'quiz', language });

    res.status(200).json(result);
  } catch (error) {
    console.error('[Generate Quiz Controller] Error:', error);
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

    const { courseName, topic, language = 'en' } = value;
    const result = await generateTutorContent({ courseName, topic, userQuery: '', mode: 'notes', language });

    res.status(200).json(result);
  } catch (error) {
    console.error('[Generate Notes Controller] Error:', error);
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

    const { courseName, topic, userQuery, language = 'en' } = value;

    if (!userQuery) {
      return res.status(400).json({
        success: false,
        message: 'User query is required to resolve a doubt'
      });
    }

    const result = await generateTutorContent({ courseName, topic, userQuery, mode: 'doubt', language });

    res.status(200).json(result);
  } catch (error) {
    console.error('[Resolve Doubt Controller] Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to resolve doubt'
    });
  }
};

/**
 * YouTube Summary Controller
 * Generate AI summaries for YouTube videos
 */
export const youtubeSummary = async (req, res) => {
  try {
    console.log('[YouTube Summary Controller] Request:', { body: req.body });
    
    const schema = Joi.object({
      youtubeUrl: Joi.string().uri().optional(),
      youtubeId: Joi.string().optional(),
      title: Joi.string().optional(),
      language: Joi.string().valid(...SUPPORTED_LANGUAGES).optional()
    }).or('youtubeUrl', 'youtubeId');

    const { error, value } = schema.validate(req.body);

    if (error) {
      console.warn('[YouTube Summary Controller] Validation error:', error.details[0].message);
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
        error: 'VALIDATION_ERROR'
      });
    }

    const result = await generateYouTubeSummary(value);
    console.log('[YouTube Summary Controller] Success');
    return res.status(200).json(result);
  } catch (error) {
    console.error('[YouTube Summary Controller] Error:', {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to generate summary',
      error: 'AI_ERROR'
    });
  }
};

export default {
  aiTutor,
  healthCheck,
  generateQuiz,
  generateNotes,
  resolveDoubt,
  youtubeSummary
};
