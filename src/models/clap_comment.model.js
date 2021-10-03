const query = require('../db/db-connection');
const { multipleColumnSet } = require('../utils/common.utils');

class ClapModel {
    tableName = 'clap_comment';

    find = async (params = {}) => {
        let sql = `SELECT * FROM ${this.tableName}`;

        if (!Object.keys(params).length) {
            return await query(sql);
        }

        const { columnSet, values } = multipleColumnSet(params)
        sql += ` WHERE ${columnSet}`;

        return await query(sql, [...values]);
    }

    findOne = async (comment_id, user_id) => {     
        const sql = `SELECT * FROM ${this.tableName} WHERE comment_id = ? AND user_id = ?`;
        
        const result = await query(sql, [comment_id, user_id]);

        // return back the first row (user)
        return result[0];
    }

    findTotalClaps = async (params = {}) => {
        let sql = `SELECT SUM(count) AS count FROM ${this.tableName}`;

        if (!Object.keys(params).length) {
            return await query(sql);
        }

        const { columnSet, values } = multipleColumnSet(params)
        sql += ` WHERE ${columnSet}`;

        return await query(sql, [...values]);
    }

    create = async ({user_id, comment_id, count}) => {
        const sql = `INSERT INTO ${this.tableName} (user_id, comment_id, count) VALUES (?,?,?)`;
        
        const result = await query(sql, [user_id, comment_id, count]);
        const affectedRows = result ? result.affectedRows : 0;
        
        return affectedRows;
    }

    update = async (params, comment_id, user_id) => {
        const { columnSet, values } = multipleColumnSet(params)

        const sql = `UPDATE clap_comment SET ${columnSet} WHERE comment_id = ? AND user_id = ?`;

        const result = await query(sql, [...values, comment_id, user_id]);

        return result;
    }
}

module.exports = new ClapModel;