FROM node:20-alpine

WORKDIR /app

COPY ["package.json", "pnpm-lock.yaml", "./"]

RUN npm install -g pnpm && pnpm install

RUN pnpm install

COPY . .

EXPOSE 3000

CMD ["pnpm", "run", "start:dev"]
