import { Request, Response } from 'express';
import User from '../modules/user.schema';
import { createSalt, hashPassword } from '../lib/passwords';
import createToken from '../lib/createToken';
import jwt, { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';
import sendEmail from '../lib/sendEmail';
export async function loginController(req: Request, res: Response) {
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
          myFavorites: user.myFavorites,
          myCart: user.myCart,
        },
      });
  } catch (error) {
    console.log('Error in login route:', error);
    res.status(500).json({ error: 'An error occurred during login' });
  }
}

export async function signupController(req: Request, res: Response) {
  try {
    const { userName, email, password } = req.body;

    if (!userName || !email || !password) {
      res.status(400).json({ error: 'All fields are required' });
      return;
    }

    const existingUser = await User.findOne({ email });

    if (existingUser && existingUser.googleId) {
      res.status(400).json({ error: 'Please Login With Google' });
      return;
    }
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
          myFavorites: newUser.myFavorites,
          myCart: newUser.myCart,
        },
      });
    return;
  } catch (error) {
    console.log('Error in login route:', error);
    res.status(500).json({ error: 'An error occurred during login' });
    return;
  }
}

export async function forgetPassword(req: Request, res: Response) {
  try {
    const { email }: { email: string } = req.body;

    if (!email) {
      res.status(400).json({ error: 'Email required' });
      return;
    }

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      res.status(404).json({ error: 'Email Not Found' });
      return;
    }

    const token = jwt.sign(
      { id: existingUser._id, email: existingUser.email },
      process.env.JWT_SECRET!,
      {
        expiresIn: '15m',
      }
    );

    await sendEmail({
      to: email,
      subject: 'Reset Your Password',
      content: `Please Click To The Link To Reset Your Password ${process.env.CLIENT_URI}/reset-password?token=${token}`,
    });

    res.status(200).json({ msg: 'Please Check Your Email You Have Only 15m' });
    return;
  } catch (error) {
    console.log('Error in forgetPassword', error);
    res.status(500).json({ error: 'An error occurred' });
    return;
  }
}

export async function resetPassword(req: Request, res: Response) {
  try {
    const { password, token }: { password: string; token: string } = req.body;
    const data = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      email: string;
    };

    const existingUser = await User.findById(data.id);
    const hashedPassword = hashPassword(password, existingUser.salt);

    if (hashedPassword === existingUser.password) {
      res.status(400).json({ error: 'Enter Different Password' });
      return;
    }
    await User.findByIdAndUpdate(data.id, {
      password: hashedPassword,
    });

    res.status(200).json({ msg: 'Reset Password Successfully' });
    return;
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      res.status(403).json({ error: 'You Are Late Please Try Again' });
      return;
    }
    if (error instanceof JsonWebTokenError) {
      res
        .status(404)
        .json({ error: 'Some Thing Went Wrong Please Try Again Later' });
      return;
    }
    console.log('Error in login route:', error);
    res.status(500).json({ error: 'An error occurred during login' });
    return;
  }
}
