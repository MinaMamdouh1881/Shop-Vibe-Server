import { Request, Response } from 'express';
import User from '../modules/user.schema';
import { hashPassword } from '../lib/passords';
import createToken from '../lib/createToken';

export default async function loginController(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    const user = await User.findOne({ email });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    if (user.googleId) {
      res.status(400).json({ error: 'Please Login With Google' });
      return;
    }

    const hashedPassword = hashPassword(password, user.salt);
    if (user.password !== hashedPassword) {
      res.status(401).json({ error: 'Invalid password' });
      return;
    }

    const token = await createToken({
      id: user._id,
      email: user.email,
      rule: user.rule,
    });

    res
      .status(200)
      .set({
        authorization: `Bearer ${token}`,
      })
      .json({
        message: 'Login successful',
        user: {
          id: user._id,
          userName: user.userName,
          email: user.email,
          rule: user.rule,
        },
      });
    // res
    //   .status(200)
    //   .set({
    //     Authorization: `Bearer ${token}`,
    //     'Access-Control-Expose-Headers': 'Authorization',
    //   })
    //   .json({
    //     message: 'Login successful',
    //     user: {
    //       id: user._id,
    //       userName: user.userName,
    //       email: user.email,
    //       rule: user.rule,
    //     },
    //   });
  } catch (error) {
    console.log('Error in login route:', error);
    res.status(500).json({ error: 'An error occurred during login' });
  }
}
