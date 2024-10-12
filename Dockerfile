FROM node:21-alpine3.18


WORKDIR /usr/src/app

COPY package.json /usr/src/app/

RUN npm install --force
COPY . /usr/src/app/

RUN npm run build

EXPOSE 3001

RUN npm install -g serve

CMD ["serve", "-s", "build"]