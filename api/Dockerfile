FROM node:alpine

WORKDIR /usr/src/api

COPY package*.json ./

RUN npm config set registry http://registry.npmjs.org/

RUN npm install --no-package-lock

COPY . .

EXPOSE 5000

CMD ["npm", "start"]