import express from "express";
import { selectSql } from "../database/sql";

const router = express.Router();

router.get('/', (req, res) => { // get 메서드
    res.render('login'); // login.hbs 넘겨주기
});

router.post('/', async (req, res) => {
    const vars = req.body;
    const users = await selectSql.getUser();

    users.map((user) => { // 입력한 정보와 비교
        console.log('ID :', user.id);   
        if (vars.id === user.id && vars.password === user.password) {
            console.log('login success!');
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
        res.redirect('/delete'); // delete 페이지 redirect
    } else if (req.session.user.checkLogin && req.session.user.role === '학생') { // 학생일때
        res.redirect('/select'); // select 페이지 redirect
    }
});

module.exports = router;
