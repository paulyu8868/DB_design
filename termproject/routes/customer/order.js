import express from 'express';
import { selectSql, insertSql, updateSql, deleteSql } from "../../database/sql";

const router = express.Router();

router.use((req, res, next) => {
    console.log('Session Data:', req.session.user);
    next();
});


// 도서 검색
router.get('/search', async (req, res) => {
    try {
        const searchType = req.query.type;
        const keyword = req.query.keyword;
        let books;

        switch(searchType) {
            case 'title':
                books = await selectSql.searchBooksByTitle(keyword);
                break;
            case 'author': 
                books = await selectSql.searchBooksByAuthor(keyword);
                break;
            case 'award':
                books = await selectSql.searchBooksByAward(keyword);
                break;
            default:
                return res.status(400).json({ error: '잘못된 검색 유형입니다.' });
        }
        res.json({ books });
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

// 주문 생성
router.post('/create', async (req, res) => {
    try {
        const customerId = req.session.user.cid;
        const { items } = req.body;

        // 재고 확인
        for (const item of items) {
            const stock = await selectSql.checkBookStock(item.ISBN);
            if (stock < item.quantity) {
                return res.json({ 
                    error: `${item.title}의 재고가 부족합니다. (현재 재고: ${stock})`
                });
            }
        }

        // 장바구니 생성
        const basketId = await insertSql.createShoppingBasket({
            customer_id: customerId,
            order_date: new Date()
        });

        // 장바구니에 도서 추가
        for (const item of items) {
            await insertSql.addBookToBasket({
                basket_id: basketId,
                book_isbn: item.ISBN,
                quantity: item.quantity
            });
        }

        res.json({ success: true });
    } catch (err) {
        console.error('Order creation error:', err);
        res.status(500).json({ error: '주문 생성 중 오류가 발생했습니다.' });
    }
});

router.get('/history', async (req, res) => {
    try {
        const customerId = req.session.user.cid;
        const orders = await selectSql.getOrderHistory(customerId);
        console.log('Orders result:', JSON.stringify(orders, null, 2)); // 더 자세한 로그
        res.json({ orders });
    } catch (err) {
        console.error('Detailed error:', err);
        res.status(500).json({ error: '주문 내역 조회 중 오류가 발생했습니다.' });
    }
});

module.exports = router;