import express from 'express';
import session from 'express-session';
import cors from 'cors';
import passport from 'passport';
import connectToDb from './lib/connectToDb';
import loginRouter from './routes/login.route';
import signupRouter from './routes/signup.route';
import authRouter from './routes/auth.route';
import verifyToken from './middlewares/verifyToken';
import './config/passport';

require('dotenv').config();

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

app.use(passport.initialize());
app.use(passport.session());

connectToDb();

app.get('/', verifyToken, (req, res) => {
  res.send('Welcome');
});

app.use('/login', loginRouter);
app.use('/signup', signupRouter);
app.use('/auth', authRouter);

export default app;
