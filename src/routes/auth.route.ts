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
    failureRedirect: `${process.env.CLIENT_URI}/login?error=auth_failed`,
  }),
  (req, res) => {
    if (req.user) {
      res.redirect(
        `${process.env.CLIENT_URI!}?res=${encodeURIComponent(
          JSON.stringify(req.user)
        )}`
      );
    } else {
      res.redirect(`${process.env.CLIENT_URI}/login?error=no_user`);
    }
  }
);

//facebook login
router.get('/facebook', passport.authenticate('facebook'));
router.get(
  '/facebook/callback',
  passport.authenticate('facebook', {
    failureRedirect: `${process.env.CLIENT_URI}/login`,
  }),
  (req, res) => {
    if (req.user) {
      res.redirect(
        `${process.env.CLIENT_URI!}?res=${encodeURIComponent(
          JSON.stringify(req.user)
        )}`
      );
    } else {
      res.redirect(`${process.env.CLIENT_URI}/login?error=no_user`);
    }
  }
);

//normal login
router.post('/login', loginController);
router.post('/signup', signupController);
router.post('/forget-password', forgetPassword);
router.post('/reset-password', resetPassword);

export default router;