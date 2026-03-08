import express from 'express';
import cors from 'cors';
import { storiesRouter } from './routes/stories.js';
import { progressRouter } from './routes/progress.js';
import { analyticsRouter } from './routes/analytics.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/stories', storiesRouter);
app.use('/api/progress', progressRouter);
app.use('/api/analytics', analyticsRouter);

// Health check
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`✨ Mindful Tales API running on http://localhost:${PORT}`);
});
