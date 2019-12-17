FROM node:10

# Create app directory
WORKDIR /usr/src/app
ENV NODE_ENV=production

COPY package*.json ./

RUN npm install

# Bundle app source
COPY src/* .

EXPOSE 3000

CMD [ "node", "app.js" ]