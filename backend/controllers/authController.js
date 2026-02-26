const authService = require('../services/authService');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const path = require('path');
const fs = require('fs');

/**
 * @desc    Register new user
 * @route   POST /api/auth/register
 * @access  Public
 */
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  const result = await authService.register({ name, email, password });

  return ApiResponse.success(
    res,
    201,
    'User registered successfully',
    {
      user: result.user,
      token: result.token,
    }
  );
});

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const result = await authService.login(email, password);

  return ApiResponse.success(
    res,
    200,
    'Login successful',
    {
      user: result.user,
      token: result.token,
    }
  );
});

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
exports.getProfile = asyncHandler(async (req, res, next) => {
  const user = await authService.getProfile(req.user._id);

  return ApiResponse.success(
    res,
    200,
    'Profile retrieved successfully',
    user
  );
});

/**
 * @desc    Update user profile
 * @route   PUT /api/auth/profile
 * @access  Private
 */
exports.updateProfile = asyncHandler(async (req, res, next) => {
  const user = await authService.updateProfile(req.user._id, req.body);

  return ApiResponse.success(
    res,
    200,
    'Profile updated successfully',
    user
  );
});

/**
 * @desc    Upload avatar
 * @route   POST /api/auth/avatar
 * @access  Private
 */
exports.uploadAvatar = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return ApiResponse.error(res, 400, 'Please upload an image file');
  }

  const user = await authService.getProfile(req.user._id);
  
  // Delete old avatar if exists
  if (user.avatar) {
    const oldAvatarPath = path.join(__dirname, '../uploads/avatars', path.basename(user.avatar));
    if (fs.existsSync(oldAvatarPath)) {
      fs.unlinkSync(oldAvatarPath);
    }
  }

  // Update user avatar
  const avatarUrl = `/uploads/avatars/${req.file.filename}`;
  const updatedUser = await authService.updateProfile(req.user._id, { avatar: avatarUrl });

  return ApiResponse.success(
    res,
    200,
    'Avatar uploaded successfully',
    updatedUser
  );
});

/**
 * @desc    Delete avatar
 * @route   DELETE /api/auth/avatar
 * @access  Private
 */
exports.deleteAvatar = asyncHandler(async (req, res, next) => {
  const user = await authService.getProfile(req.user._id);
  
  if (user.avatar) {
    const avatarPath = path.join(__dirname, '../uploads/avatars', path.basename(user.avatar));
    if (fs.existsSync(avatarPath)) {
      fs.unlinkSync(avatarPath);
    }
  }

  const updatedUser = await authService.updateProfile(req.user._id, { avatar: null });

  return ApiResponse.success(
    res,
    200,
    'Avatar deleted successfully',
    updatedUser
  );
});
