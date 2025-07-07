import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import loginRouter from '../src/routes/login.route';
import signupRouter from '../src/routes/signup.route';
import connectToDb from './lib/connectToDb';
import verifyToken from './middlewares/verifyToken';

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());
connectToDb();

app.get('/', verifyToken, (req, res) => {
  console.log('Hit Server');
  console.log(req.user);
  res.send('Wellcome');
});

app.use('/login', loginRouter);
app.use('/signup', signupRouter);

app.listen(4000, () => {
  console.log('server running');
});
