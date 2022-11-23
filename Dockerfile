FROM node:19

WORKDIR /usr/src/app
COPY dist .

RUN npm install pm2 -g

EXPOSE 3000
CMD ["pm2-runtime", "/usr/src/app/dist/index.js"]