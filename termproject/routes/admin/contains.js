import express from 'express';
import { selectSql, insertSql, updateSql, deleteSql ,lockSql} from "../../database/sql";

const router = express.Router();

// 주문 검색
router.get('/search', async (req, res) => {
   try {
       const orders = await selectSql.searchOrders(req.query.basketId);
       res.json({ orders });
   } catch (err) {
       console.error('Search Error:', err);
       res.status(500).json({ error: '검색 결과가 존재하지 않습니다. 정확한 주문번호를 입력해주세요.' });
   }
});

// 주문 추가
router.post('/add', async (req, res) => {
   try {
       if (!req.body.Book_ISBN || !req.body.Shopping_basket_basket_id || !req.body.quantity) {
           return res.status(400).json({ error: '모든 항목을 입력해주세요.' });
       }
       await insertSql.addOrder(req.body);
       res.json({ success: true });
   } catch (err) {
       let error_message = ""
       console.error(err);
       if (err.errno == 1062){ // 키값 중복 오류
        error_message = "이미 주문목록에 존재하는 상품입니다.";
       }
       else if(err.errno == 1452){ // 참조키 제약조건 오류
        error_message = "해당 주문번호 또는 상품이 존재하지 않습니다. 정확한 주문번호와 ISBN을 입력해주세요.";
       }
       res.status(500).json({ error: error_message });
   }
});

// 주문 수정
router.put('/update', async (req, res) => {
   try {
       if (!req.body.Book_ISBN || !req.body.Shopping_basket_basket_id || !req.body.quantity) {
           return res.status(400).json({ error: '모든 항목을 입력해주세요.' });
       }
       await updateSql.updateOrder(req.body);
       res.json({ success: true });
   } catch (err) {
       console.error('Update Error:', err);
       res.status(500).json({ error: '주문 수정 중 오류가 발생했습니다.' });
   }
});

// 주문 삭제
router.delete('/:isbn/:basketId', async (req, res) => {
   try {
       const { isbn, basketId } = req.params;
       await deleteSql.deleteOrder(isbn, basketId);
       res.json({ success: true });
   } catch (err) {
       console.error('Delete Error:', err);
       res.status(500).json({ error: '주문 삭제 중 오류가 발생했습니다.' });
   }
});

router.post('/lock/:isbn/:basketId', async (req, res) => {
    try {
        const result = await lockSql.lockOrder(req.params.isbn, req.params.basketId);
        if (!result) {
            return res.json({ 
                success: false, 
                error: '다른 관리자가 수정 중입니다.' 
            });
        }
        res.json({ success: true });
    } catch (err) {
        res.json({ success: false, error: '오류가 발생했습니다.' });
    }
});

router.post('/unlock/:isbn/:basketId', async (req, res) => {
    await lockSql.unlockOrder(req.params.isbn, req.params.basketId);
    res.json({ success: true });
});
module.exports = router;