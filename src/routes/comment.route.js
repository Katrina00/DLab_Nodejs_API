const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comment.controller');
const likeController = require('../controllers/like.controller');
const auth = require('../middleware/auth.middleware');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');

const { createCommentSchema, updateCommentSchema } = require('../middleware/validators/commentValidator.middleware');

router.get('/article/:article_id/comments', auth(), awaitHandlerFactory(commentController.getCommentsByArticleId)); //localhost:3000/api/v1/article/:article_id/comments
router.post('/comments', auth(), createCommentSchema, awaitHandlerFactory(commentController.createComment));
router.put('/comments/:comment_id', auth(), updateCommentSchema, awaitHandlerFactory(commentController.updateComment));
router.delete('/comments/:comment_id', auth(), awaitHandlerFactory(commentController.deleteComment));

router.get('/comments/:comment_id/replies', awaitHandlerFactory(commentController.getRepliesbyId)); //localhost:3000/api/v1/comments/:comment_id/replies
router.post('/clap/comment/:comment_id', auth(), awaitHandlerFactory(likeController.commentClap));

module.exports = router;