import express from 'express';
import { selectSql, insertSql, updateSql, deleteSql,lockSql } from "../../database/sql";

const router = express.Router();

// 작가 검색
router.get('/search', async (req, res) => {
    try {
        const authors = await selectSql.searchAuthor(req.query.name);
        res.json({ authors });
    } catch (err) {
        res.status(500).json({ error: '검색 결과가 존재하지 않습니다. 정확한 작가명을 입력해주세요.' });
    }
});

// 작가 추가
router.post('/add', async (req, res) => {
   try {
       await insertSql.addAuthor(req.body);
       res.json({ success: true });
   } catch (err) {
       res.status(500).json({ error: '작가 추가 중 오류가 발생했습니다.' });
   }
});

// 작가 수정
router.put('/update', async (req, res) => {
   try {
       await updateSql.updateAuthor(req.body);
       res.json({ success: true });
   } catch (err) {
       res.status(500).json({ error: '작가 수정 중 오류가 발생했습니다.' });
   }
});

// 작가 삭제
router.delete('/:name', async (req, res) => {
   try {
       await deleteSql.deleteAuthor(req.params.name);
       res.json({ success: true });
   } catch (err) {
       res.status(500).json({ error: '작가 삭제 중 오류가 발생했습니다.' });
   }
});

router.post('/lock/:name', async (req, res) => {
    try {
        const result = await lockSql.lockAuthor(req.params.name);
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

router.post('/unlock/:name', async (req, res) => {
    await lockSql.unlockAuthor(req.params.name);
    res.json({ success: true });
});

module.exports = router;