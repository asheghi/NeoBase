FROM node:14

WORKDIR /app

RUN npm install -g pnpm@^7 

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile 

COPY . .

RUN node_modules/.bin/tsc 

ENV LISTEN_PORT=8080

EXPOSE ${LISTEN_PORT}

CMD [ "npm", "start" ]
