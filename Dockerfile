# Root Dockerfile for this multi-project repository.
# Default build produces the backend API image.

# --- Frontend build stages ---
FROM node:20-alpine AS frontend-deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY portfolio-frontend/package.json portfolio-frontend/package-lock.json* ./
RUN npm ci

FROM node:20-alpine AS frontend-builder
WORKDIR /app
COPY --from=frontend-deps /app/node_modules ./node_modules
COPY portfolio-frontend .
ENV NEXT_PUBLIC_API_URL=https://portfolio-backend.onrender.com/api
RUN npm run build

FROM node:20-alpine AS frontend-runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
COPY --from=frontend-builder /app/public ./public
COPY --from=frontend-builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=frontend-builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]

# --- Backend build stages ---
FROM node:20-alpine AS backend-builder
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app
COPY portfolio-backend-nestjs/package.json portfolio-backend-nestjs/package-lock.json* ./
RUN npm ci
COPY portfolio-backend-nestjs .
RUN npx prisma generate
RUN npm run build

FROM node:20-alpine AS backend-runner
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=5000
COPY portfolio-backend-nestjs/package.json portfolio-backend-nestjs/package-lock.json* ./
RUN npm ci --omit=dev
COPY --from=backend-builder /app/dist ./dist
COPY --from=backend-builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=backend-builder /app/node_modules/@prisma ./node_modules/@prisma
COPY portfolio-backend-nestjs/prisma ./prisma
EXPOSE 5000
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]

FROM backend-runner AS final
