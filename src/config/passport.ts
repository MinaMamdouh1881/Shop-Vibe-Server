import passport from 'passport';
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
import User from '../modules/user.schema';
import createToken from '../lib/createToken';
import Cart from '../modules/cart.schema';
import WishList from '../modules/wishlist.schema';

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
      profile: { id: string; displayName: string },
      done: Function
    ) => {
      try {
        const user = await User.findOneAndUpdate(
          { googleId: profile.id },
          {
            $setOnInsert: {
              userName: profile.displayName,
              googleId: profile.id,
            },
          },
          { new: true, upsert: true }
        );
        const [cart, wishList] = await Promise.all([
          Cart.findOneAndUpdate(
            { user: user._id },
            { $setOnInsert: { user: user._id, items: [] } },
            { new: true, upsert: true }
          ).populate('items.product', 'name price image'),

          WishList.findOneAndUpdate(
            { user: user._id },
            { $setOnInsert: { user: user._id, items: [] } },
            { new: true, upsert: true }
          ).populate('items', 'name price image'),
        ]);
        const fullUser = {
          success: true,
          token: await createToken({ id: user._id, rule: user.rule }),
          user: {
            id: user._id,
            userName: user.userName,
            rule: user.rule,
            myFavorites: wishList?.items || [],
            myCart: cart?.items || [],
          },
        };
        done(null, fullUser);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: `${process.env.SERVER_URI}/auth/facebook/callback`,
      profileFields: ['id', 'displayName'],
    },
    async (
      accessToken: unknown,
      refreshToken: unknown,
      profile: { id: string; displayName: string },
      done: Function
    ) => {
      try {
        const user = await User.findOneAndUpdate(
          { facebookId: profile.id },
          {
            $setOnInsert: {
              userName: profile.displayName,
              facebookId: profile.id,
            },
          },
          { new: true, upsert: true }
        );
        const [cart, wishList] = await Promise.all([
          Cart.findOneAndUpdate(
            { user: user._id },
            { $setOnInsert: { user: user._id, items: [] } },
            { new: true, upsert: true }
          ).populate('items.product', 'name price image'),

          WishList.findOneAndUpdate(
            { user: user._id },
            { $setOnInsert: { user: user._id, items: [] } },
            { new: true, upsert: true }
          ).populate('items', 'name price image'),
        ]);
        const fullUser = {
          success: true,
          token: await createToken({ id: user._id, rule: user.rule }),
          user: {
            id: user._id,
            userName: user.userName,
            rule: user.rule,
            myFavorites: wishList?.items || [],
            myCart: cart?.items || [],
          },
        };
        done(null, fullUser);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user.user.id);
});


passport.deserializeUser(async (user: object, done) => {
  try {
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});