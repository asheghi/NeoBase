FROM node:16

WORKDIR /app

RUN curl -f https://get.pnpm.io/v6.16.js | node - add --global pnpm

RUN npm i -g typescript typescript

COPY package.json .npmrc pnpm-lock.yaml pnpm-workspace.yaml ./

COPY packages/core/package.json ./packages/core/

COPY packages/admin-ui/package.json ./packages/admin-ui/

COPY packages/client/package.json ./packages/client/

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm build

EXPOSE 8080

CMD [ "node", "/app/packages/core/dist"]