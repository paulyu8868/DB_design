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
    searchBooks: async (searchTerm) => {
        const sql = `
            SELECT * 
            FROM book 
            WHERE title = ?
        `;
        const [rows] = await promisePool.query(sql, [searchTerm]);
        if (rows.length === 0) {
            throw new Error();
        }
        return rows;
    }
}

export const insertSql = {
    // 도서 추가
    addBook: async (book) => {
        const sql = `
            INSERT INTO book (ISBN, category, price, title, year) 
            VALUES (?, ?, ?, ?, ?)
        `;
        const values = [book.ISBN, book.category, book.price, book.title, book.year];
        await promisePool.query(sql, values);
    }
};

export const updateSql = {
    // 도서 수정
    updateBook: async (book) => {
        const sql = `
            UPDATE book 
            SET category = ?, price = ?, title = ?, year = ?
            WHERE ISBN = ?
        `;
        const values = [book.category, book.price, book.title, book.year,book.ISBN];
        await promisePool.query(sql, values);
    }
};

export const deleteSql = {
    // 도서 삭제
    deleteBook: async (bookId) => {
        const sql = `DELETE FROM book WHERE ISBN = ?`;
        await promisePool.query(sql, [bookId]);
    }
};