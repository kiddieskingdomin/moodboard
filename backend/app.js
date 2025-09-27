import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

const app = express();

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

// health check route
app.get('/api/health', (_req, res) => {
  res.json({ ok: true, env: process.env.NODE_ENV });
});

export default app;
