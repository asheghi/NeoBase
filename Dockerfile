FROM node:14

# Create app directory
WORKDIR /app

#install pnpm
RUN npm install -g pnpm@^7

# Files required by pnpm install
COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile --prod

# Bundle app source
COPY . .

ENV LISTEN_PORT=8080
EXPOSE ${LISTEN_PORT}
CMD [ "npm", "start" ]
