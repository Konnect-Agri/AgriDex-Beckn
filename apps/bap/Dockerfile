FROM node:lts-alpine
WORKDIR /app
COPY package*.json ./
RUN yarn
COPY . .
HEALTHCHECK CMD curl --fail http://localhost:3010/health || exit 1 
CMD ["yarn","test"]
CMD ["yarn", "start", "bap"]