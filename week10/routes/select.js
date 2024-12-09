import express from 'express';
import { selectSql } from '../database/sql';

const router = express.Router();

// select 페이지에 표시할 정보 불러오기
router.get('/', async (req, res) => { // get 메서드
    if (req.session.user == undefined) {  
        res.redirect('/');} // 홈 화면 redirect
    else if (req.session.user.role === '학생' ) {  // 학생일때만 학생정보 열람 가능
        const student = await selectSql.getStudent(); // student 테이블 정보 가져오기
        res.render('select', { // select 페이지에 정보 전송
            title: "High-tech Students", // 제목
            student, // student 객체
        });
    } else { // 이외에는 홈화면을 넘겨줌
        res.redirect('/sugang');
    }
});

module.exports = router;

