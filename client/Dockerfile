FROM node:alpine AS build

WORKDIR /usr/src/client

COPY package*.json ./

RUN npm config set registry http://registry.npmjs.org/

RUN npm install --no-package-lock

COPY . .

RUN npm run-script build 

FROM nginx:stable-alpine

COPY --from=build usr/src/client/build /usr/share/nginx/html

COPY --from=build usr/src/client/nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]