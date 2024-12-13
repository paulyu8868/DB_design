import express from 'express';
import { selectSql, insertSql, updateSql, deleteSql ,lockSql } from "../../database/sql";

const router = express.Router();

// 재고 검색
router.get('/search', async (req, res) => {
   try {
       const inventories = await selectSql.searchInventories(req.query.isbn);
       res.json({ inventories });
   } catch (err) {
       console.error('Search Error:', err);
       res.status(500).json({ error: '검색 결과가 존재하지 않습니다. 정확한 ISBN을 입력해주세요' });
   }
});

// 재고 추가
router.post('/add', async (req, res) => {
   try {
       if (!req.body.Book_ISBN || !req.body.Warehouse_code || !req.body.quantity) {
           return res.status(400).json({ error: '모든 항목을 입력해주세요.' });
       }
       await insertSql.addInventory(req.body);
       res.json({ success: true });
   } catch (err) {
       console.error(err);
       let error_message = ""
       if (err.errno == 1062){ // 키값 중복 오류
        error_message = "이미 창고에 존재하는 재고입니다.";
       }
       else if(err.errno == 1452){ // 참조키 제약조건 오류
        error_message = "해당 창고 또는 책이 존재하지 않습니다. 정확한 창고 코드와 ISBN을 입력해주세요.";
       }

       res.status(500).json({ error: error_message });
   }
});

// 재고 수정
router.put('/update', async (req, res) => {
   try {
       if (!req.body.Book_ISBN || !req.body.Warehouse_code || !req.body.quantity) {
           return res.status(400).json({ error: '모든 항목을 입력해주세요.' });
       }
       await updateSql.updateInventory(req.body);
       res.json({ success: true });
   } catch (err) {
       console.error('Update Error:', err);
       res.status(500).json({ error: '재고 수정 중 오류가 발생했습니다.' });
   }
});

// 재고 삭제
router.delete('/:isbn/:code', async (req, res) => {
   try {
       const { isbn, code } = req.params;
       await deleteSql.deleteInventory(isbn, code);
       res.json({ success: true });
   } catch (err) {
       console.error('Delete Error:', err);
       res.status(500).json({ error: '재고 삭제 중 오류가 발생했습니다.' });
   }
});


router.post('/lock/:isbn/:code', async (req, res) => {
    try {
        const result = await lockSql.lockInventory(req.params.isbn, req.params.code);
        if (!result) {
            return res.json({ 
                success: false, 
                error: '다른 관리자가 수정 중입니다.' 
            });
        }
        res.json({ success: true });
    } catch (err) {
        res.json({ success: false, error: '오류가 발생했습니다.' });
        console.log(err);
    }
});

router.post('/unlock/:isbn/:code', async (req, res) => {
    await lockSql.unlockInventory(req.params.isbn, req.params.code);
    res.json({ success: true });
});

module.exports = router;