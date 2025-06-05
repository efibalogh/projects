/* eslint-disable no-unused-vars */

import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import { userModel } from '../models/user.model.js';

// Configure local strategy
passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, password, done) => {
      try {
        const user = await userModel.getByEmail(email);

        if (!user) {
          return done(null, false, { message: 'Invalid email or password' });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
          return done(null, false, { message: 'Invalid email or password' });
        }

        // Don't include password in the returned user object
        const { password: _, ...userWithoutPassword } = user;
        return done(null, userWithoutPassword);
      } catch (error) {
        return done(error);
      }
    },
  ),
);

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await userModel.get(id);
    if (!user) {
      return done(null, false);
    }
    const { password: _, ...userWithoutPassword } = user;
    return done(null, userWithoutPassword);
  } catch (error) {
    return done(error);
  }
});

export default passport;
