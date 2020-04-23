FROM node:12

# Create app directory
ADD . /code

WORKDIR /code

# Install app dependencies
COPY package*.json ./

RUN npm run preinstall

RUN npm install


CMD ["npm", "start"]

COPY . .

EXPOSE 8080