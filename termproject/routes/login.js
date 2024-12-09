import express from "express";
import { selectSql } from "../database/sql";

// 로그인 페이지

const router = express.Router();

router.get('/', (req, res) => { // get 메서드
    res.render('login'); // login.hbs 넘겨주기
});

router.post('/', async (req, res) => {
    const vars = req.body;
    const users = await selectSql.getUser(); // 사용자 정보 가져오기

    // 로그인 인증
    users.map((user) => { // user는 select 한 user 정보 
        //console.log('ID :', user.id);   
        if (vars.id === user.id && vars.password === user.password) {
            console.log('login success!');
            console.log(`${user.id} ${user.role}님 로그인`);
            req.session.user = { id: user.id, role: user.role, checkLogin: true };
        }
    });

    if (req.session.user == undefined) { // 매치되는 정보가 없으면 
        console.log('login failed!'); // 로그인 실패 로그 출력
        res.send(`<script>
                    alert('login failed!');
                    location.href='/';
                </script>`)
    } else if (req.session.user.checkLogin && req.session.user.role === '관리자') { // 관리자일때
        console.log('관리자 로그인');
        res.redirect('/admin'); // redirect
    } else if (req.session.user.checkLogin && req.session.user.role === '고객') { // 학생일때
        console.log('고객 로그인');
        res.redirect('/'); // 페이지 redirect
    }

});

module.exports = router;
