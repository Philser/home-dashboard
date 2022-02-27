FROM node:17-alpine3.14

RUN apk add --update npm

RUN npm i -g tslint typescript

WORKDIR /app

COPY . .

CMD ["npm", "start"]
