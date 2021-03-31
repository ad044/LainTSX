FROM node:15.12.0-alpine AS builder

WORKDIR /app

COPY scripts/ ./scripts
COPY package-lock.json .
COPY package.json .

RUN npm i

COPY . .

RUN npm run build

RUN ls build/

FROM nginx:alpine

COPY --from=builder /app/build/ /usr/share/nginx/html/