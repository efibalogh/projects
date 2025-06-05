import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import session from 'express-session';

import db from './config/db.config.js';
import passport from './config/passport.config.js';
import { errorMiddleware } from './middleware/error.middleware.js';
import authRoutes from './routes/auth.routes.js';
import courseRoutes from './routes/course.routes.js';
import invitationRoutes from './routes/invitation.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import userRoutes from './routes/user.routes.js';

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
};
app.use(cors(corsOptions));

// middleware
app.use('/uploads', express.static('uploads'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// session configuration for Passport.js
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your-secret-key-change-this-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: 'lax',
    },
  }),
);

// initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// routes
app.use('/api/courses', courseRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/invitations', invitationRoutes);
app.use('/api/notifications', notificationRoutes);

app.use(errorMiddleware);

// connect to database and start server
await db.pool
  .getConnection()
  .then((conn) => {
    conn.release();
    console.log('Database connected successfully');
  })
  .then(async () => {
    await db.init();
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });
