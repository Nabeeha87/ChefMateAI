# ============================================================
# ChefMate AI — Multi-stage Dockerfile
# Stage 1: Build the Vite frontend
# Stage 2: Set up the Express backend + serve static frontend
# ============================================================

# --- Stage 1: Build frontend ---
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend

# Copy frontend manifest and install deps
COPY package.json package-lock.json* ./
RUN npm ci

# Copy frontend source and build
COPY index.html vite.config.ts tsconfig.json tsconfig.app.json tsconfig.node.json ./
COPY tailwind.config.js postcss.config.js eslint.config.js ./
COPY src/ ./src/
COPY public/ ./public/

RUN npm run build

# --- Stage 2: Backend + serve ---
FROM node:20-alpine AS production

WORKDIR /app

# Copy backend manifest and install production deps
COPY backend/package.json backend/package-lock.json* ./
RUN npm install --omit=dev

# Copy backend source
COPY backend/src/ ./src/

# Copy built frontend into a directory the backend can serve
COPY --from=frontend-builder /app/dist ./public

# Install a minimal env loader is already in deps; expose port
ENV NODE_ENV=production
ENV PORT=3001
EXPOSE 3001

# Healthcheck hits the backend /health endpoint
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:3001/health || exit 1

CMD ["node", "src/server.js"]
