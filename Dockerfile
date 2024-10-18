# develop stage
FROM node:18-slim as develop-stage
WORKDIR /app
## install global dependencies
RUN npm install -g nuxt@2.18
## copy package.json and install dependencies
COPY package*.json ./
RUN npm install
## copy the rest of the app
COPY . .

# build stage
FROM develop-stage as build-stage
## build app
WORKDIR /app
COPY deploy/nightly/.env.docker ./
RUN npx nuxt generate --dotenv .env.docker

# production stage
FROM nginx:1.23.3-alpine as production-stage
COPY --from=build-stage /app/dist/ /usr/share/nginx/html/
COPY deploy/nightly/nginx/default.conf /etc/nginx/conf.d/
EXPOSE 6081
CMD ["nginx", "-g", "daemon off;"]
