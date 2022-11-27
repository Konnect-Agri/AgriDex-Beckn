FROM node:lts-alpine
WORKDIR /app
COPY package*.json ./
RUN yarn
COPY . .
CMD ["yarn", "start", "test-api"]