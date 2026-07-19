/**
 * ChefMate AI — Express.js backend server.
 *
 * Exposes POST /generate-recipe which proxies requests to OpenAI
 * with streaming, keeping the API key server-side at all times.
 */

import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { streamRecipeGeneration, HttpError } from './openai.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// --- Middleware ---

const allowedOrigins = (process.env.CORS_ORIGIN || '*')
  .split(',')
  .map((o) => o.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
  }),
);
app.use(express.json());

// Rate limiting — 10 recipe generations per minute per IP
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please slow down and try again shortly.' },
});
app.use('/generate-recipe', limiter);

// --- Routes ---

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'ChefMate AI Backend' });
});

app.post('/generate-recipe', async (req, res) => {
  try {
    const { ingredients, cuisine, dietaryPreference, cookingTime, difficulty } = req.body;

    // Validate input
    if (!ingredients || typeof ingredients !== 'string' || !ingredients.trim()) {
      return res.status(400).json({ error: 'Ingredients are required.' });
    }

    // Set up SSE streaming response
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    });

    const fullContent = await streamRecipeGeneration(
      { ingredients, cuisine, dietaryPreference, cookingTime, difficulty },
      {
        onDelta: (delta) => {
          res.write(`data: ${JSON.stringify({ delta })}\n\n`);
        },
      },
    );

    // Send the complete raw content so the client can parse the final JSON
    res.write(`data: ${JSON.stringify({ raw: fullContent })}\n\n`);
    res.write('data: [DONE]\n\n');
    res.end();
  } catch (err) {
    if (err instanceof HttpError) {
      // If headers not sent yet, send JSON error
      if (!res.headersSent) {
        return res.status(err.statusCode).json({ error: err.message });
      }
      // Otherwise send error via SSE
      res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
      res.end();
    } else {
      console.error('Unhandled error:', err);
      if (!res.headersSent) {
        return res.status(500).json({
          error: 'An unexpected error occurred while generating your recipe.',
        });
      }
      res.write(
        `data: ${JSON.stringify({ error: 'An unexpected error occurred.' })}\n\n`,
      );
      res.end();
    }
  }
});

// --- Start ---

// Serve the built frontend (from Docker's ./public directory) —
// this lets the single container serve both API and UI on one port.
const publicDir = path.resolve(__dirname, '..', 'public');
app.use(express.static(publicDir));

// SPA fallback: any non-API GET request returns index.html
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/generate-recipe') || req.path.startsWith('/health')) {
    return next();
  }
  res.sendFile(path.join(publicDir, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`ChefMate AI backend running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});
