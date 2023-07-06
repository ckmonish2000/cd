FROM node:16.18.1-alpine as builder

WORKDIR /usr/src/app

COPY package.json .
COPY yarn.lock .

RUN --mount=type=cache,target=/root/.yarn \
    YARN_CACHE_FOLDER=/root/.yarn && \
    yarn install

COPY . .

RUN npx prisma generate --schema=$PWD/src/prisma/schema.prisma 

FROM builder as dev

EXPOSE 3000

CMD [ "yarn","dev" ]

