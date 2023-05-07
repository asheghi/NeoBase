FROM node:16

WORKDIR /usr/app

RUN curl -f https://get.pnpm.io/v6.16.js | node - add --global pnpm

COPY package.json .npmrc pnpm-workspace.yaml pnpm-lock.yaml ./

COPY packages/core/package.json ./packages/core/

COPY packages/admin-ui/package.json ./packages/admin-ui/

COPY packages/client/package.json ./packages/client/

RUN pnpm install --frozen-lockfile --prod

COPY . .

RUN pnpm build

EXPOSE 8080

CMD [ "node", "packages/core" ]