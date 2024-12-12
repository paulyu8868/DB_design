import express from 'express';
import logger from 'morgan';
import path from 'path';
import expressSession from "express-session";
import hbs from 'hbs';
import loginRouter from '../routes/login';
import adminRouter from '../routes/admin/dashboard';
import bookRouter from '../routes/admin/book';
import authorRouter from '../routes/admin/author';
import awardRouter from '../routes/admin/award';
import warehouseRouter from '../routes/admin/warehouse';
import inventoryRouter from '../routes/admin/inventory';
import containsRouter from '../routes/admin/contains';

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, '/src')));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(expressSession({
   secret: "my key",
   resave: true,
   saveUninitialized: true,
}));

app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'hbs');
hbs.registerPartials(path.join(__dirname, '../views/layouts'));
app.set('view options', { layout: 'layouts/main' });

app.use(logger('dev'));

app.use('/', loginRouter);
app.use('/admin', adminRouter);
app.use('/admin/book', bookRouter);
app.use('/admin/author', authorRouter);
app.use('/admin/award', awardRouter);
app.use('/admin/warehouse', warehouseRouter);
app.use('/admin/inventory', inventoryRouter);
app.use('/admin/contains', containsRouter);

app.listen(PORT, () => {
   console.log(`Server running at http://localhost:${PORT}`);
});