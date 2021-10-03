const { body } = require('express-validator');

exports.createArticleSchema = [
    body('title')
        .exists()
        .withMessage('title is required')
        .isLength({ min: 3 })
        .withMessage('Must be at least 3 chars long'),
    body('content')
        .exists()
        .withMessage('username is required')
        .isLength({ min: 3 })
        .withMessage('Must be at least 3 chars long'),
    // body('author_id')
    //     .exists()
    //     .isNumeric()
    //     .withMessage('Must be a number'),
    body('is_premium')
        .exists()
        .isNumeric()
        .withMessage('Must be a number')
];

exports.updateArticleSchema = [
    body('title')
        .optional()
        .isLength({ min: 3 })
        .withMessage('Must be at least 3 chars long'),
    body('content')
        .optional()
        .isLength({ min: 3 })
        .withMessage('Must be at least 3 chars long'),
    // body('author_id')
    //     .optional()
    //     .isNumeric()
    //     .withMessage('Must be a number'),
    body('is_premium')
        .optional()
        .isNumeric()
        .withMessage('Must be a number'),
    body()
        .custom(value => {
            return !!Object.keys(value).length;
        })
        .withMessage('Please provide required field to update')
        .custom(value => {
            const updates = Object.keys(value);
            const allowUpdates = ['title', 'content', 'author_id', 'is_premium'];
            return updates.every(update => allowUpdates.includes(update));
        })
        .withMessage('Invalid updates!')
];