const query = require('../db/db-connection');
const { param } = require('../routes/user.route');
const { multipleColumnSet } = require('../utils/common.utils');

class CommentModel {
    tableName = 'comment';

    find = async (params = {}) => {
        let sql = `SELECT * FROM ${this.tableName}`;

        if (!Object.keys(params).length) {
            return await query(sql);
        }

        const { columnSet, values } = multipleColumnSet(params)
        sql += ` WHERE ${columnSet}`;
        //console.log('sql', sql)
        //console.log('value', values)
        return await query(sql, [...values]);
    }

    findOne = async (params) => {
        const  { columnSet, values } = multipleColumnSet(params)

        const sql = `SELECT * FROM ${this.tableName} WHERE ${columnSet}`;

        const result = await query(sql, [...values]);

        // return back the first row (user)
        return result[0];
    }

    findComment = async (article_id, parent_id) => {
        const sql = `SELECT * FROM ${this.tableName} WHERE article_id = ? AND parent_id = ?`;
        const result = await query(sql, [article_id, parent_id]);

        // return back the first row (user)
        return result;
    }

    create = async ({parent_id = 0, article_id, author_id, author_name, content, reply_count = 0, clap_count = 0}) => {
        const sql = `INSERT INTO ${this.tableName} (parent_id, article_id, author_id, author_name, content, reply_count, clap_count) VALUES (?,?,?,?,?,?,?)`;
        //console.log('sql', sql)
        //console.log('value',parent_id, article_id, author_id, author_name, content, reply_count, clap_count)
        const result = await query(sql, [parent_id, article_id, author_id, author_name, content, reply_count, clap_count]);
        const affectedRows = result ? result.affectedRows : 0;

        return affectedRows;
    }

    update = async (params, id) => {
        const { columnSet, values } = multipleColumnSet(params)

        const sql = `UPDATE comment SET ${columnSet} WHERE id = ?`;

        const result = await query(sql, [...values, id]);

        return result;
    }

    delete = async (id) => {
        const sql = `DELETE FROM ${this.tableName} WHERE id = ?`;
        const result = await query(sql, [id]);
        const affectedRows = result ? result.affectedRows : 0;

        return affectedRows;
    }
}

module.exports = new CommentModel;