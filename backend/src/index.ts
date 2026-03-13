import './config/env.js';
import type { Request, Response } from 'express';
import express from 'express';
import cors from 'cors';
import casesRouter from './routes/cases.js';
import servicesRouter from './routes/services.js';
import reviewsRouter from './routes/reviews.js';
import authRouter from './routes/auth.js';
import partnersRouter from './routes/partners.js';
import inquiriesRouter from './routes/inquiries.js';
import uploadRouter from './routes/upload.js';
import mediaRouter from './routes/media.js';
import foldersRouter from './routes/folders.js';
import settingsRoutes from './routes/settings.js';

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json({ limit: '500mb' }));
app.use(express.urlencoded({ limit: '500mb', extended: true }));

// Global logging middleware for debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  if (req.url.includes('/upload')) {
    console.log('Upload Request Headers:', JSON.stringify(req.headers, null, 2));
  }
  next();
});

app.use('/api/auth', authRouter);
app.use('/api/cases', casesRouter);
app.use('/api/services', servicesRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/partners', partnersRouter);
app.use('/api/inquiries', inquiriesRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/media', mediaRouter);
app.use('/api/folders', foldersRouter);
app.use('/api/settings', settingsRoutes);

app.get('/health', (req: Request, res: Response) => {
  console.log('Health check requested at:', new Date().toISOString());
  res.json({ status: 'ok', message: 'Hệ thống Backend đang hoạt động' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
