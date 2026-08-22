FROM node:22-alpine AS build
WORKDIR /app
COPY package.json ./
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json
COPY apps/worker/package.json apps/worker/package.json
COPY packages/database/package.json packages/database/package.json
COPY packages/storage/package.json packages/storage/package.json
RUN npm install --include=dev --no-audit --no-fund
COPY . .
RUN npm run db:generate && npm run build -w @sahlbiz/storage && npm run build -w @sahlbiz/api

FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/apps/api/package.json apps/api/package.json
COPY --from=build /app/apps/api/dist apps/api/dist
COPY --from=build /app/packages/database packages/database
COPY --from=build /app/packages/storage/package.json packages/storage/package.json
COPY --from=build /app/packages/storage/dist packages/storage/dist
COPY --from=build /app/infra/api/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh && chown -R node:node /app
EXPOSE 4000
USER node
ENTRYPOINT ["/entrypoint.sh"]
