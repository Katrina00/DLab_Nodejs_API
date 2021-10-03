const express = require('express');
const likeController = require('../controllers/like.controller');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');

//const { createLikeSchema } = require('../middleware/validators/likeValidator.middleware');

router.post('/id/:article_id', auth(), awaitHandlerFactory(likeController.articleClap));

module.exports = router;