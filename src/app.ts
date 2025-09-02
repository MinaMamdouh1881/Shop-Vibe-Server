import express from 'express';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import cors from 'cors';
import connectToDb from './lib/connectToDb';
import authRouter from './routes/auth.route';
require('dotenv').config();
import './config/passport';
import productRouter from './routes/product.route';
import cartAndFavRouter from './routes/cartAndFav.route';
import checkoutRouter from './routes/checkout.route';
import pagesRouter from './routes/pages.route';

const app = express();

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'yourSecretKey',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI!,
      collectionName: 'sessions',
    }),
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);
import passport from 'passport';
app.use(
  cors({
    origin: [
      process.env.CLIENT_URI!,
      'http://localhost:5173',
      'https://shop-vibe-client.vercel.app',
    ],
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
      'Cookie',
    ],
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.use(passport.initialize());
app.use(passport.session());

connectToDb();

app.get('/', (req, res) => {
  res.send('Welcome');
});
app.use('/page', pagesRouter);
app.use('/auth', authRouter);
app.use('/products', productRouter);
app.use('/cartAndFav', cartAndFavRouter);
app.use('/checkout', checkoutRouter);

export default app;
