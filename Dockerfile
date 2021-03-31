FROM node:15.12.0-alpine AS builder

WORKDIR /app

COPY package-lock.json .
COPY package.json .

COPY . .

RUN npm i && npm run build

FROM nginx:alpine

COPY --from=builder /app/build/* /usr/share/nginx/html/