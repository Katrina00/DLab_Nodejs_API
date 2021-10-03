const BookmarkModel = require('../models/bookmark.model');
const HttpException = require('../utils/HttpException.utils');
const dotenv = require('dotenv');
dotenv.config();

class BookmarkController {
    createBookmark = async (req, res, next) => {
        req.body.account_id = req.currentUser.id
        req.body.article_id = req.params.article_id
        console.log(req.body);

        const books = await BookmarkModel.findOne({ article_id: req.params.article_id });
        console.log('book',books)
        if (!books) {
            const result = await BookmarkModel.create(req.body);

            if (!result) {
                throw new HttpException(500, 'Something went wrong');
            }

            res.status(201).send('Bookmark was created');
        } else {
            const result = await BookmarkModel.delete(req.params.article_id);
            if (!result) {
                throw new HttpException(404, 'Bookmark not found');
            }
            
            res.send('Bookmark has been removed');
        }
    }

    getBookmarkByArticleId = async (req,res, next) => {
        const book = await BookmarkModel.findOne({ article_id: req.params.article_id});
        if (!book) {
            throw new HttpException(404, 'Bookmark not found');
        }

        res.send(book);
    };

    addBookmark = async (req, res, next) => {
        req.body.account_id = req.currentUser.id
        req.body.article_id = req.params.id
        console.log(req.body);
        const result = await BookmarkModel.create(req.body);

        if (!result) {
            throw new HttpException(500, 'Something went wrong');
        }

        res.status(201).send('Bookmark was created');
    };

    removeBookmark = async (req, res,next) => {
        const result = await BookmarkModel.delete(req.params.id);
        if (!result) {
            throw new HttpException(404, 'Bookmark not found');
        }
        
        res.send('Bookmark has been removed');
    }
}

module.exports = new BookmarkController;