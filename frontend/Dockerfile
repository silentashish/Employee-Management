FROM node:18-alpine
WORKDIR /usr/src/app/frontend
COPY package*.json ./
RUN yarn install && yarn cache clean
ENV PORT 4000
EXPOSE 4000
CMD ["yarn", "dev", "-p", "4000"]
