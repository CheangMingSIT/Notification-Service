FROM node:20.10.0-slim

WORKDIR /app

COPY package*.json ./
COPY pnpm-lock.yaml ./
COPY tsconfig.json ./
COPY nest-cli.json ./

RUN npm install -g pnpm

RUN pnpm install

COPY ../../dist/apps/worker-service ./dist

RUN npm install pm2 -g

EXPOSE 3000

CMD [ "pm2-runtime", "dist/main.js"]
