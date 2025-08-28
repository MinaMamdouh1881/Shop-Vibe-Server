import { Router } from 'express';
import passport from 'passport';
import {
  loginController,
  signupController,
  forgetPassword,
  resetPassword,
} from '../controllers/auth.controller';
require('dotenv').config();

const router = Router();

//google login

router.get('/google', passport.authenticate('google', { scope: ['profile'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', {
    successRedirect: `${process.env.SERVER_URI}/auth/login/success`,
    failureRedirect: '/auth/login/failed',
  })
);

//facebook login

router.get('/facebook', passport.authenticate('facebook'));

router.get(
  '/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: `${process.env.SERVER_URI}/auth/login/success`,
    failureRedirect: `${process.env.CLIENT_URI}/login`,
  })
);

router.get('/login/success', (req, res) => {
  console.log(req);
  
  if (req.user) {
    res.redirect(
      `${process.env.CLIENT_URI!}?res=${encodeURIComponent(
        JSON.stringify(req.user)
      )}`
    );
    // res.json(req.user);
  } else {
    res.status(401).json({
      success: false,
      message: 'User not authenticated',
    });
  }
});

router.get('/login/failed', (_, res) => {
  res.status(401).json({ error: 'Login failed' });
});

//normal login

router.post('/login', loginController);
router.post('/signup', signupController);
router.post('/forget-password', forgetPassword);
router.post('/reset-password', resetPassword);

export default router;
