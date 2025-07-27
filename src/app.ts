import express from 'express';
import dotenv from 'dotenv';
import passport from 'passport';
import authRoutes from './routes/auth.routes';
import './strategies/google.strategy';
import { traceRequest } from './middlewares/requestLogger.middleware'; // подключаем твой логгер

dotenv.config();

const app = express();
app.use(express.json());
app.use(passport.initialize());
app.use(traceRequest);

app.use((req, _res, next) => {
    let total = 0;
    req.on('data', chunk => { total += chunk.length });
    req.on('end', () => console.log(`✅ Read ${total} bytes in auth`));
    next();
});

app.use((req, res, next) => {
    req.on('aborted', () => console.log('❌ Request aborted'));
    req.on('end', () => console.log('✅ Request stream ended'));
    next();
});

app.use(authRoutes);

export default app;

