### Build ###
FROM node:14.16.1-alpine AS build
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install
COPY . .

EXPOSE 80
CMD [ "npm", "start" ]