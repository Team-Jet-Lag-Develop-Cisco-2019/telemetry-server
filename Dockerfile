FROM node:10.17.0-alpine3.10

WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm ci --only=production

# Bundle app source
COPY . .

# MQTT Broker
EXPOSE 1883

# Websocket Server
EXPOSE 9999

ENV LOG_LEVEL=debug
ENV LOG_FILE=/data/log/edgedb.log

CMD [ "npm", "start" ]
