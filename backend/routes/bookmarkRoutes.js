const express = require('express');
const router = express.Router();
const bookmarkController = require('../controllers/bookmarkController');
const { protect } = require('../middleware/auth');

// All bookmark routes require authentication
router.get('/', protect, bookmarkController.getBookmarks);
router.post('/:knowledgeId', protect, bookmarkController.addBookmark);
router.delete('/:knowledgeId', protect, bookmarkController.removeBookmark);
router.put('/:knowledgeId', protect, bookmarkController.updateBookmark);
router.get('/check/:knowledgeId', protect, bookmarkController.checkBookmark);

module.exports = router;
