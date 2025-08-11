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
      res
        .status(400)
        .json({ success: false, error: 'Email and password are required' });
      return;
    }
    const user = await User.findOne({ email })
      .populate('myCart.productId', 'name price images')
      .populate('myFavorites', 'name price images');
    if (!user) {
      res.status(404).json({ success: false, error: 'User not found' });
      return;
    }
    const hashedPassword = hashPassword(password, user.salt);
    if (user.password !== hashedPassword) {
      res.status(401).json({ success: false, error: 'Invalid password' });
      return;
    }
    const token = await createToken({
      id: user._id,
      rule: user.rule,
    });

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        userName: user.userName,
        rule: user.rule,
        myFavorites: user.myFavorites,
        myCart: user.myCart,
      },
    });
  } catch (error) {
    console.log('Error in login route:', error);
    res
      .status(500)
      .json({ success: false, error: 'An error occurred during login' });
  }
}

export async function signupController(req: Request, res: Response) {
  try {
    const { userName, email, password } = req.body;
    if (!userName || !email || !password) {
      res
        .status(400)
        .json({ success: false, error: 'All fields are required' });
      return;
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ success: false, error: 'User already exists' });
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
      rule: newUser.rule,
    });

    res.status(201).json({
      success: true,
      token,
      user: {
        id: newUser._id,
        userName: newUser.userName,
        rule: newUser.rule,
        myFavorites: newUser.myFavorites,
        myCart: newUser.myCart,
      },
    });
    return;
  } catch (error) {
    console.log('Error in login route:', error);
    res
      .status(500)
      .json({ success: false, error: 'An error occurred during login' });
    return;
  }
}

export async function forgetPassword(req: Request, res: Response) {
  try {
    const { email }: { email: string } = req.body;
    if (!email) {
      res.status(400).json({ success: false, error: 'Email required' });
      return;
    }
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      res.status(404).json({ success: false, error: 'Email Not Found' });
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

    res.status(200).json({
      success: true,
      msg: 'Please Check Your Email You Have Only 15m',
    });
    return;
  } catch (error) {
    console.log('Error in forgetPassword', error);
    res.status(500).json({ success: false, error: 'An error occurred' });
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

    res.status(200).json({ success: true, msg: 'Reset Password Successfully' });
    return;
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      res
        .status(403)
        .json({ success: false, error: 'You Are Late Please Try Again' });
      return;
    }
    if (error instanceof JsonWebTokenError) {
      res.status(404).json({
        success: false,
        error: 'Some Thing Went Wrong Please Try Again Later',
      });
      return;
    }
    console.log('Error in login route:', error);
    res
      .status(500)
      .json({ success: false, error: 'An error occurred during login' });
    return;
  }
}
