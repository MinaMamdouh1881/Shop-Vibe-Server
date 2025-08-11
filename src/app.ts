import express from 'express';
import session from 'express-session';
import cors from 'cors';
import passport from 'passport';
import connectToDb from './lib/connectToDb';
import authRouter from './routes/auth.route';
import verifyToken from './middlewares/verifyToken';
require('dotenv').config();
import './config/passport';
import productRouter from './routes/product.route';
import cartAndFavRouter from './routes/cartAndFav.route';

const app = express();

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'yourSecretKey',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // true لو على HTTPS
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

app.use(cors({ origin: process.env.CLIENT_URI, credentials: true }));
app.use(express.json());
app.use(express.static('public'));

app.use(passport.initialize());
app.use(passport.session());

connectToDb();

app.get('/', verifyToken, (req, res) => {
  res.send('Welcome');
});
app.use('/auth', authRouter);
app.use('/products', productRouter);
app.use('/cartAndFav', cartAndFavRouter);

export default app;
