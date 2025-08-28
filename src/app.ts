import express from 'express';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import cors from 'cors';
import passport from 'passport';
import connectToDb from './lib/connectToDb';
import authRouter from './routes/auth.route';
require('dotenv').config();
import './config/passport';
import productRouter from './routes/product.route';
import cartAndFavRouter from './routes/cartAndFav.route';
import checkoutRouter from './routes/checkout.route';

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
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);
app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);

app.use(express.json());
app.use(express.static('public'));

app.use(passport.initialize());
app.use(passport.session());

connectToDb();

app.get('/', (req, res) => {
  res.send('Welcome');
});
app.use('/auth', authRouter);
app.use('/products', productRouter);
app.use('/cartAndFav', cartAndFavRouter);
app.use('/checkout', checkoutRouter);

export default app;
