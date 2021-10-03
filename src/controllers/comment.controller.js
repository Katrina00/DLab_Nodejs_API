const CommentModel = require('../models/comment.model');
const ClapCommentModel = require('../models/clap_comment.model')
//const ArticleModel = require('../models/article.model');
const HttpException = require('../utils/HttpException.utils');
const { validationResult } = require('express-validator');
const dotenv = require('dotenv');
const { find } = require('../models/user.model');
dotenv.config();


class CommentController {
    getCommentsByArticleId = async (req, res, next) => {
        let commentList = await CommentModel.findComment(req.params.article_id,0);
        if (!commentList.length) {
            throw new HttpException(404, 'Comments not found');
        }
        for (const comment of Object.entries(commentList)) {
            const findClapCount = await ClapCommentModel.findOne(comment[1].id, req.currentUser.id);
            let selfClapCount = 0
            if (findClapCount) {
                selfClapCount = findClapCount.count
            }
            
            const commentClap = await ClapCommentModel.findTotalClaps({comment_id: comment[1].id});
            let total_clap = 0
            if (commentClap) {
                total_clap = commentClap[0].count
            }

            const reply = await CommentModel.find({parent_id: comment[1].id})
    
            comment[1]['clap_count'] = total_clap
            comment[1]['self_clap_count'] = selfClapCount
            comment[1]['replies'] = reply
            
        }
        res.send(commentList);
    };

    createComment = async (req, res, next) => {
        console.log('current',req.currentUser)
        req.body.author_id = req.currentUser.id
        req.body.author_name = req.currentUser.name
        
        this.checkValidation(req);
        console.log('body2',req.body)
        
        const result = await CommentModel.create(req.body);

        if (!result) {
            throw new HttpException(500, 'Something went wrong');
        }

        //res.status(201).send('Comment was created!');
        res.json({status: 0, code: 201, message: 'Comment was created!'})

        if (req.body.parent_id !== undefined) {
            const oricomment = await CommentModel.findOne({id: req.body.parent_id});
            console.log('ori',oricomment)
            console.log('ori_id',oricomment.id)
            oricomment.reply_count = oricomment.reply_count+1
            //req.body.parent_id = 0

            const upreply = await CommentModel.update(oricomment, oricomment.id);
            if (!upreply) {
                throw new HttpException(500, 'Something went wrong');
            }
            console.log('reply count update successfuly')
        };
    };

    updateComment = async (req, res, next) => {
        console.log('body', req.body)
        this.checkValidation(req);
        console.log('body2', req.body)

        const { ...restOfUpdates } = req.body;

        const result = await CommentModel.update(restOfUpdates, req.params.comment_id);

        if (!result) {
            throw new HttpException(404, 'Something went wrong');
        }

        const { affectedRows, changedRows, info } = result;

        const message = !affectedRows ? 'Comment not found' :
            affectedRows && changedRows ? 'Comment updated successfully' : 'Updated failed';

        res.send({ message, info });
    };

    deleteComment = async (req, res, next) => {
        const result = await CommentModel.delete(req.params.comment_id);
        if (!result) {
            throw new HttpException(404, 'Comment not found');
        }
        res.json({status: 0, code: 201, message: 'Comment has been deleted'});
    };

    //get reply
    getRepliesbyId = async (req, res, next) => {
        let replyList = await CommentModel.find({parent_id: req.params.comment_id});
        if (!replyList.length) {
            throw new HttpException(404, 'Reply not found');
        }

        res.send(replyList);
    };

    checkValidation = (req) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            throw new HttpException(400, 'Validation failed', errors);
        }
    }
}

module.exports = new CommentController;