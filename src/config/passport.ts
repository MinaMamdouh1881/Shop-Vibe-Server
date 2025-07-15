import passport from 'passport';
var GoogleStrategy = require('passport-google-oauth20').Strategy;
import User from '../modules/user.schema';
import dotenv from 'dotenv';
dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID!,
      clientSecret: process.env.CLIENT_SECRET!,
      callbackURL: `${process.env.SERVER_URI}/auth/google/callback`,
    },
    async (
      accessToken: unknown,
      refreshToken: unknown,
      profile: { id: string; displayName: string; emails: { value: string }[] },
      done: Function
    ) => {
      try {
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
          user = await User.create({
            googleId: profile.id,
            userName: profile.displayName,
            email: profile.emails[0].value,
          });
        }
        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
