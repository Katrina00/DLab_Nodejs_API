const express = require('express');
const router = express.Router();
const FollowController = require('../controllers/follow.controller');
const auth = require('../middleware/auth.middleware');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');

router.post('/id/:following_id', auth() , awaitHandlerFactory(FollowController.createFollow));
router.delete('/id/:following_id', auth(), awaitHandlerFactory(FollowController.removeFollow));

module.exports = router;