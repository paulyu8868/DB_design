import mysql from 'mysql2';

require("dotenv").config();

const pool = mysql.createPool({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Dogok8868@',
    database: 'week7_express',
});

const promisePool = pool.promise();

export const selectSql = {
    getBuilding: async () => {
        const sql = `select * from building`;
        const [result] = await promisePool.query(sql);
        return result;
    },
    getClass: async () => {
        const sql = `select * from class`;
        const [result] = await promisePool.query(sql);
        return result;
    },
    getDepartment: async () => { 
        const sql = `select * from department`;
        const [result] = await promisePool.query(sql);
        return result;
    },
    getRoom: async () => {
        const sql = `select * from room`;
        const [result] = await promisePool.query(sql);
        return result;
    },
    getStudent: async () => {
        const sql = `select * from student`;
        const [result] = await promisePool.query(sql);
        return result;
    },
    getUser: async () => {
        const sql = 'select distinct u.id,u.password,u.role from user u,student s where (s.id=u.id and u.password=s.phonenumber) or u.role="관리자"';
        const [result] = await promisePool.query(sql);
        return result;
    },
    getStudentClass: async (req) => {
        const sql = `select c.id,r.name as Rname,c.name from class c,student_has_class sc,room r where sc.s_id=${req.session.user.id} and sc.c_id=c.id and r.id=c.room_id`;
        const [result] = await promisePool.query(sql);
        return result;
    }

    
}

export const deleteSql = {
    deleteDepartment: async (data) => {
        console.log('delete department id =', data);
        const sql = `delete from department where id=${data.id}`
        console.log(sql);
        await promisePool.query(sql);
    },
    deleteStudentClass: async (data) => {
        console.log('delete student id =', data);
        const sql = `delete from student_has_class where c_id=${data.cId} and s_id=${data.sId}`
        console.log(sql);
        await promisePool.query(sql);
    },
};
