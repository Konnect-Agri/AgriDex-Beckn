FROM node:lts-alpine
WORKDIR /app
COPY package*.json ./
RUN yarn
COPY . .
HEALTHCHECK --interval=5s --timeout=3s --retries=3 \
      CMD curl -f http://localhost:3002/health || exit 1
CMD ["yarn","test"]
CMD ["yarn", "start", "bpp"]