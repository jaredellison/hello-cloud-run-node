FROM node:18-bullseye-slim AS build
WORKDIR /usr/src/app
COPY . /usr/src/app
RUN yarn install --frozen-lockfile
RUN yarn build
RUN yarn install --production --ignore-scripts --prefer-offline --frozen-lockfile

FROM gcr.io/distroless/nodejs18-debian11
WORKDIR /usr/src/app
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/node_modules /usr/src/node_modules
CMD ["-r", "source-map-support/register", "dist/server.js"]