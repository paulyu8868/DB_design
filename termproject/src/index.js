import express from 'express';
import logger from 'morgan';
import path from 'path';
import expressSession from "express-session";
import hbs from 'hbs';
import loginRouter from '../routes/login';
import adminRouter from '../routes/admin';

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

app.listen(PORT, () => {
   console.log(`Server running at http://localhost:${PORT}`);
});