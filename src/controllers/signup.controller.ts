import { Request, Response } from 'express';
import User from '../modules/user.schema';
import { createSalt, hashPassword } from '../lib/passords';
import createToken from '../lib/createToken';

export default async function signupController(req: Request, res: Response) {
  try {
    const { userName, email, password } = req.body;

    if (!userName || !email || !password) {
      res.status(400).json({ error: 'All fields are required' });
      return;
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      res.status(400).json({ error: 'User already exists' });
      return;
    }

    const salt = createSalt();
    const hashedPassword = hashPassword(password, salt);

    const newUser = await User.create({
      userName,
      email,
      password: hashedPassword,
      salt,
    });

    const token = await createToken({
      id: newUser._id,
      email: newUser.email,
      rule: newUser.rule,
    });

    res
      .status(201)
      .set({
        Authorization: `Bearer ${token}`,
      })
      .json({
        message: 'User created successfully',
        user: {
          id: newUser._id,
          userName: newUser.userName,
          email: newUser.email,
          rule: newUser.rule,
        },
      });
    return;
  } catch (error) {
    console.log('Error in login route:', error);
    res.status(500).json({ error: 'An error occurred during login' });
    return;
  }
}
