FROM node:20.10.0-slim

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY ../../dist/apps/dlx-notification-api ./dist

RUN npm install pm2 -g

EXPOSE 3000

CMD [ "pm2-runtime", "dist/main.js"]
