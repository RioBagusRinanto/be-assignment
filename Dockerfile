FROM node:14-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install 
COPY . .

EXPOSE 8001

# Command to run the application
CMD ["node", "index.js"]
