import Joi from 'joi';

export const registerSchema = Joi.object({
  name: Joi.string()
    .required()
    .messages({
      'string.empty': 'Name is required',
      'any.required': 'Name is required'
    }),
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email',
      'any.required': 'Email is required'
    }),
  phone: Joi.string()
    .pattern(/^[+]?[0-9\s\-()]{10,}$/)
    .required()
    .messages({
      'string.pattern.base': 'Please provide a valid phone number',
      'any.required': 'Phone number is required'
    }),
  password: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.min': 'Password must be at least 6 characters',
      'any.required': 'Password is required'
    }),
  role: Joi.string()
    .valid('student', 'instructor')
    .default('student')
});

export const sendOtpSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string()
    .pattern(/^[+]?[0-9\s\-()]{10,}$/)
    .required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('student', 'instructor').default('student')
});

export const verifyOtpSchema = Joi.object({
  email: Joi.string()
    .email()
    .required(),
  otp: Joi.string()
    .length(6)
    .pattern(/^[0-9]+$/)
    .required()
    .messages({
      'string.length': 'OTP must be 6 digits',
      'string.pattern.base': 'OTP must contain only numbers'
    })
});

export const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email',
      'any.required': 'Email is required'
    }),
  password: Joi.string()
    .required()
    .messages({
      'any.required': 'Password is required'
    })
});
