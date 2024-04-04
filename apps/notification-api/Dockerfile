FROM node:20.10.0-slim

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY ../../dist/apps/notification-api ./dist

RUN npm install pm2 -g

CMD [ "pm2-runtime", "dist/main.js"]
