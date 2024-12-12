import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
    res.render('admin/dashboard');
});

// 다른 페이지로 렌더링
router.get('/:table', (req, res) => {
    const table = req.params.table;
    const validTables = ['book', 'author', 'award', 'warehouse', 'inventory', 'contains'];
    
    if (!validTables.includes(table)) {
        return res.status(404).send('Invalid table');
    }
    
    res.render(`admin/${table}`);
});

module.exports = router;