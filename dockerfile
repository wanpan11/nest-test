# build stage
FROM node:18-alpine3.14 AS build-stage

WORKDIR /app

COPY package.json .

RUN npm config set registry https://registry.npmmirror.com/
RUN npm install

COPY . .

RUN npm run build

# production stage
FROM node:18-alpine3.14 AS production-stage

WORKDIR /app

COPY --from=build-stage /app/dist /app
COPY --from=build-stage /app/package.json /app/package.json

RUN npm config set registry https://registry.npmmirror.com/
RUN npm install --production
RUN npm install pm2 -g

EXPOSE 3000

CMD ["pm2-runtime", "/app/src/main.js"]
