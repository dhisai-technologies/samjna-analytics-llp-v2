ARG NODE_VERSION=20.10.0

# Alpine image
FROM node:${NODE_VERSION}-alpine AS alpine
RUN apk update
RUN apk add --no-cache libc6-compat

# Setup pnpm and turbo on the alpine base
FROM alpine AS base
RUN npm install pnpm turbo --global
RUN pnpm config set store-dir ~/.pnpm-store

# Prune
FROM base AS pruner

WORKDIR /app
COPY . .
RUN turbo prune --scope=@apps/interview --docker

# Build
FROM base AS builder

WORKDIR /app

# Copy lockfile and package.json's of isolated subworkspace
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=pruner /app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=pruner /app/out/json/ .

# First install the dependencies (as they change less often)
# RUN --mount=type=cache,id=pnpm,target=~/.pnpm-store pnpm install --no-frozen-lockfile
# Ensure fresh pnpm cache and retries
RUN mkdir -p /root/.pnpm-store/v3/files \
    && pnpm config set registry https://registry.npmmirror.com \
    && pnpm config set fetch-retry-mintimeout 30000 \
    && pnpm config set fetch-retry-maxtimeout 60000 \
    && pnpm store prune && pnpm store clear
RUN pnpm install --no-frozen-lockfile --force

# Copy source code of isolated subworkspace
COPY --from=pruner /app/out/full/ .

RUN turbo build --filter=@apps/interview
RUN --mount=type=cache,id=pnpm,target=~/.pnpm-store pnpm prune --prod --no-optional
RUN rm -rf ./**/*/src

#Final image
FROM alpine AS runner

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

WORKDIR /app

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/apps/interview/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/interview/.next/static ./apps/interview/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/interview/public ./apps/interview/public

ARG PORT=3002
ENV PORT=${PORT}
ENV NODE_ENV=production
EXPOSE ${PORT}

CMD ["node", "apps/interview/server.js"]