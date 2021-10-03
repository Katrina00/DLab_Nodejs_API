const query = require('../db/db-connection');
const  { multipleColumnSet } = require('../utils/common.utils');

class FollowModel {
    tableName = 'follower';

    find = async (params = {}) => {
        let sql = `SELECT * FROM ${this.tableName}`;

        if (!Object.keys(params).length) {
            return await query(sql);
        }

        const { columnSet, values } = multipleColumnSet(params)
        sql += ` WHERE ${columnSet}`;

        return await query(sql, [...values]);
    }

    findOne = async (params) => {
        const  { columnSet, values } = multipleColumnSet(params)

        const sql = `SELECT * FROM ${this.tableName} WHERE ${columnSet}`;

        const result = await query(sql, [...values]);

        // return back the first row (user)
        return result[0];
    }

    create = async ({follower_id, following_id}) =>{
        const sql = `INSERT INTO ${this.tableName} (follower_id, following_id) VALUES (?,?)`;

        const result = await query(sql, [follower_id, following_id]);
        const affectedRows = result ? result.affectedRows : 0;

        return affectedRows;
    }

    delete = async (id) => {
        const sql = `DELETE FROM ${this.tableName} WHERE following_id = ?`;
        const result = await query(sql, [id]);
        const affectedRows = result ? result.affectedRows : 0;

        return affectedRows;
    }
}

module.exports = new FollowModel;