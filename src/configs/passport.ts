import passport from 'passport';
import Localstrategy from 'passport-local';
import {Strategy as JWTStrategy, ExtractJwt} from 'passport-jwt';

import {User, UserDocument} from '../models/user/User';
import {constants} from '../configs/constants';

const localOpts = {
  usernameField: 'email',
  passwordFiled: 'password',
};

// Local strategy
const localStrategy = new Localstrategy.Strategy(
    localOpts,
    async (email: string, password: string, done: any) => {
      try {
        const user = await User.findOne({email}) as UserDocument;

        if (!user) {
          return done(null, false);
        } else if (!user.authenticateUser(password)) {
          return done(null, false);
        }

        return done(null, user);
      } catch (e) {
        return done(e, false);
      }
    });

// JWT strategy
const jwtOpts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: constants.JWT_SECRET,
};

const jwtStrategy = new JWTStrategy(jwtOpts, async (payload, done) => {
  try {
    const user = await User.findById(payload._id);

    if (!user) {
      return done(null, false);
    }

    return done(null, user);
  } catch (e) {
    return done(e, false);
  }
});

passport.use(localStrategy);
passport.use(jwtStrategy);

export const authLocal = passport.authenticate('local', {session: false});
export const authJwt = passport.authenticate('jwt', {session: false});
