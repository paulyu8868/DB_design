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
    // 유저 정보 가져오기
    getUser: async () => {
        const sql = `
        SELECT email as id, phonenumber as password, admin as role 
        FROM customer`;
        const [result] = await promisePool.query(sql);
        return result;
    },

    // 도서 정보 검색
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
    },

    // 작가 정보 검색
    searchAuthor: async (name) => {
        const sql = `
            SELECT * 
            FROM author 
            WHERE name = ?
        `;
        const [rows] = await promisePool.query(sql, [name]);
        if (rows.length === 0) {
            throw new Error();
        }
        return rows;
    },

    // 수상 정보 검색
    searchAward: async (name) => {
        const sql = `
            SELECT * 
            FROM award 
            WHERE name = ?
        `;
        const [rows] = await promisePool.query(sql, [name]);
        if (rows.length === 0) {
            throw new Error();
        }
        return rows;
    },

    // 창고 정보 검색
    searchWarehouses: async (code) => {
        const sql = `
            SELECT * 
            FROM warehouse 
            WHERE code = ?
        `;
        const [rows] = await promisePool.query(sql, [code]);
        if (rows.length === 0) {
            throw new Error();
        }
        return rows;
    },

    // 재고 정보 검색
    searchInventories: async (isbn) => {
        const sql = `
            SELECT * 
            FROM book_warehouse 
            WHERE Book_ISBN = ?
        `;
        const [rows] = await promisePool.query(sql, [isbn]);
        if (rows.length === 0) {
            throw new Error();
        }
        return rows;
     },
     
     // 주문(contains) 정보 검색
     searchOrders: async (basketId) => {
        const sql = `
            SELECT * 
            FROM book_shoppingbasket 
            WHERE Shopping_basket_basket_id = ?
        `;
        const [rows] = await promisePool.query(sql, [basketId]);
        if (rows.length === 0) {
            throw new Error();
        }
        return rows;
     },
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
    },
    // 작가 추가
    addAuthor: async (author) => {
        const sql = `
            INSERT INTO author (name, address, url) 
            VALUES (?, ?, ?)
        `;
        const values = [author.name,author.address,author.url];
        await promisePool.query(sql, values);
    },
    // 수상 추가
    addAward: async (award) => {
        const sql = `
            INSERT INTO award (name, year) 
            VALUES (?, ?)
        `;
        const values = [award.name,award.year];
        await promisePool.query(sql, values);
    },

    // 창고 추가
    addWarehouse: async (warehouse) => {
        const sql = `
            INSERT INTO warehouse (code, address, phonenumber) 
            VALUES (?, ?, ?)
        `;
        const values = [warehouse.code, warehouse.address, warehouse.phonenumber];
        await promisePool.query(sql, values);
    },

    // 재고 추가
    addInventory: async (inventory) => {
        const sql = `
            INSERT INTO book_warehouse (Book_ISBN, Warehouse_code, quantity) 
            VALUES (?, ?, ?)
        `;
        const values = [inventory.Book_ISBN, inventory.Warehouse_code, inventory.quantity];
        await promisePool.query(sql, values);
     },
     
     // 주문 추가
     addOrder: async (order) => {
        const sql = `
            INSERT INTO book_shoppingbasket (Book_ISBN, Shopping_basket_basket_id, quantity) 
            VALUES (?, ?, ?)
        `;
        const values = [order.Book_ISBN, order.Shopping_basket_basket_id, order.quantity];
        await promisePool.query(sql, values);
     },
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
    },
    // 작가 수정
    updateAuthor: async (author) => {
        const sql = `
            UPDATE author 
            SET address = ?, url = ?
            WHERE name = ?
        `;
        const values = [author.address,author.url,author.name];
        await promisePool.query(sql, values);
    },
    // 수상 수정
    updateAward: async (award) => {
        const sql = `
            UPDATE award 
            SET name = ?, year = ?
            WHERE award_id = ?
        `;
        const values = [award.name,award.year,award.award_id];
        await promisePool.query(sql, values);
    },
    // 창고 수정
    updateWarehouse: async (warehouse) => {
        const sql = `
            UPDATE warehouse 
            SET address = ?, phonenumber = ?
            WHERE code = ?
        `;
        const values = [warehouse.address, warehouse.phonenumber, warehouse.code];
        await promisePool.query(sql, values);
    },
    // 주문 수정
    updateOrder: async (order) => {
        const sql = `
            UPDATE book_shoppingbasket 
            SET quantity = ?
            WHERE Book_ISBN = ? AND Shopping_basket_basket_id = ?
        `;
        const values = [order.quantity, order.Book_ISBN, order.Shopping_basket_basket_id];
        await promisePool.query(sql, values);
     },
     // 재고 수정
     updateInventory: async (inventory) => {
        const sql = `
            UPDATE book_warehouse 
            SET quantity = ?
            WHERE Book_ISBN = ? AND Warehouse_code = ?
        `;
        const values = [inventory.quantity, inventory.Book_ISBN, inventory.Warehouse_code];
        await promisePool.query(sql, values);
     },
};

export const deleteSql = {
    // 도서 삭제
    deleteBook: async (bookId) => {
        const sql = `DELETE FROM book WHERE ISBN = ?`;
        await promisePool.query(sql, [bookId]);
    },
    // 작가 삭제
    deleteAuthor: async (name) => {
        const sql = `DELETE FROM author WHERE name = ?`;
        await promisePool.query(sql, [name]);
    },
    // 수상 삭제
    deleteAward: async (id) => {
        const sql = `DELETE FROM award WHERE award_id = ?`;
        await promisePool.query(sql, [id]);
    },

    // 창고 삭제
    deleteWarehouse: async (code) => {
        const sql = `DELETE FROM warehouse WHERE code = ?`;
        await promisePool.query(sql, [code]);
    },

    // 재고 삭제
    deleteInventory: async (isbn, code) => {
        const sql = `DELETE FROM book_warehouse WHERE Book_ISBN = ? AND Warehouse_code = ?`;
        await promisePool.query(sql, [isbn, code]);
     },
     
     // 주문 삭제
     deleteOrder: async (isbn, basketId) => {
        const sql = `DELETE FROM book_shoppingbasket WHERE Book_ISBN = ? AND Shopping_basket_basket_id = ?`;
        await promisePool.query(sql, [isbn, basketId]);
     }
};