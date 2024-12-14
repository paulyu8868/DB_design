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
        SELECT customer_id as cid, email as id, phonenumber as password, admin as role 
        FROM customer`;
        const [result] = await promisePool.query(sql);
        return result;
    },

    /*
    관리자 페이지
    */
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
     /*
     고객 페이지
     */
     // 주문(contains) 정보 검색

    // 도서명으로 검색
    searchBooksByTitle: async (title) => {
        const sql = `
            SELECT b.*,
                GROUP_CONCAT(a.name) as author_name,
                (
                    (SELECT COALESCE(SUM(quantity), 0) 
                    FROM book_warehouse 
                    WHERE Book_ISBN = b.ISBN) - 
                    (SELECT COALESCE(SUM(quantity), 0) 
                    FROM book_shoppingbasket 
                    WHERE Book_ISBN = b.ISBN)
                ) as total_stock
            FROM book b
            LEFT JOIN author_book ab ON b.ISBN = ab.Book_ISBN
            LEFT JOIN author a ON ab.Author_name = a.name
            WHERE b.title = ?
            GROUP BY b.ISBN;
        `;
        const [rows] = await promisePool.query(sql, [title]);
        return rows;
    },

     // 작가명으로 검색
    searchBooksByAuthor: async (authorName) => {
        const sql = `
            SELECT b.*,
                GROUP_CONCAT(a.name) as author_name,
                (
                    (SELECT COALESCE(SUM(quantity), 0) 
                    FROM book_warehouse 
                    WHERE Book_ISBN = b.ISBN) - 
                    (SELECT COALESCE(SUM(quantity), 0) 
                    FROM book_shoppingbasket 
                    WHERE Book_ISBN = b.ISBN)
                ) as total_stock
            FROM book b
            LEFT JOIN author_book ab ON b.ISBN = ab.Book_ISBN
            LEFT JOIN author a ON ab.Author_name = a.name
            WHERE a.name = ?
            GROUP BY b.ISBN;
        `;
        const [rows] = await promisePool.query(sql, [authorName]);
        return rows;
    },
    
    // 수상명으로 검색
    searchBooksByAward: async (awardName) => {
        const sql = `
            SELECT b.*,
                GROUP_CONCAT(a.name) as author_name,
                (
                    (SELECT COALESCE(SUM(quantity), 0) 
                    FROM book_warehouse 
                    WHERE Book_ISBN = b.ISBN) - 
                    (SELECT COALESCE(SUM(quantity), 0) 
                    FROM book_shoppingbasket 
                    WHERE Book_ISBN = b.ISBN)
                ) as total_stock
            FROM book b
            LEFT JOIN author_book ab ON b.ISBN = ab.Book_ISBN
            LEFT JOIN author a ON ab.Author_name = a.name
            JOIN award_book awb ON b.ISBN = awb.Book_ISBN
            JOIN award aw ON awb.Award_Award_id = aw.Award_id
            WHERE aw.name = ?
            GROUP BY b.ISBN;
        `;
        const [rows] = await promisePool.query(sql, [awardName]);
        return rows;
    },

        // 예약 중복 체크 (10분 이내)
    checkReservationOverlap: async (pickupTime) => {
        const sql = `
            SELECT COUNT(*) as count 
            FROM reservation
            WHERE ABS(TIMESTAMPDIFF(MINUTE, pickup_time, ?)) < 10
        `;
        const [[{count}]] = await promisePool.query(sql, [pickupTime]);
        return count > 0;
    },

    // 내 예약 목록 조회
    getMyReservations: async (customerId) => {
        const sql = `
            SELECT r.*, b.title
            FROM reservation r
            JOIN book b ON r.Book_ISBN = b.ISBN
            WHERE r.Customer_Customer_id = ?
            ORDER BY r.pickup_time
        `;
        const [rows] = await promisePool.query(sql, [customerId]);
        return rows;
    },

     // 도서 재고 확인
     checkBookStock: async (isbn) => {
        const sql = `
            SELECT 
                COALESCE(SUM(bw.quantity), 0) - COALESCE(
                    (SELECT SUM(bs.quantity) 
                    FROM book_shoppingbasket bs 
                    WHERE bs.Book_ISBN = ?), 0
                ) as total_stock
            FROM book_warehouse bw
            WHERE bw.Book_ISBN = ?
        `;
        const [[result]] = await promisePool.query(sql, [isbn, isbn]);
        return result.total_stock;
    },

    // 주문내역 조회
    getOrderHistory: async (customerId) => {
        const sql = `
            SELECT 
                sb.basket_id,
                sb.order_date,
                b.title,
                bs.quantity,
                b.price,
                (b.price * bs.quantity) as item_total
            FROM shoppingbasket sb
            JOIN book_shoppingbasket bs ON sb.basket_id = bs.Shopping_basket_basket_id
            JOIN book b ON bs.Book_ISBN = b.ISBN
            WHERE sb.Customer_customer_id = ?
            ORDER BY sb.order_date DESC, sb.basket_id
        `;
        const [rows] = await promisePool.query(sql, [customerId]);
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

     /*
     고객 페이지
     */

        // 예약 추가
    addReservation: async (reservation) => {
        const sql = `
            INSERT INTO reservation 
            (Customer_Customer_id, Book_ISBN, reservation_date, pickup_time) 
            VALUES (?, ?, ?, ?)
        `;
        const values = [
            reservation.customer_id,
            reservation.book_isbn,
            reservation.pickup_time,
            reservation.pickup_time
        ];
        await promisePool.query(sql, values);
    },

        // 장바구니 생성
    createShoppingBasket: async (basketData) => {
        const sql = `
            INSERT INTO shoppingbasket 
            (Customer_customer_id, order_date) 
            VALUES (?, ?)
        `;
        const values = [basketData.customer_id, basketData.order_date];
        const [result] = await promisePool.query(sql, values);
        return result.insertId;  // 생성된 basket_id 반환
    },

    // 장바구니에 도서 추가
    addBookToBasket: async (item) => {
        const sql = `
            INSERT INTO book_shoppingbasket 
            (Shopping_basket_basket_id, Book_ISBN, quantity) 
            VALUES (?, ?, ?)
        `;
        const values = [item.basket_id, item.book_isbn, item.quantity];
        await promisePool.query(sql, values);
    }
};

export const updateSql = {
    // 도서 수정
    updateBook: async (book) => {
        try{
            const sql = `
                UPDATE book 
                SET category = ?, price = ?, title = ?, year = ?
                WHERE ISBN = ?
            `;
            const values = [book.category, book.price, book.title, book.year,book.ISBN];
            await promisePool.query(sql, values);
            return true;
        }catch(err){
            return err
        }
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

     /*
     고객 페이지
     */

    // 예약 수정
    updateReservation: async (reservation) => { 
        const sql = `
            UPDATE reservation
            SET pickup_time = ?
            WHERE reservation_id = ?
        `;
        const values = [reservation.pickup_time, reservation.id];
        await promisePool.query(sql, values);
    }
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
     },

     /*
     고객 페이지
     */
        // 예약 삭제
    deleteReservation: async (id) => {
        const sql = `DELETE FROM reservation WHERE reservation_id = ?`;
        await promisePool.query(sql, [id]);
    }

     
};


export const lockSql = {
    // Book lock 함수들
    lockBook: async (isbn) => {
        try {
            const [checkResult] = await promisePool.query(
                'SELECT IS_FREE_LOCK(?) as is_free', 
                [`book_lock_${isbn}`]
            );
            
            if (!checkResult[0].is_free) {
                return false;
            }

            const [lockResult] = await promisePool.query(
                'SELECT GET_LOCK(?, 0) as success', 
                [`book_lock_${isbn}`]
            );

            return lockResult[0].success === 1;
        } catch (err) {
            console.error('Lock error:', err);
            return false;
        }
    },

    unlockBook: async (isbn) => {
        try {
            await promisePool.query(
                'SELECT RELEASE_LOCK(?)', 
                [`book_lock_${isbn}`]
            );
        } catch (err) {
            console.error('Unlock error:', err);
        }
    },

    // Author lock 함수들
    lockAuthor: async (name) => {
        try {
            const [checkResult] = await promisePool.query(
                'SELECT IS_FREE_LOCK(?) as is_free', 
                [`author_lock_${name}`]
            );
            
            if (!checkResult[0].is_free) {
                return false;
            }

            const [lockResult] = await promisePool.query(
                'SELECT GET_LOCK(?, 0) as success', 
                [`author_lock_${name}`]
            );

            return lockResult[0].success === 1;
        } catch (err) {
            console.error('Lock error:', err);
            return false;
        }
    },

    unlockAuthor: async (name) => {
        try {
            await promisePool.query(
                'SELECT RELEASE_LOCK(?)', 
                [`author_lock_${name}`]
            );
        } catch (err) {
            console.error('Unlock error:', err);
        }
    },

    // Award lock 함수들
    lockAward: async (id) => {
        try {
            const [checkResult] = await promisePool.query(
                'SELECT IS_FREE_LOCK(?) as is_free', 
                [`award_lock_${id}`]
            );
            
            if (!checkResult[0].is_free) {
                return false;
            }

            const [lockResult] = await promisePool.query(
                'SELECT GET_LOCK(?, 0) as success', 
                [`award_lock_${id}`]
            );

            return lockResult[0].success === 1;
        } catch (err) {
            console.error('Lock error:', err);
            return false;
        }
    },

    unlockAward: async (id) => {
        try {
            await promisePool.query(
                'SELECT RELEASE_LOCK(?)', 
                [`award_lock_${id}`]
            );
        } catch (err) {
            console.error('Unlock error:', err);
        }
    },

    // Warehouse lock 함수들
    lockWarehouse: async (code) => {
        try {
            const [checkResult] = await promisePool.query(
                'SELECT IS_FREE_LOCK(?) as is_free', 
                [`warehouse_lock_${code}`]
            );
            
            if (!checkResult[0].is_free) {
                return false;
            }

            const [lockResult] = await promisePool.query(
                'SELECT GET_LOCK(?, 0) as success', 
                [`warehouse_lock_${code}`]
            );

            return lockResult[0].success === 1;
        } catch (err) {
            console.error('Lock error:', err);
            return false;
        }
    },

    unlockWarehouse: async (code) => {
        try {
            await promisePool.query(
                'SELECT RELEASE_LOCK(?)', 
                [`warehouse_lock_${code}`]
            );
        } catch (err) {
            console.error('Unlock error:', err);
        }
    },

    // Order lock 함수들
    lockOrder: async (isbn, basketId) => {
        try {
            const [checkResult] = await promisePool.query(
                'SELECT IS_FREE_LOCK(?) as is_free', 
                [`order_lock_${isbn}_${basketId}`]
            );
            
            if (!checkResult[0].is_free) {
                return false;
            }

            const [lockResult] = await promisePool.query(
                'SELECT GET_LOCK(?, 0) as success', 
                [`order_lock_${isbn}_${basketId}`]
            );

            return lockResult[0].success === 1;
        } catch (err) {
            console.error('Lock error:', err);
            return false;
        }
    },

    unlockOrder: async (isbn, basketId) => {
        try {
            await promisePool.query(
                'SELECT RELEASE_LOCK(?)', 
                [`order_lock_${isbn}_${basketId}`]
            );
        } catch (err) {
            console.error('Unlock error:', err);
        }
    },

    // Inventory lock 함수들
    lockInventory: async (isbn, code) => {
        try {
            const [checkResult] = await promisePool.query(
                'SELECT IS_FREE_LOCK(?) as is_free', 
                [`inventory_lock_${isbn}_${code}`]
            );
            
            if (!checkResult[0].is_free) {
                return false;
            }

            const [lockResult] = await promisePool.query(
                'SELECT GET_LOCK(?, 0) as success', 
                [`inventory_lock_${isbn}_${code}`]
            );

            return lockResult[0].success === 1;
        } catch (err) {
            console.error('Lock error:', err);
            return false;
        }
    },

    unlockInventory: async (isbn, code) => {
        try {
            await promisePool.query(
                'SELECT RELEASE_LOCK(?)', 
                [`inventory_lock_${isbn}_${code}`]
            );
        } catch (err) {
            console.error('Unlock error:', err);
        }
    }
};