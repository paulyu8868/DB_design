import express from 'express';
import { selectSql, deleteSql } from '../database/sql';

const router = express.Router();

router.get('/', async (req, res) => {
    if (req.session.user != undefined && req.session.user.role === '관리자') {
        const department = await selectSql.getDepartment();
        res.render('delete', {
            title: "Delete",
            department,
        });
    } else{
        res.redirect('/');
    }
});

router.post('/', async (req, res) => {
    console.log("delete :", req.body.delBtn);
    const data = {
        id: req.body.delBtn,
    };

    await deleteSql.deleteDepartment(data);

    res.redirect('/delete');
});

router.get('/class', async (req, res) => { // url이 /delete/class 일때
    if (req.session.user != undefined && req.session.user.role === '학생') { // 로그인 정보가 학생이면
        const classAll = await selectSql.getStudentClass(req); // class 정보 불러오기
        res.render('deleteClass', {
            title: "Delete Class",
            classAll,
        });
    } else{ // 학생이 아니면 홈으로
        res.redirect('/');
    }
});

router.post('/class', async (req, res) => {
    console.log("delete :", req.body.delBtn);
    const data = {
        cId: req.body.delBtn,
        sId: req.session.user.id
    };

    await deleteSql.deleteStudentClass(data);

    res.redirect('/delete/class');
});

module.exports = router;

