import bcrypt from 'bcrypt';
import passport from '../config/passport.config.js';
import { userModel } from '../models/user.model.js';
import { loginSchema, registerSchema } from '../validation/auth.schemas.js';

export const login = (req, res, next) => {
  console.log('POST /api/auth/login');

  try {
    loginSchema.parse(req.body);
  } catch (error) {
    return res.status(400).json({
      error: 'Validation failed',
      details: error.errors,
    });
  }

  return passport.authenticate('local', (err, user, info) => {
    if (err) {
      console.error('Login error:', err);
      return res.status(500).json({ error: 'Login failed. Please try again.' });
    }

    if (!user) {
      return res.status(401).json({ error: info.message || 'Invalid credentials' });
    }

    return req.logIn(user, (err2) => {
      if (err2) {
        console.error('Session error:', err2);
        return res.status(500).json({ error: 'Login failed. Please try again.' });
      }

      return res.json({
        message: 'Login successful',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    });
  })(req, res, next);
};

export const register = async (req, res) => {
  console.log('POST /api/auth/register');
  try {
    const validatedData = registerSchema.parse(req.body);
    const { name, email, password } = validatedData;

    const existingUser = await userModel.getByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered!' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      message: 'Registration successful. Please log in.',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.errors,
      });
    }
    console.error('Registration error:', error);
    return res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
};

export const logout = (req, res) => {
  console.log('POST /api/auth/logout');
  return req.logout((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ error: 'Logout failed' });
    }

    return req.session.destroy((err2) => {
      if (err2) {
        console.error('Session destroy error:', err2);
        return res.status(500).json({ error: 'Logout failed' });
      }

      res.clearCookie('connect.sid');
      return res.json({ message: 'Logout successful' });
    });
  });
};

export const me = (req, res) => {
  console.log('GET /api/auth/me');

  if (!req.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  return res.json({
    user: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    },
  });
};
