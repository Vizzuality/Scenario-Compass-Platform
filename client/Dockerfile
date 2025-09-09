FROM node:24.3.0-alpine3.21 AS base

FROM base AS deps
WORKDIR /app

COPY package.json pnpm-lock.yaml* .pnpm-workspace.yaml* ./
RUN corepack enable pnpm && pnpm i --frozen-lockfile;


FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG NEXT_PUBLIC_API_BASE_URL
ARG NEXT_PUBLIC_API_APP_NAME
ARG NEXT_PUBLIC_FEATURE_FLAG_HIDE_LEARN_BY_TOPIC_PAGE

ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_API_APP_NAME=$NEXT_PUBLIC_API_APP_NAME
ENV NEXT_PUBLIC_FEATURE_FLAG_HIDE_LEARN_BY_TOPIC_PAGE=$NEXT_PUBLIC_FEATURE_FLAG_HIDE_LEARN_BY_TOPIC_PAGE

ENV NEXT_TELEMETRY_DISABLED=1

RUN --mount=type=secret,id=NEXT_PUBLIC_API_CREDENTIALS \
    export NEXT_PUBLIC_API_CREDENTIALS="$(cat /run/secrets/NEXT_PUBLIC_API_CREDENTIALS)" && \
    corepack enable pnpm && \
    pnpm run build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000

ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]
