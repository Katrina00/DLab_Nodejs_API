const FollowModel = require('../models/follow.model');
const HttpException = require('../utils/HttpException.utils');
const dotenv = require('dotenv');
dotenv.config();

class FollowController {
    createFollow = async (req, res, next) => {
        req.body.follower_id = req.currentUser.id
        req.body.following_id = req.params.following_id

        const follows = await FollowModel.findOne({ following_id: req.params.following_id})
        console.log(follows)
        if (follows == undefined) {
            const result = await FollowModel.create(req.body); 

            if (!result) {
                throw new HttpException(500, 'Something went wrong');
            }

            res.status(201).send('Follow was created!');
        } else {
            const result = await FollowModel.delete(req.params.following_id);
            if (!result) {
                throw new HttpException(404, 'Follow not found');
            }
            res.send('Follow has been deleted');
        }
    };
}

module.exports = new FollowController;


// addFollow = async (req, res, next) => {
//     //const article = await ArticleModel.findOne({id: req.params.id});
//     //const auth_id = article.author_id;

//     req.body.follower_id = req.currentUser.id
//     //req.body.following_id = auth_id
//     console.log('body', req.body);
//     const result = await FollowModel.create(req.body); 

//     if (!result) {
//         throw new HttpException(500, 'Something went wrong');
//     }

//     res.status(201).send('Follow was created!');
// };

// removeFollow = async (req, res, next) => {
//     // console.log(req.currentUser.id)
//     // console.log(req.params.id)
//     //const follow = await FollowModel.findOne({ follower_id: req.currentUser.id, following_id: req.params.id });
//     //console.log(follow);
//     const result = await FollowModel.delete(req.params.following_id);
//     if (!result) {
//         throw new HttpException(404, 'Follow not found');
//     }
//     res.send('Follow has been deleted');
// };