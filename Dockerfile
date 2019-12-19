FROM node:10

# Create app directory
WORKDIR /usr/src/app
ENV NODE_ENV=production

COPY package*.json ./

RUN npm install --production && \
    npm install npm-check

# Bundle app source
COPY . .

EXPOSE 3000

CMD [ "node", "src/app.js" ]