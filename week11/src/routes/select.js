import express from "express";
// TODO
// sql import
import { createSql, selectSql } from "../database/sql";


const router = express.Router();

router.get('/', async function (req, res) {
    // TODO
    const allClass = await selectSql.getClass();
    const classes = await selectSql.getStudentClass();
    if (req.cookies.user) {
        res.render('select', {
            classes,
            allClass,
            user: req.cookies.user,
            title: "Course completion list" ,
            title2: "Course List (Registraion)"});
    } else {
        res.render('/')
    }

});

router.post('/', async(req, res) => {
    // TODO
    const data = {
        cId: req.body.applyBtn,
        sId: req.cookies.user,
    };
    await createSql.addClass(data);
    res.redirect('/sugang')
});

module.exports = router;