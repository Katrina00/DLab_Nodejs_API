const { body } = require('express-validator');

exports.createCommentSchema = [
    body('article_id')
        .exists()
        .withMessage('article_id is required')
        .isNumeric()
        .withMessage('Must be a number'),
    // body('parent_id')
    //     .isNumeric()
    //     .withMessage('Must be a number'),
    body('content')
        .exists()
        .withMessage('content is reauired')
        .isLength({ min: 1 })
        .withMessage('Must be at least 1 chars long')
];

exports.updateCommentSchema = [
    body('comment')
        .optional()
        .isLength({ min: 1 })
        .withMessage('Must be at least 1 chars long'),
    body()
        .custom(value => {
            return !!Object.keys(value).length;
        })
        .withMessage('Please provide required field to update')
        .custom(value => {
            const updates = Object.keys(value);
            const allowUpdates = ['content'];
            return updates.every(update => allowUpdates.includes(update));
        })
        .withMessage('Invalid updates!')
];