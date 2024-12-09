import mysql from 'mysql2';

const pool = mysql.createPool({
    host: 'localhost',
    port: 3306, // mysql 포트번호
    user: 'root',
    password: 'Dogok8868@',
    database: 'week3_company'
})

const promisePool = pool.promise();

const sql ={
    getEmployee: async()=>{
        const results = await promisePool.query(
            'select * from employee'
        )
        return results;
    }
}

export default sql;