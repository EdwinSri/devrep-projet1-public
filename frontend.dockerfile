FROM node:alpine3.15

RUN mkdir -p /app
WORKDIR /app
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
EXPOSE $PORT
CMD [ "npm", "run", "dev" ]