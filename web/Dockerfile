FROM node:20-alpine

COPY src app/src
COPY package.json app
COPY tsconfig.json app
COPY nuxt.config.ts app

WORKDIR app

RUN npm install
RUN npm run build

ENV PORT=3000
ENV HOST=0.0.0.0

EXPOSE 3000

CMD ["npm", "run", "start"]
