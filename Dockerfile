FROM node:14
WORKDIR /app
COPY package.json .
RUN npm install
RUN npm install pm2
COPY . .
CMD ["pm2-runtime -i 0", "src/index.js"]


