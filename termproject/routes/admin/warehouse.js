import express from 'express';
import { selectSql, insertSql, updateSql, deleteSql } from "../../database/sql";

const router = express.Router();

// 창고 검색
router.get('/search', async (req, res) => {
   try {
       const warehouses = await selectSql.searchWarehouses(req.query.code);
       res.json({ warehouses });
   } catch (err) {
       console.error('Search Error:', err);
       res.status(500).json({ error: '검색결과가 존재하지 않습니다. 정확한 창고코드를 입력해주세요. ex) WH001' });
   }
});

// 창고 추가
router.post('/add', async (req, res) => {
   try {
       if (!req.body.code || !req.body.address) {
           return res.status(400).json({ error: '창고 코드와 주소는 필수 입력값입니다.' });
       }
       await insertSql.addWarehouse(req.body);
       res.json({ success: true });
   } catch (err) {
       console.error('Add Error:', err);
       res.status(500).json({ error: '창고 추가 중 오류가 발생했습니다.' });
   }
});

// 창고 수정
router.put('/update', async (req, res) => {
   try {
       if (!req.body.code || !req.body.address) {
           return res.status(400).json({ error: '창고 코드와 주소는 필수 입력값입니다.' });
       }
       await updateSql.updateWarehouse(req.body);
       res.json({ success: true });
   } catch (err) {
       console.error('Update Error:', err);
       res.status(500).json({ error: '창고 수정 중 오류가 발생했습니다.' });
   }
});

// 창고 삭제
router.delete('/:code', async (req, res) => {
   try {
       await deleteSql.deleteWarehouse(req.params.code);
       res.json({ success: true });
   } catch (err) {
       console.error('Delete Error:', err);
       res.status(500).json({ error: '창고 삭제 중 오류가 발생했습니다.' });
   }
});

module.exports = router;