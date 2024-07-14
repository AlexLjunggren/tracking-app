FROM node:18.17.1

WORKDIR /usr/src/app

COPY ./app /usr/src/app

RUN chmod +x -R /usr/src/app

RUN npm install

CMD ["npm", "start"]
