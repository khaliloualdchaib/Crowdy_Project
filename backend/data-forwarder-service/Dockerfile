FROM node:14
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
ENV PORT=8009
CMD ["node", "server.js"]