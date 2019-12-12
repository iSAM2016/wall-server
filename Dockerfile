FROM node:10.13-alpine
ENV NODE_ENV production
WORKDIR /usr/src/app
COPY ["package.json", "./"]
RUN npm install --production --silent 
COPY . .
EXPOSE 3000
CMD npm start