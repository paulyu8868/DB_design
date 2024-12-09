import mysql from 'mysql2';
// 
require("dotenv").config();

const pool = mysql.createPool({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Dogok8868@',
    database: 'bookstore',
});

const promisePool = pool.promise();

export const selectSql = {
    getUser: async () => {
        const sql = 'select email as id,phonenumber as password,admin as role from customer';
        const [result] = await promisePool.query(sql);
        return result;
    },   
}

