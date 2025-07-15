import { Router } from 'express';
import passport from 'passport';
require('dotenv').config();

const router = Router();

router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    successRedirect: `${process.env.SERVER_URI}/auth/login/success`,
    failureRedirect: '/auth/login/faild',
  })
);

router.get('/login/success', (req, res) => {
  console.log('login google success', req.user);

  if (req.user) {
    res.redirect(`${process.env.CLIENT_URI!}?user=${JSON.stringify(req.user)}`);
  } else {
    res.status(401).json({
      success: false,
      message: 'User not authenticated',
    });
  }
});

router.get('/login/faild', (_, res) => {
  res.status(401).json({ error: 'Login failed' });
});

export default router;
