const { body, param, query, validationResult } = require('express-validator');
const ApiResponse = require('../utils/ApiResponse');

/**
 * Validation error handler
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg);
    return ApiResponse.error(res, 400, 'Validation failed', errorMessages);
  }
  
  next();
};

/**
 * Knowledge validation rules
 */
const knowledgeValidation = {
  create: [
    body('title')
      .trim()
      .notEmpty()
      .withMessage('Title is required')
      .isLength({ max: 200 })
      .withMessage('Title cannot exceed 200 characters'),
    body('content')
      .trim()
      .notEmpty()
      .withMessage('Content is required')
      .isLength({ min: 10 })
      .withMessage('Content must be at least 10 characters'),
    body('category')
      .trim()
      .notEmpty()
      .withMessage('Category is required')
      .isIn([
        'Technology',
        'Science',
        'Business',
        'Health',
        'Education',
        'Arts',
        'Engineering',
        'Mathematics',
        'Programming',
        'Data Science',
        'AI/ML',
        'Other',
      ])
      .withMessage('Invalid category'),
    body('author')
      .trim()
      .notEmpty()
      .withMessage('Author is required')
      .isLength({ max: 100 })
      .withMessage('Author name cannot exceed 100 characters'),
    body('tags')
      .optional()
      .isArray()
      .withMessage('Tags must be an array'),
    handleValidationErrors,
  ],

  update: [
    body('title')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Title cannot be empty')
      .isLength({ max: 200 })
      .withMessage('Title cannot exceed 200 characters'),
    body('content')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Content cannot be empty')
      .isLength({ min: 10 })
      .withMessage('Content must be at least 10 characters'),
    body('category')
      .optional()
      .trim()
      .isIn([
        'Technology',
        'Science',
        'Business',
        'Health',
        'Education',
        'Arts',
        'Engineering',
        'Mathematics',
        'Programming',
        'Data Science',
        'AI/ML',
        'Other',
      ])
      .withMessage('Invalid category'),
    body('author')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('Author name cannot exceed 100 characters'),
    body('tags')
      .optional()
      .isArray()
      .withMessage('Tags must be an array'),
    handleValidationErrors,
  ],

  id: [
    param('id')
      .isMongoId()
      .withMessage('Invalid knowledge ID'),
    handleValidationErrors,
  ],

  search: [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),
    query('sortBy')
      .optional()
      .isIn(['relevance', 'newest', 'popular'])
      .withMessage('Invalid sort option'),
    handleValidationErrors,
  ],
};

/**
 * User/Auth validation rules
 */
const authValidation = {
  register: [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Name is required')
      .isLength({ max: 50 })
      .withMessage('Name cannot exceed 50 characters'),
    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Invalid email format')
      .normalizeEmail(),
    body('password')
      .notEmpty()
      .withMessage('Password is required')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
    handleValidationErrors,
  ],

  login: [
    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Invalid email format')
      .normalizeEmail(),
    body('password')
      .notEmpty()
      .withMessage('Password is required'),
    handleValidationErrors,
  ],
};

module.exports = {
  knowledgeValidation,
  authValidation,
  handleValidationErrors,
};
