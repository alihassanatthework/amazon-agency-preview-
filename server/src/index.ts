import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import { leadsRouter } from './routes/leads.js';

const app = express();
const PORT = Number(process.env.PORT ?? 4000);
const MONGO_URI = process.env.MONGO_URI ?? 'mongodb://127.0.0.1:27017/northbeam';

app.use(cors({ origin: process.env.CLIENT_ORIGIN ?? true }));
app.use(express.json({ limit: '32kb' }));

/* A public form endpoint needs a submission ceiling. */
app.use(
  '/api/leads',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 20,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { ok: false, message: 'Too many submissions. Please try again shortly.' },
  }),
);

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

app.use('/api/leads', leadsRouter);

/* The API stays up without Mongo so the front end can be developed and the
   failure path exercised; submissions then return 503 rather than a false
   success, and no lead is silently lost. */
mongoose
  .connect(MONGO_URI, { serverSelectionTimeoutMS: 3000 })
  .then(() => console.log('[db] connected'))
  .catch((err) => console.warn('[db] not connected —', err.message));

app.listen(PORT, () => console.log(`[api] listening on http://localhost:${PORT}`));
