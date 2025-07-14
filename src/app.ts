import express from 'express';
import dotenv from 'dotenv';
import passport from 'passport';
import authRoutes from './routes/auth.routes';
import './strategies/google.strategy';

dotenv.config();

const app = express();
app.use(express.json());
app.use(passport.initialize());
app.use('/api/auth', authRoutes);

export default app;

