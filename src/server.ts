// import express from 'express';
// import dotenv from 'dotenv';
// import cors from 'cors';
// import loginRouter from '../src/routes/login.route';
// import signupRouter from '../src/routes/signup.route';
// import connectToDb from './lib/connectToDb';
// import verifyToken from './middlewares/verifyToken';
// import passport from 'passport';
// import './controllers/google.controller';
// import googleRouter from './routes/auth.route';
// import session from 'express-session';

// const app = express();
// dotenv.config();

// app.use(
//   session({
//     secret: 'yourSecretKey', // 🔒 غيّرها لقيمة سرية في بيئة الإنتاج
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       secure: false, // true لو بتستخدم HTTPS
//       maxAge: 1000 * 60 * 60 * 24, // يوم مثلاً
//     },
//   })
// );

// app.use(cors());
// app.use(express.json());
// app.use(passport.initialize());
// app.use(passport.session());
// connectToDb();

// app.get('/', verifyToken, (req, res) => {
//   console.log('Hit Server');
//   console.log(req.user);
//   res.send('Wellcome');
// });

// app.use('/login', loginRouter);
// app.use('/signup', signupRouter);
// app.use('/auth', googleRouter);

// app.listen(4000, () => {
//   console.log('server running');
// });
import app from './app';

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
