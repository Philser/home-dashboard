FROM node:17-alpine3.14

WORKDIR /app

RUN apk add --update make g++ npm python3 && npm i -g tslint typescript

COPY package*.json ./

RUN npm i

COPY . .

CMD ["npm", "start"]
