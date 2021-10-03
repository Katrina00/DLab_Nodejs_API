const query = require('../db/db-connection');
const  { multipleColumnSet } = require('../utils/common.utils');

class LikeModel {
    tableName = 'clap_article';

    find = async (params = {}) => {
        let sql = `SELECT * FROM ${this.tableName}`;

        if (!Object.keys(params).length) {
            return await query(sql);
        }

        const { columnSet, values } = multipleColumnSet(params)
        sql += ` WHERE ${columnSet}`;

        return await query(sql, [...values]);
    }

    findOne = async (article_id, user_id) => {
        const sql = `SELECT * FROM ${this.tableName} WHERE (article_id, user_id) = (?, ?)`;
        const result = await query(sql, [article_id, user_id]);

        // return back the first row (user)
        return result;
    }

    create = async ({user_id, article_id, count}) =>{
        const sql = `INSERT INTO ${this.tableName} (user_id, article_id, count) VALUES (?,?,?)`;

        const result = await query(sql, [user_id, article_id, count]);
        const affectedRows = result ? result.affectedRows : 0;

        return affectedRows;
    }

    update = async (params, article_id, user_id) => {
        const { columnSet, values } = multipleColumnSet(params)

        const sql = `UPDATE clap_article SET ${columnSet} WHERE article_id = ? AND user_id = ?`;

        const result = await query(sql, [...values, article_id, user_id]);

        return result;
    }

};
module.exports = new LikeModel;