FROM node:22-alpine AS build
WORKDIR /app
COPY package.json ./
COPY apps/worker/package.json apps/worker/package.json
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json
COPY packages/database/package.json packages/database/package.json
COPY packages/storage/package.json packages/storage/package.json
RUN npm install --include=dev --no-audit --no-fund
COPY . .
RUN npm run db:generate && npm run build -w @sahlbiz/worker

FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/apps/worker/dist ./apps/worker/dist
COPY --from=build /app/apps/worker/package.json ./apps/worker/package.json
COPY --from=build /app/package.json ./package.json
RUN chown -R node:node /app
USER node
CMD ["node", "/app/apps/worker/dist/index.js"]
