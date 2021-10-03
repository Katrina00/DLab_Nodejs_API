const ArticleModel = require('../models/article.model');
const HttpException = require('../utils/HttpException.utils');
const { validationResult } = require('express-validator');
const dotenv = require('dotenv');
const { articleClap } = require('./like.controller');
dotenv.config();

/******************************************************************************
 *                              Article Controller
 ******************************************************************************/
class ArticleController {
    getAllArticles = async (req, res, next) => {
        let articleList = await ArticleModel.find();
        console.log('articleList',articleList.length)
        if (!articleList.length) {
            throw new HttpException(404, 'Article not found');
        }

        res.send(articleList);
    };

    getArticleById = async (req, res, next) => {
        const article = await ArticleModel.findOne({ id: req.params.id});
        if (!article) {
            throw new HttpException(404, 'Article not found');
        }

        res.send(article);
    };

    createArticle = async (req, res, next) => {
        req.body.author_id = req.currentUser.id
        console.log('body',req.body.author_id)
        console.log('current',req.currentUser.id)
        this.checkValidation(req);

        const result = await ArticleModel.create(req.body);

        if (!result) {
            throw new HttpException(500, 'Something went wrong');
        }

        res.status(201).send('Article was created!');
    };

    updateArticle = async (req, res, next) => {
        this.checkValidation(req);

        const article = await ArticleModel.findOne({id: req.params.id});
        const auth_id = article.author_id;

        if (req.currentUser.id !== auth_id) {
            throw new HttpException(404, 'You are not author')
        }

        const { ...restOfUpdates } = req.body;

        //do the update query and get the result
        //it can be partial edit
        const result = await ArticleModel.update(restOfUpdates, req.params.id);

        if (!result) {
            throw new HttpException(404, 'Something went wrong');
        }

        const { affectedRows, changedRows, info } = result;

        const message = !affectedRows ? 'Article not found' : 
            affectedRows && changedRows ? 'Article updated successfully' : 'Updated faild';

        res.send({ message, info });
    };

    deleteArticle = async (req, res, next) => {
        const article = await ArticleModel.findOne({id: req.params.id});
        const auth_id = article.author_id;

        if (req.currentUser.id !== auth_id) {
            throw new HttpException(404, 'You are not author')
        }

        const result = await ArticleModel.delete(req.params.id);
        if (!result) {
            throw new HttpException(404, 'Article not found');
        }
        res.send('Article has been deleted');
    };

    checkValidation = (req) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            throw new HttpException(400, 'Validation failed', errors);
        }
    };

    getPageOfArticle = async (req, res, next) => {
        let currentPage = parseInt(req.params.page) || 1

        let articleList = await ArticleModel.findArticles();
        if (!articleList.length) {
            throw new HttpException(404, 'Article not found');
        }
        const totalArticle = articleList[0].count //總文章數
        const perpage = 3;    //設定每頁資料筆數
        const pageTotal = Math.ceil(totalArticle / perpage) // 總頁數
        if (currentPage < 1) {
            currentPage = 1
        }
        // 當前頁不能超過總頁數
        if (currentPage > pageTotal) {
            currentPage = pageTotal
        }
        const articleCount = (currentPage-1) * perpage;
        const articlePerPage = await ArticleModel.findPageArticle(articleCount, perpage);
        if (!articlePerPage.length) {
            throw new HttpException(404, 'Comments not found');
        }

        res.json({status: 0, code: 200, data: articlePerPage, pagination: {
            total_articles: totalArticle,
            total_pages: pageTotal,
            current_page: currentPage,
            has_pre: currentPage > 1,
            has_next: currentPage < pageTotal,
            category: null
        }})
    }
}


module.exports = new ArticleController;