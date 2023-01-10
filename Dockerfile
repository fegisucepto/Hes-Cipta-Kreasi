FROM node:14-alpine
RUN apk add chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV TZ=Asia/Jakarta

WORKDIR /app

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV

COPY package*.json /app/

RUN npm install

COPY . /app

ARG PORT
ENV PORT $PORT
EXPOSE $PORT

RUN npm run build

USER node

CMD [ "node", "--max-old-space-size=8192", "./dist/bin/www" ]