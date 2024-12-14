import express from 'express';
import { selectSql, insertSql, updateSql, deleteSql, lockSql } from "../../database/sql";

const router = express.Router();

// 도서 검색
router.get('/search', async (req, res) => {
    try {
        const books = await selectSql.searchBooks(req.query.title);
        res.json({ books });
    } catch (err) {
        res.status(500).json({ error: '검색 결과가 존재하지 않습니다. 정확한 도서명을 입력해주세요.' });
    }
});

// 도서 추가
router.post('/add', async (req, res) => {
    try {
        await insertSql.addBook(req.body);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: '도서 추가 중 오류가 발생했습니다.' });
    }
});

// 도서 수정
router.put('/update', async (req, res) => {
    try {
        const result = await updateSql.updateBook(req.body);
        res.json({ success: true });
        console.log(result)
    } catch (err) {
        res.status(500).json({ error: '도서 수정 중 오류가 발생했습니다.' });
    }
});

// 도서 삭제
router.delete('/:isbn', async (req, res) => {
    try {
        await deleteSql.deleteBook(req.params.isbn);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: '도서 삭제 중 오류가 발생했습니다.' });
    }
});

// LOCK 요청
router.post('/lock/:isbn', async (req, res) => {
    try {
        const result = await lockSql.lockBook(req.params.isbn);
        if (!result) {  // lock 실패
            return res.json({ 
                success: false, 
                error: '다른 관리자가 수정 중입니다.' 
            });
        }
        res.json({ success: true });
    } catch (err) {
        console.error('Lock error:', err);
        res.json({ 
            success: false, 
            error: '다른 관리자가 수정 중입니다.' 
        });
    }
});

// UNLOCK 요청
router.post('/unlock/:isbn', async (req, res) => {
    await lockSql.unlockBook(req.params.isbn);  // isbn 전달
    res.json({ success: true });
});

module.exports = router;