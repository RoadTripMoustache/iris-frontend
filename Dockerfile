FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY ./assets ./assets
COPY ./components ./components
COPY ./composables ./composables
COPY ./i18n ./i18n
COPY ./layouts ./layouts
COPY ./pages ./pages
COPY ./plugins ./plugins
COPY ./public ./public
COPY ./server ./server
COPY ./app.vue ./app.vue
COPY ./content.config.ts ./content.config.ts
COPY ./error.vue ./error.vue
COPY ./eslint.config.mjs ./eslint.config.mjs
COPY ./nuxt.config.ts ./nuxt.config.ts
COPY ./package.json ./package.json
COPY ./tsconfig.json ./tsconfig.json

RUN export NODE_OPTIONS=--max_old_space_size=4096 && npm run build

FROM node:18-alpine

WORKDIR /app

COPY --from=build /app/.output ./.output
COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules

CMD ["node", ".output/server/index.mjs"]

EXPOSE 3000
