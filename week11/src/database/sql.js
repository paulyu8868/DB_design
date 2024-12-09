import mysql from "mysql2";

const pool = mysql.createPool(
  process.env.JAWSDB_URL ?? {
    host: 'localhost',
    user: 'root',
    database: 'WEEK11_INHA_DB',
    password: 'Dogok8868@',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  }
);

// async / await 사용
const promisePool = pool.promise();

// selec query
export const selectSql = {
  getUsers: async () => {
    const [rows] = await promisePool.query(`select * from student`);
    return rows;
  },
  getClass: async () => {
    const [rows] = await promisePool.query(`select c.ID,c.Name,c.Professor,d.Dname as Opening_departments,c.Number_of_participant
from class c,department d
where c.bid=d.bid;`);
    return rows;
  },
  getStudentClass: async () => {
    const sql = `select c.ID,c.Name,c.Professor,d.Dname as Opening_departments,c.Number_of_participant
    from class c, class_student cs,department d
    where cs.student_id=4 and c.id=cs.class_id and c.bid=d.bid`;
    const [result] = await promisePool.query(sql);
    return result;
},
  //TODO
}

export const createSql = {
  addClass: async (data) => {
    const uid = await promisePool.query(`select Id from Student where StudentId=${data.sId}`);
    console.log(uid);
    const results = await promisePool.query (
      `insert into class_student values (${uid[0][0].Id}, ${data.cId});`
    )
    return results[0];
  }
}

