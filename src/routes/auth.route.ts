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
  console.log(req.user);

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
// import { Router } from 'express';
// import passport from 'passport';
// import {
//   loginController,
//   signupController,
//   forgetPassword,
//   resetPassword,
// } from '../controllers/auth.controller';
// require('dotenv').config();

// const router = Router();

// // Google login
// router.get(
//   '/google',
//   passport.authenticate('google', { scope: ['profile', 'email'] })
// );

// router.get(
//   '/google/callback',
//   passport.authenticate('google', {
//     failureRedirect: `${process.env.CLIENT_URI}/login?error=auth_failed`,
//   }),
//   (req, res) => {
//     // Handle success manually instead of using successRedirect
//     console.log('Google auth success, user:', req.user);

//     if (req.user) {
//       // Option 1: Redirect with user data
//       res.redirect(
//         `${process.env.CLIENT_URI}?auth=success&user=${encodeURIComponent(
//           JSON.stringify(req.user)
//         )}`
//       );
//     } else {
//       res.redirect(`${process.env.CLIENT_URI}/login?error=no_user`);
//     }
//   }
// );

// // Facebook login
// router.get(
//   '/facebook',
//   passport.authenticate('facebook', { scope: ['email'] })
// );

// router.get(
//   '/facebook/callback',
//   passport.authenticate('facebook', {
//     failureRedirect: `${process.env.CLIENT_URI}/login?error=auth_failed`,
//   }),
//   (req, res) => {
//     console.log('Facebook auth success, user:', req.user);

//     if (req.user) {
//       res.redirect(
//         `${process.env.CLIENT_URI}?auth=success&user=${encodeURIComponent(
//           JSON.stringify(req.user)
//         )}`
//       );
//     } else {
//       res.redirect(`${process.env.CLIENT_URI}/login?error=no_user`);
//     }
//   }
// );

// // Success endpoint with better error handling
// router.get('/login/success', (req, res) => {
//   console.log('Login success route hit');
//   console.log('Session ID:', req.sessionID);
//   console.log('User from session:', req.user);
//   console.log('Is authenticated:', req.isAuthenticated());

//   if (req.user && req.isAuthenticated()) {
//     res.json({
//       success: true,
//       user: req.user,
//       message: 'Authentication successful',
//     });
//   } else {
//     res.status(401).json({
//       success: false,
//       message: 'User not authenticated',
//       debug: {
//         hasUser: !!req.user,
//         isAuthenticated: req.isAuthenticated(),
//         sessionID: req.sessionID,
//       },
//     });
//   }
// });

// router.get('/login/failed', (req, res) => {
//   console.log('Login failed route hit');
//   res.status(401).json({
//     error: 'Login failed',
//     message: 'OAuth authentication failed',
//   });
// });

// // Add logout route
// router.post('/logout', (req, res) => {
//   req.logout((err) => {
//     if (err) {
//       return res.status(500).json({ error: 'Logout failed' });
//     }
//     req.session.destroy((err) => {
//       if (err) {
//         return res.status(500).json({ error: 'Session destroy failed' });
//       }
//       res.clearCookie('connect.sid'); // Clear session cookie
//       res.json({ success: true, message: 'Logged out successfully' });
//     });
//   });
// });

// // Check authentication status
// router.get('/status', (req, res) => {
//   res.json({
//     isAuthenticated: req.isAuthenticated(),
//     user: req.user || null,
//     sessionID: req.sessionID,
//   });
// });

// // Normal login
// router.post('/login', loginController);
// router.post('/signup', signupController);
// router.post('/forget-password', forgetPassword);
// router.post('/reset-password', resetPassword);

// export default router;