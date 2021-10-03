const express = require('express');
const router = express.Router();
const BookmarkController = require('../controllers/bookmark.controller');
const auth = require('../middleware/auth.middleware');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');

router.post('/id/:article_id', auth(), awaitHandlerFactory(BookmarkController.createBookmark));
router.delete('/id/:article_id', auth(), awaitHandlerFactory(BookmarkController.removeBookmark));

module.exports = router;