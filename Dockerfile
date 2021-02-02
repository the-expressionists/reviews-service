FROM node:14

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8081

ARG BUILD_SERVER_URL=''

ENV SERVER_URL=BUILD_SERVER_URL

ENTRYPOINT ["python3", "init.py", "-r"]
