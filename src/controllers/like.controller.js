const LikeModel = require('../models/like.model');
const ClapModel = require('../models/clap_comment.model');
const HttpException = require('../utils/HttpException.utils');
const dotenv = require('dotenv');
dotenv.config();

class likeController {
    articleClap = async (req,res,next) => {
        req.body.user_id = req.currentUser.id
        req.body.article_id = req.params.article_id
        
        const likes = await LikeModel.findOne(req.params.article_id, req.currentUser.id);
        
        if (likes == '') {
            const result = await LikeModel.create(req.body);

            if (!result) {
                throw new HttpException(500, 'Something went wrong');
            }

            res.status(201).send('Like was created!');
        }else {
            if (likes[0].count < 50){
                req.body.count = likes[0].count + req.body.count
                
                const result = await LikeModel.update(req.body, req.params.article_id, req.currentUser.id);

                if (!result) {
                    throw new HttpException(500, 'Something went wrong');
                }

                res.status(201).send('Like was created!');
            } else {
                res.send('Your likes are too much')
            }
        }
    };

    commentClap = async (req, res, next) => {
        req.body.user_id = req.currentUser.id
        req.body.comment_id = req.params.comment_id
        
        const claps = await ClapModel.findOne(req.params.comment_id, req.currentUser.id);
            
        if (!claps) {
            const result = await ClapModel.create(req.body);

            if (!result) {
                throw new HttpException(500, 'Something went wrong');
            }

            res.status(201).send('Comment clap was created!');
        } else {
            if (claps.count < 50) {
                req.body.count = claps.count + req.body.count

                const result = await ClapModel.update(req.body, req.params.comment_id, req.currentUser.id);

                if (!result) {
                    throw new HttpException(500, 'Something went wrong');
                }

                //res.status(201).send('Comment Clap was created!');
                res.json({status: 0, code: 201, message: 'Comment Clap was created!'})
            } else {
                res.send('Your Claps are too much')
            }
        }
    };
}

module.exports = new likeController;