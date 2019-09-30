FROM node:12-alpine
MAINTAINER ismaail <contact@ismaail.com>

# set environmental property for node modules
ENV NODE_PATH /usr/lib/node_modules/

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install

# Bundle app source
COPY ./app/server.js /usr/src/app/server.js
COPY ./app/public /usr/src/app/public

EXPOSE 8200

CMD ["npm", "start"]
