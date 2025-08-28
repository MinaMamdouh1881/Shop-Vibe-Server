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
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
          user = await User.create({
            googleId: profile.id,
            userName: profile.displayName,
          });
        }
        done(null, user);
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
        let user = await User.findOne({ facebookId: profile.id });

        if (!user) {
          user = await User.create({
            facebookId: profile.id,
            userName: profile.displayName,
          });
          await Promise.all([
            Cart.create({ user: user._id }),
            WishList.create({ user: user._id }),
          ]);
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

    const [token, cart, wishList] = await Promise.all([
      createToken({
        id: user._id,
        rule: user.rule,
      }),

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

    const res = {
      success: true,
      token,
      user: {
        id: user._id,
        userName: user.userName,
        rule: user.rule,
        myFavorites: wishList?.items ? wishList.items : [],
        myCart: cart?.items ? cart.items : [],
      },
    };
    done(null, res);
  } catch (err) {
    done(err, null);
  }
});
