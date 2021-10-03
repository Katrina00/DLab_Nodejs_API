const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const HttpException = require('./src/utils/HttpException.utils');
const errorMiddleware = require('./src/middleware/error.middleware');
const userRouter = require('./src/routes/user.route');
const articleRouter = require('./src/routes/article.route');
const likeRouter = require('./src/routes/like.route');
const bookmarkRouter = require('./src/routes/bookmark.route');
const followRouter = require('./src/routes/follow.route');
const commentRouter = require('./src/routes/comment.route');

//Init express
const app = express();
//Init environment
dotenv.config();
// parse requests of content-type: application/json
// parses incoming requests with JSON payloads
app.use(express.json());
//enabling cors for all requests by using cors middleware
app.use(cors());
//Enable pre-flight
app.options("*", cors());

const port = 3000;

app.use('/api/v1/users', userRouter);
app.use('/api/v1/articles', articleRouter);
app.use('/api/v1/like', likeRouter);
app.use('/api/v1/bookmark', bookmarkRouter);
app.use('/api/v1/follow', followRouter);
app.use('/api/v1', commentRouter);

//404 error
app.all('*', (req, res, next) => {
    const err = new HttpException(404, 'Endpoint Not Found');
    next(err);
});

//Error middleware
app.use(errorMiddleware);

//starting the server
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});

module.exports = app;