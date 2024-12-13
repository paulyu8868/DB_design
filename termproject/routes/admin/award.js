import express from 'express';
import { selectSql, insertSql, updateSql, deleteSql ,lockSql} from "../../database/sql";

const router = express.Router();

// 수상 정보 검색
router.get('/search', async (req, res) => {
   try {
       const awards = await selectSql.searchAward(req.query.name);
       res.json({ awards });
   } catch (err) {
       res.status(500).json({ error: '검색 결과가 존재하지 않습니다. 정확한 수상명을 입력해주세요.' });
   }
});

// 수상 정보 추가
router.post('/add', async (req, res) => {
   try {
       await insertSql.addAward(req.body);
       res.json({ success: true });
   } catch (err) {
       res.status(500).json({ error: '수상 정보 추가 중 오류가 발생했습니다.' });
   }
});

// 수상 정보 수정
router.put('/update', async (req, res) => {
   try {
       await updateSql.updateAward(req.body);
       res.json({ success: true });
   } catch (err) {
       res.status(500).json({ error: '수상 정보 수정 중 오류가 발생했습니다.' });
   }
});

// 수상 정보 삭제
router.delete('/:id', async (req, res) => {
   try {
       await deleteSql.deleteAward(req.params.id);
       res.json({ success: true });
   } catch (err) {
       res.status(500).json({ error: '수상 정보 삭제 중 오류가 발생했습니다.' });
   }
});

router.post('/lock/:id', async (req, res) => {
    try {
        const result = await lockSql.lockAward(req.params.id);
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

router.post('/unlock/:id', async (req, res) => {
    await lockSql.unlockAward(req.params.id);
    res.json({ success: true });
});

module.exports = router;