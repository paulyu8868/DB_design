import express from 'express';
const router = express.Router();

// 대시보드 페이지 (/customer)
router.get('/', (req, res) => {
    if (req.session.user && req.session.user.role === '고객') {
        res.render('customer/dashboard');
    } else {
        res.redirect('/');
    }
});

// 예약 관리 페이지 (/customer/reservation)
router.get('/reservation', (req, res) => {
    if (req.session.user && req.session.user.role === '고객') {
        res.render('customer/reservation');
    } else {
        res.redirect('/');
    }
});

// 주문 관리 페이지 (/customer/order)
router.get('/order', (req, res) => {
    if (req.session.user && req.session.user.role === '고객') {
        res.render('customer/order');
    } else {
        res.redirect('/');
    }
});

module.exports = router;