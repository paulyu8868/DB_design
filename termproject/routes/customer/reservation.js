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
       const searchType = req.query.type;  // title, author, award
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
       res.status(500).json({ error: '검색 중 오류가 발생했습니다.' });
   }
});

// 예약 추가
router.post('/add', async (req, res) => {
   try {

       // 10분 이내 중복 예약 체크
       const overlap = await selectSql.checkReservationOverlap(
           req.body.pickupTime
       );
       
       if (overlap) { // 10분 이내에 다른 예약 존재시
           return res.json({ 
               success: false, 
               error: '해당 시간의 10분 이내에 이미 예약이 있습니다. 다른 시간을 이용해주세요.' 
           });
       }
       

       await insertSql.addReservation({
           customer_id: req.session.user.cid,
           book_isbn: req.body.isbn,
           pickup_time: req.body.pickupTime
       });

       res.json({ success: true });
   } catch (err) {
        console.log(err);
       res.status(500).json({ error: err });
   }
});

// 내 예약 목록 조회
router.get('/my', async (req, res) => {
   try {
       const reservations = await selectSql.getMyReservations(req.session.user.cid);
       res.json({ reservations });
   } catch (err) {
       res.status(500).json({ error: '예약 조회 중 오류가 발생했습니다.' });
   }
});

// 예약 수정 (픽업 시간)
router.put('/update/:id', async (req, res) => {
   try {
       // 10분 이내 중복 예약 체크
       const overlap = await selectSql.checkReservationOverlap(
           req.body.pickupTime
       );
       
       if (overlap) {
           return res.json({ 
               success: false, 
               error: '해당 시간의 10분 이내에 이미 예약이 있습니다. 다른 시간을 이용해주세요.' 
           });
       }

       await updateSql.updateReservation({
           id: req.params.id,
           pickup_time: req.body.pickupTime
       });

       res.json({ success: true });
   } catch (err) {
       res.status(500).json({ error: '예약 수정 중 오류가 발생했습니다.' });
   }
});

// 예약 취소
router.delete('/:id', async (req, res) => {
   try {
       await deleteSql.deleteReservation(req.params.id);
       res.json({ success: true });
   } catch (err) {
       res.status(500).json({ error: '예약 취소 중 오류가 발생했습니다.' });
   }
});

module.exports = router;