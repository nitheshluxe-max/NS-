import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { devBackendMiddleware } from './src/server/devBackendApi.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// In AI Studio / Cloud Run, Nginx listens on 8080 and reverse proxies to port 3000.
// Cloud Run injects PORT=8080 for the container entry point.
// The Node backend must ALWAYS listen on port 3000 (never 8080, which causes fatal EADDRINUSE).
const port = (process.env.APP_PORT ? Number(process.env.APP_PORT) : (process.env.PORT && process.env.PORT !== '8080' ? Number(process.env.PORT) : 3000));

// Enable JSON body parsing for API endpoints
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Mount central backend database & REST API middleware
app.use((req, res, next) => {
  devBackendMiddleware(req, res, next);
});

// Serve production static assets from dist
const distPath = path.resolve(__dirname, 'dist');
app.use(express.static(distPath, {
  maxAge: '1h',
  etag: true
}));

// Fallback all SPA routes to index.html
app.get('*', (req, res) => {
  res.sendFile(path.resolve(distPath, 'index.html'));
});

const server = app.listen(port, '0.0.0.0', () => {
  console.log(`[NS Properties] Production server running on http://0.0.0.0:${port}`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});
